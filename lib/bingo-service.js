import { supabaseAdmin } from './supabase-client.js';
import Stripe from 'stripe';

const BOARD_SIZE       = 100;
const PRICE_FLAG_RATIO = 0.5;   // flag if price differs >50% from last known
const AUTO_VERIFY_COUNT = 3;    // auto-verify after this many matching submissions
const VALID_STORE_SLUGS = ['wegmans', 'aldi', 'traderjoes', 'weis'];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── Week helpers ──────────────────────────────────────────────────────────────

/** Returns ISO week string like "2026-W15". */
export function getWeekId(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Returns next Monday at 5:00 AM UTC (midnight EST) as ISO string. */
export function nextResetISO() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon
  const daysUntil = day === 1 ? 7 : (8 - day) % 7 || 7;
  const next = new Date(now);
  next.setUTCDate(now.getUTCDate() + daysUntil);
  next.setUTCHours(5, 0, 0, 0);
  return next.toISOString();
}

// ── Store lookup ──────────────────────────────────────────────────────────────

async function getStore(slug) {
  const { data, error } = await supabaseAdmin
    .from('stores')
    .select('id, name, slug')
    .eq('slug', slug)
    .single();
  if (error || !data) throw new Error(`Store '${slug}' not found`);
  return data;
}

// ── Board generation ──────────────────────────────────────────────────────────

async function selectProductsForBoard(storeId) {
  // All products
  const { data: allProducts } = await supabaseAdmin
    .from('products')
    .select('id, name, category, default_unit');

  if (!allProducts?.length) throw new Error('No products in master list');

  // Get most recent submission date per product for this store
  const { data: history } = await supabaseAdmin
    .from('price_history')
    .select('product_id, submitted_at')
    .eq('store_id', storeId)
    .order('submitted_at', { ascending: false });

  const lastPricedMap = {};
  (history ?? []).forEach(row => {
    if (!lastPricedMap[row.product_id]) {
      lastPricedMap[row.product_id] = new Date(row.submitted_at).getTime();
    }
  });

  // Sort: never-priced (0) first, then oldest-priced
  const sorted = [...allProducts].sort((a, b) =>
    (lastPricedMap[a.id] ?? 0) - (lastPricedMap[b.id] ?? 0)
  );

  // Take top BOARD_SIZE and shuffle for random grid layout
  const selected = sorted.slice(0, BOARD_SIZE);
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }
  return selected;
}

async function generateBoard(store, weekId) {
  const products = await selectProductsForBoard(store.id);

  // Insert board row
  const { data: board, error: boardErr } = await supabaseAdmin
    .from('bingo_boards')
    .insert({ store_id: store.id, week_id: weekId, archived: false })
    .select('id, store_id, week_id')
    .single();

  if (boardErr) throw boardErr;

  // Insert 100 board_items
  const boardItems = products.map((p, i) => ({
    board_id:     board.id,
    product_id:   p.id,
    position:     i,
    claimed_by:   null,
    price:        null,
    unit:         p.default_unit,
    photo_url:    null,
    submitted_at: null,
    verified:     false,
    flagged:      false,
  }));

  const { data: items, error: itemsErr } = await supabaseAdmin
    .from('board_items')
    .insert(boardItems)
    .select('id, position, product_id, claimed_by, price, unit, submitted_at, verified, flagged, products(id, name, category, default_unit, upc)');

  if (itemsErr) throw itemsErr;

  return { ...board, storeName: store.name, storeSlug: store.slug, items: items ?? [] };
}

// ── Get active board ──────────────────────────────────────────────────────────

export async function getActiveBoard(storeSlug) {
  const store  = await getStore(storeSlug);
  const weekId = getWeekId();

  const { data: board } = await supabaseAdmin
    .from('bingo_boards')
    .select('id, store_id, week_id')
    .eq('store_id', store.id)
    .eq('week_id', weekId)
    .eq('archived', false)
    .single();

  if (board) {
    const { data: items } = await supabaseAdmin
      .from('board_items')
      .select('id, position, product_id, claimed_by, price, unit, submitted_at, verified, flagged, products(id, name, category, default_unit, upc)')
      .eq('board_id', board.id)
      .order('position');

    return { ...board, storeName: store.name, storeSlug: store.slug, items: items ?? [] };
  }

  return generateBoard(store, weekId);
}

/**
 * Annotate board items with claimStatus relative to the requesting user.
 * claimStatus: 'open' | 'mine' | 'taken' | 'pending'
 */
export function annotateBoard(board, userId) {
  return {
    ...board,
    items: board.items.map(item => {
      let claimStatus;
      if (!item.claimed_by)                        claimStatus = 'open';
      else if (item.claimed_by === userId)          claimStatus = 'mine';
      else if (item.flagged && !item.verified)      claimStatus = 'pending';
      else                                          claimStatus = 'taken';

      return {
        boardItemId:  item.id,
        position:     item.position,
        productId:    item.product_id,
        name:         item.products?.name ?? 'Unknown',
        category:     item.products?.category ?? 'pantry',
        defaultUnit:  item.products?.default_unit ?? 'each',
        upc:          item.products?.upc ?? null,
        claimStatus,
        price:        item.price,
        unit:         item.unit,
        submittedAt:  item.submitted_at,
        verified:     item.verified,
        flagged:      item.flagged,
      };
    }),
  };
}

// ── Claiming (atomic) ─────────────────────────────────────────────────────────

/**
 * Atomically claim a board item using UPDATE ... WHERE claimed_by IS NULL.
 * Postgres guarantees only the first concurrent writer wins.
 */
export async function claimItem(boardItemId, userId, { price, unit, photoUrl }) {
  // Get board_item to find board → store context
  const { data: existing } = await supabaseAdmin
    .from('board_items')
    .select('id, claimed_by, product_id, bingo_boards(id, store_id, week_id)')
    .eq('id', boardItemId)
    .single();

  if (!existing) return { success: false, reason: 'Board item not found' };
  if (existing.claimed_by) return { success: false, reason: 'Item already claimed' };

  const storeId   = existing.bingo_boards?.store_id;
  const productId = existing.product_id;

  // Check last known price → flag if >50% different
  let flagged = false;
  const { data: lastPrice } = await supabaseAdmin
    .from('price_history')
    .select('price')
    .eq('store_id', storeId)
    .eq('product_id', productId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  if (lastPrice?.price) {
    const diff = Math.abs(price - lastPrice.price) / lastPrice.price;
    if (diff > PRICE_FLAG_RATIO) flagged = true;
  }

  // Atomic update — only succeeds if claimed_by IS NULL
  const { data: claimed, error } = await supabaseAdmin
    .from('board_items')
    .update({
      claimed_by:   userId,
      price:        parseFloat(price.toFixed(2)),
      unit,
      photo_url:    photoUrl ?? null,
      submitted_at: new Date().toISOString(),
      verified:     !flagged,
      flagged,
    })
    .eq('id', boardItemId)
    .is('claimed_by', null)   // <- the race-condition guard
    .select()
    .single();

  if (error || !claimed) {
    return { success: false, reason: 'Item already claimed' };
  }

  // Write price history
  await supabaseAdmin.from('price_history').insert({
    store_id:     storeId,
    product_id:   productId,
    price:        claimed.price,
    unit,
    user_id:      userId,
    verified:     !flagged,
    submitted_at: new Date().toISOString(),
  });

  // Check auto-verify: if 3 similar prices now exist, mark verified
  if (flagged) await tryAutoVerify(boardItemId, storeId, productId, price);

  // Increment user progress
  await incrementProgress(userId, storeId, existing.bingo_boards.week_id);

  // Check board completion (100 items)
  const completed = await checkBoardCompletion(userId, existing.bingo_boards.id);

  return { success: true, claim: claimed, flagged, completed };
}

async function tryAutoVerify(boardItemId, storeId, productId, currentPrice) {
  const { data: recent } = await supabaseAdmin
    .from('price_history')
    .select('price')
    .eq('store_id', storeId)
    .eq('product_id', productId)
    .order('submitted_at', { ascending: false })
    .limit(AUTO_VERIFY_COUNT);

  if (!recent || recent.length < AUTO_VERIFY_COUNT) return;

  const avg = recent.reduce((s, r) => s + r.price, 0) / recent.length;
  const allClose = recent.every(r => Math.abs(r.price - avg) / avg < PRICE_FLAG_RATIO);

  if (allClose) {
    await supabaseAdmin
      .from('board_items')
      .update({ verified: true, flagged: false })
      .eq('id', boardItemId);
  }
}

async function incrementProgress(userId, storeId, weekId) {
  const { data: existing } = await supabaseAdmin
    .from('user_bingo_progress')
    .select('id, items_submitted')
    .eq('user_id', userId)
    .eq('store_id', storeId)
    .eq('week_id', weekId)
    .single();

  if (existing) {
    await supabaseAdmin
      .from('user_bingo_progress')
      .update({ items_submitted: existing.items_submitted + 1 })
      .eq('id', existing.id);
  } else {
    await supabaseAdmin
      .from('user_bingo_progress')
      .insert({ user_id: userId, store_id: storeId, week_id: weekId, items_submitted: 1 });
  }
}

async function checkBoardCompletion(userId, boardId) {
  const { count } = await supabaseAdmin
    .from('board_items')
    .select('id', { count: 'exact', head: true })
    .eq('board_id', boardId)
    .eq('claimed_by', userId);

  return (count ?? 0) >= BOARD_SIZE;
}

// ── Progress ──────────────────────────────────────────────────────────────────

export async function getUserProgress(userId, storeSlug) {
  const store  = await getStore(storeSlug);
  const weekId = getWeekId();

  const { data } = await supabaseAdmin
    .from('user_bingo_progress')
    .select('items_submitted, week_id, store_id')
    .eq('user_id', userId)
    .eq('store_id', store.id)
    .eq('week_id', weekId)
    .single();

  return data ?? { items_submitted: 0, week_id: weekId, store_id: store.id };
}

// ── Rewards ───────────────────────────────────────────────────────────────────

export async function applyCompletionReward(userId) {
  const now      = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Max one discount per user per calendar month
  const { data: existing } = await supabaseAdmin
    .from('user_rewards')
    .select('id')
    .eq('user_id', userId)
    .eq('discount_month', monthKey)
    .single();

  if (existing) return null; // already rewarded this month

  let stripePromoCode = null;
  try {
    const coupon = await stripe.coupons.create({
      percent_off:     10,
      duration:        'once',
      name:            '$mart Cart Bingo Reward',
      max_redemptions: 1,
      metadata:        { userId, monthKey },
    });
    const promo = await stripe.promotionCodes.create({
      coupon:          coupon.id,
      max_redemptions: 1,
      metadata:        { userId },
    });
    stripePromoCode = promo.code;
  } catch (err) {
    console.error('Stripe promo creation failed:', err.message);
  }

  const { data: reward } = await supabaseAdmin
    .from('user_rewards')
    .insert({
      user_id:         userId,
      discount_month:  monthKey,
      stripe_promo_id: stripePromoCode,
      applied:         false,
      earned_at:       new Date().toISOString(),
    })
    .select()
    .single();

  return reward;
}

export async function getUserReward(userId) {
  const now      = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { data } = await supabaseAdmin
    .from('user_rewards')
    .select('stripe_promo_id, applied, earned_at')
    .eq('user_id', userId)
    .eq('discount_month', monthKey)
    .single();

  return data ?? null;
}

// ── Weekly reset ──────────────────────────────────────────────────────────────

export async function resetAllBoards() {
  const weekId  = getWeekId();
  const results = [];

  for (const slug of VALID_STORE_SLUGS) {
    try {
      const store = await getStore(slug);

      // Archive current active board
      const { data: board } = await supabaseAdmin
        .from('bingo_boards')
        .select('id')
        .eq('store_id', store.id)
        .eq('week_id', weekId)
        .eq('archived', false)
        .single();

      if (board) {
        await supabaseAdmin
          .from('bingo_boards')
          .update({ archived: true })
          .eq('id', board.id);
      }

      // Pre-generate the new board
      const newBoard = await getActiveBoard(slug);
      results.push({ store: slug, success: true, newWeekId: newBoard.week_id });
    } catch (err) {
      console.error(`Reset failed for ${slug}:`, err.message);
      results.push({ store: slug, success: false, error: err.message });
    }
  }

  return results;
}
