import crypto from 'crypto';
import { supabaseAdmin } from './supabase-client.js';

const BASE_URL = 'https://developer.api.walmart.com/api-proxy/service/affil/product/v2';
const PRICE_CACHE_TTL_MS   = 24 * 60 * 60 * 1000;  // 24 hours
const CATALOG_CACHE_TTL_MS =  7 * 24 * 60 * 60 * 1000; // 7 days

// ── Auth header generation ────────────────────────────────────────────────────
// Walmart Open API: RSA-SHA256 signed payload → Base64
function buildAuthHeaders() {
  const consumerId = process.env.WALMART_CONSUMER_ID;
  const privateKey = process.env.WALMART_PRIVATE_KEY.replace(/\\n/g, '\n');
  const keyVersion = '1';
  const timestamp  = Date.now().toString();
  const payload    = `${consumerId}\n${timestamp}\n${keyVersion}\n`;

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(payload);
  const signature = sign.sign(privateKey, 'base64');

  return {
    'WM_CONSUMER.ID':          consumerId,
    'WM_CONSUMER.INTIMESTAMP': timestamp,
    'WM_SEC.AUTH_SIGNATURE':   signature,
    'WM_SEC.KEY_VERSION':      keyVersion,
    'Accept':                  'application/json',
  };
}

// ── Error logging ─────────────────────────────────────────────────────────────
async function logError(endpoint, err, context = {}) {
  try {
    await supabaseAdmin.from('api_error_logs').insert({
      endpoint,
      error_message: String(err?.message ?? err),
      context,
      logged_at: new Date().toISOString(),
    });
  } catch { /* fail silently */ }
}

// ── Supabase cache helpers ────────────────────────────────────────────────────
async function getCachedProduct(walmartItemId, ttlMs) {
  const { data } = await supabaseAdmin
    .from('walmart_products')
    .select('*')
    .eq('walmart_item_id', String(walmartItemId))
    .single();

  if (!data) return null;
  if (Date.now() - new Date(data.cached_at).getTime() > ttlMs) return null;
  return normalizeFromCache(data);
}

async function cacheProducts(products) {
  if (!products.length) return;
  const rows = products.map(p => ({
    walmart_item_id: String(p.itemId),
    name:            p.name,
    price:           p.price,
    sale_price:      p.salePrice ?? null,
    image_url:       p.imageUrl ?? null,
    category:        p.category ?? null,
    upc:             p.upc ?? null,
    in_stock:        p.inStock ?? true,
    product_url:     p.productUrl ?? null,
    cached_at:       new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from('walmart_products')
    .upsert(rows, { onConflict: 'walmart_item_id' });

  if (error) await logError('walmart-cache-write', error);
}

function normalizeFromCache(row) {
  return {
    itemId:     row.walmart_item_id,
    name:       row.name,
    price:      row.price,
    salePrice:  row.sale_price,
    imageUrl:   row.image_url,
    category:   row.category,
    upc:        row.upc,
    inStock:    row.in_stock,
    productUrl: row.product_url,
    brandName:  null,
  };
}

// ── Core fetch with retry on rate-limit ───────────────────────────────────────
async function walmartFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set('format', 'json');

  const attempt = async () => fetch(url.toString(), { headers: buildAuthHeaders() });

  let res = await attempt();

  if (res.status === 429) {
    await new Promise(r => setTimeout(r, 2000));
    res = await attempt();
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Walmart API ${res.status}: ${body}`);
  }
  return res.json();
}

// ── Normalize raw Walmart item ────────────────────────────────────────────────
function normalizeProduct(item) {
  return {
    itemId:     item.itemId,
    name:       item.name,
    price:      item.salePrice ?? item.msrp ?? null,
    salePrice:  item.salePrice ?? null,
    imageUrl:   item.largeImage ?? item.mediumImage ?? item.thumbnailImage ?? null,
    category:   item.categoryPath ?? null,
    upc:        item.upc ?? null,
    inStock:    item.availableOnline ?? true,
    productUrl: item.productUrl ?? `https://www.walmart.com/ip/${item.itemId}`,
    brandName:  item.brandName ?? null,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Search Walmart products. Results are upserted into walmart_products cache.
 * Always hits the Walmart API (no query-level cache — individual products cached).
 */
export async function searchProducts(query) {
  try {
    const raw = await walmartFetch('/search', { query, numItems: 25 });
    const products = (raw.items ?? []).map(normalizeProduct);
    await cacheProducts(products);
    return products;
  } catch (err) {
    await logError('/api/walmart/search', err, { query });
    // Fallback: return whatever is in the cache for partial matches
    const { data } = await supabaseAdmin
      .from('walmart_products')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(25);
    return (data ?? []).map(normalizeFromCache);
  }
}

/**
 * Get a specific product by Walmart item ID. Checks cache first (24h TTL).
 */
export async function getProduct(itemId) {
  const cached = await getCachedProduct(itemId, PRICE_CACHE_TTL_MS);
  if (cached) return cached;

  try {
    const raw     = await walmartFetch(`/items/${itemId}`);
    const product = normalizeProduct(raw);
    await cacheProducts([product]);
    return product;
  } catch (err) {
    await logError('/api/walmart/product', err, { itemId });
    // Fallback to stale cache if API is down
    const { data } = await supabaseAdmin
      .from('walmart_products')
      .select('*')
      .eq('walmart_item_id', String(itemId))
      .single();
    if (data) return normalizeFromCache(data);
    throw err;
  }
}

/**
 * Get trending grocery items. Cached for 7 days.
 */
export async function getTrending() {
  // Check if we have recent trending data (any product cached < 7d ago)
  const { data: recent } = await supabaseAdmin
    .from('walmart_products')
    .select('*')
    .gt('cached_at', new Date(Date.now() - CATALOG_CACHE_TTL_MS).toISOString())
    .limit(25);

  if (recent && recent.length >= 10) return recent.map(normalizeFromCache);

  try {
    const raw      = await walmartFetch('/trends', { category: '976759' }); // grocery
    const products = (raw.items ?? []).map(normalizeProduct);
    await cacheProducts(products);
    return products;
  } catch (err) {
    await logError('/api/walmart/trending', err);
    return (recent ?? []).map(normalizeFromCache);
  }
}
