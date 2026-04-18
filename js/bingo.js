// ── Product catalog ──────────────────────────────────────────────────────────
const PRODUCTS = [
  // Wegmans — 20 items
  { id:  1, store:'wegmans',    storeName:'Wegmans',       name:'Organic Whole Milk',       category:'dairy',     icon:'🥛', unit:'per gallon' },
  { id:  2, store:'wegmans',    storeName:'Wegmans',       name:'Free Range Eggs',          category:'dairy',     icon:'🥚', unit:'per dozen'  },
  { id:  3, store:'wegmans',    storeName:'Wegmans',       name:'Sourdough Bread',          category:'bakery',    icon:'🍞', unit:'each'       },
  { id:  4, store:'wegmans',    storeName:'Wegmans',       name:'Boneless Chicken Breast',  category:'meat',      icon:'🥩', unit:'per lb'     },
  { id:  5, store:'wegmans',    storeName:'Wegmans',       name:'Fuji Apples',              category:'produce',   icon:'🍎', unit:'per lb'     },
  { id:  6, store:'wegmans',    storeName:'Wegmans',       name:'Spaghetti 16oz',           category:'pantry',    icon:'🥫', unit:'each'       },
  { id:  7, store:'wegmans',    storeName:'Wegmans',       name:'Jasmine Rice 5lb',         category:'pantry',    icon:'🥫', unit:'each'       },
  { id:  8, store:'wegmans',    storeName:'Wegmans',       name:'Greek Yogurt 32oz',        category:'dairy',     icon:'🥛', unit:'each'       },
  { id:  9, store:'wegmans',    storeName:'Wegmans',       name:'Baby Spinach 5oz',         category:'produce',   icon:'🥦', unit:'each'       },
  { id: 10, store:'wegmans',    storeName:'Wegmans',       name:'Orange Juice 64oz',        category:'beverages', icon:'🥤', unit:'each'       },
  { id: 11, store:'wegmans',    storeName:'Wegmans',       name:'Sharp Cheddar Cheese',     category:'dairy',     icon:'🧀', unit:'each'       },
  { id: 12, store:'wegmans',    storeName:'Wegmans',       name:'Unsalted Butter',          category:'dairy',     icon:'🧈', unit:'each'       },
  { id: 13, store:'wegmans',    storeName:'Wegmans',       name:'Strawberries 1lb',         category:'produce',   icon:'🍓', unit:'each'       },
  { id: 14, store:'wegmans',    storeName:'Wegmans',       name:'Ground Turkey 93% Lean',   category:'meat',      icon:'🥩', unit:'per lb'     },
  { id: 15, store:'wegmans',    storeName:'Wegmans',       name:'Pasta Sauce 24oz',         category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 16, store:'wegmans',    storeName:'Wegmans',       name:'Old Fashioned Oatmeal',    category:'pantry',    icon:'🥣', unit:'each'       },
  { id: 17, store:'wegmans',    storeName:'Wegmans',       name:'Frozen Broccoli 12oz',     category:'frozen',    icon:'🥦', unit:'each'       },
  { id: 18, store:'wegmans',    storeName:'Wegmans',       name:'Atlantic Salmon Fillet',   category:'meat',      icon:'🐟', unit:'per lb'     },
  { id: 19, store:'wegmans',    storeName:'Wegmans',       name:'Granola Bars 8-pack',      category:'snacks',    icon:'🍿', unit:'each'       },
  { id: 20, store:'wegmans',    storeName:'Wegmans',       name:'Black Beans 15oz',         category:'pantry',    icon:'🥫', unit:'each'       },

  // GIANT — 20 items
  { id: 21, store:'giant',      storeName:'GIANT',         name:'2% Milk',                  category:'dairy',     icon:'🥛', unit:'per gallon' },
  { id: 22, store:'giant',      storeName:'GIANT',         name:'Large Eggs',               category:'dairy',     icon:'🥚', unit:'per dozen'  },
  { id: 23, store:'giant',      storeName:'GIANT',         name:'White Sandwich Bread',     category:'bakery',    icon:'🍞', unit:'each'       },
  { id: 24, store:'giant',      storeName:'GIANT',         name:'Ground Beef 80/20',        category:'meat',      icon:'🥩', unit:'per lb'     },
  { id: 25, store:'giant',      storeName:'GIANT',         name:'Bananas',                  category:'produce',   icon:'🍌', unit:'per lb'     },
  { id: 26, store:'giant',      storeName:'GIANT',         name:'Penne Pasta 16oz',         category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 27, store:'giant',      storeName:'GIANT',         name:'Brown Rice 2lb',           category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 28, store:'giant',      storeName:'GIANT',         name:'Sour Cream 16oz',          category:'dairy',     icon:'🥛', unit:'each'       },
  { id: 29, store:'giant',      storeName:'GIANT',         name:'Romaine Lettuce',          category:'produce',   icon:'🥬', unit:'each'       },
  { id: 30, store:'giant',      storeName:'GIANT',         name:'Apple Juice 64oz',         category:'beverages', icon:'🥤', unit:'each'       },
  { id: 31, store:'giant',      storeName:'GIANT',         name:'American Cheese Slices',   category:'dairy',     icon:'🧀', unit:'each'       },
  { id: 32, store:'giant',      storeName:'GIANT',         name:'Cream Cheese 8oz',         category:'dairy',     icon:'🧀', unit:'each'       },
  { id: 33, store:'giant',      storeName:'GIANT',         name:'Blueberries 6oz',          category:'produce',   icon:'🫐', unit:'each'       },
  { id: 34, store:'giant',      storeName:'GIANT',         name:'Chicken Thighs Bone-in',   category:'meat',      icon:'🥩', unit:'per lb'     },
  { id: 35, store:'giant',      storeName:'GIANT',         name:'Tomato Sauce 15oz',        category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 36, store:'giant',      storeName:'GIANT',         name:'Instant Oatmeal 10-pack',  category:'pantry',    icon:'🥣', unit:'each'       },
  { id: 37, store:'giant',      storeName:'GIANT',         name:'Frozen Green Peas 12oz',   category:'frozen',    icon:'🧊', unit:'each'       },
  { id: 38, store:'giant',      storeName:'GIANT',         name:'Tilapia Fillet',           category:'meat',      icon:'🐟', unit:'per lb'     },
  { id: 39, store:'giant',      storeName:'GIANT',         name:'Protein Bars 6-pack',      category:'snacks',    icon:'🍿', unit:'each'       },
  { id: 40, store:'giant',      storeName:'GIANT',         name:'Kidney Beans 15oz',        category:'pantry',    icon:'🥫', unit:'each'       },

  // ALDI — 20 items
  { id: 41, store:'aldi',       storeName:'ALDI',          name:'Whole Milk',               category:'dairy',     icon:'🥛', unit:'per gallon' },
  { id: 42, store:'aldi',       storeName:'ALDI',          name:'Brown Eggs 1 Dozen',       category:'dairy',     icon:'🥚', unit:'per dozen'  },
  { id: 43, store:'aldi',       storeName:'ALDI',          name:'Multigrain Bread',         category:'bakery',    icon:'🍞', unit:'each'       },
  { id: 44, store:'aldi',       storeName:'ALDI',          name:'Pork Chops Boneless',      category:'meat',      icon:'🥩', unit:'per lb'     },
  { id: 45, store:'aldi',       storeName:'ALDI',          name:'Gala Apples 3lb Bag',      category:'produce',   icon:'🍎', unit:'each'       },
  { id: 46, store:'aldi',       storeName:'ALDI',          name:'Rotini Pasta 16oz',        category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 47, store:'aldi',       storeName:'ALDI',          name:'Long Grain White Rice',    category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 48, store:'aldi',       storeName:'ALDI',          name:'Plain Greek Yogurt 32oz',  category:'dairy',     icon:'🥛', unit:'each'       },
  { id: 49, store:'aldi',       storeName:'ALDI',          name:'Iceberg Lettuce',          category:'produce',   icon:'🥬', unit:'each'       },
  { id: 50, store:'aldi',       storeName:'ALDI',          name:'Grape Juice 64oz',         category:'beverages', icon:'🥤', unit:'each'       },
  { id: 51, store:'aldi',       storeName:'ALDI',          name:'Colby Jack Cheese 8oz',    category:'dairy',     icon:'🧀', unit:'each'       },
  { id: 52, store:'aldi',       storeName:'ALDI',          name:'Salted Butter',            category:'dairy',     icon:'🧈', unit:'each'       },
  { id: 53, store:'aldi',       storeName:'ALDI',          name:'Raspberries 6oz',          category:'produce',   icon:'🍇', unit:'each'       },
  { id: 54, store:'aldi',       storeName:'ALDI',          name:'Ground Chicken 1lb',       category:'meat',      icon:'🥩', unit:'each'       },
  { id: 55, store:'aldi',       storeName:'ALDI',          name:'Alfredo Sauce 15oz',       category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 56, store:'aldi',       storeName:'ALDI',          name:'Steel Cut Oats 2lb',       category:'pantry',    icon:'🥣', unit:'each'       },
  { id: 57, store:'aldi',       storeName:'ALDI',          name:'Frozen Sweet Corn 12oz',   category:'frozen',    icon:'🌽', unit:'each'       },
  { id: 58, store:'aldi',       storeName:'ALDI',          name:'Cod Fillet',               category:'meat',      icon:'🐟', unit:'per lb'     },
  { id: 59, store:'aldi',       storeName:'ALDI',          name:'Trail Mix Snack Bars',     category:'snacks',    icon:'🍿', unit:'each'       },
  { id: 60, store:'aldi',       storeName:'ALDI',          name:'Pinto Beans 15oz',         category:'pantry',    icon:'🥫', unit:'each'       },

  // Trader Joe's — 20 items
  { id: 61, store:'traderjoes', storeName:"Trader Joe's",  name:'Almond Milk 32oz',         category:'beverages', icon:'🥤', unit:'each'       },
  { id: 62, store:'traderjoes', storeName:"Trader Joe's",  name:'Cage Free Eggs',           category:'dairy',     icon:'🥚', unit:'per dozen'  },
  { id: 63, store:'traderjoes', storeName:"Trader Joe's",  name:'Brioche Bread',            category:'bakery',    icon:'🍞', unit:'each'       },
  { id: 64, store:'traderjoes', storeName:"Trader Joe's",  name:'Turkey Breast Sliced',     category:'meat',      icon:'🥩', unit:'per lb'     },
  { id: 65, store:'traderjoes', storeName:"Trader Joe's",  name:'Organic Bananas',          category:'produce',   icon:'🍌', unit:'per lb'     },
  { id: 66, store:'traderjoes', storeName:"Trader Joe's",  name:'Fettuccine Pasta 16oz',    category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 67, store:'traderjoes', storeName:"Trader Joe's",  name:'Organic Wild Rice Blend',  category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 68, store:'traderjoes', storeName:"Trader Joe's",  name:'Coconut Yogurt 16oz',      category:'dairy',     icon:'🥥', unit:'each'       },
  { id: 69, store:'traderjoes', storeName:"Trader Joe's",  name:'Arugula Mix 5oz',          category:'produce',   icon:'🥬', unit:'each'       },
  { id: 70, store:'traderjoes', storeName:"Trader Joe's",  name:'Sparkling Water 12-pack',  category:'beverages', icon:'💧', unit:'each'       },
  { id: 71, store:'traderjoes', storeName:"Trader Joe's",  name:'Brie Cheese 8oz',          category:'dairy',     icon:'🧀', unit:'each'       },
  { id: 72, store:'traderjoes', storeName:"Trader Joe's",  name:'Grass Fed Butter',         category:'dairy',     icon:'🧈', unit:'each'       },
  { id: 73, store:'traderjoes', storeName:"Trader Joe's",  name:'Mango Chunks Frozen',      category:'frozen',    icon:'🥭', unit:'each'       },
  { id: 74, store:'traderjoes', storeName:"Trader Joe's",  name:'Chicken Sausage Links',    category:'meat',      icon:'🌭', unit:'each'       },
  { id: 75, store:'traderjoes', storeName:"Trader Joe's",  name:'Tikka Masala Sauce',       category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 76, store:'traderjoes', storeName:"Trader Joe's",  name:'Granola 16oz',             category:'pantry',    icon:'🥣', unit:'each'       },
  { id: 77, store:'traderjoes', storeName:"Trader Joe's",  name:'Cauliflower Rice 12oz',    category:'frozen',    icon:'🌿', unit:'each'       },
  { id: 78, store:'traderjoes', storeName:"Trader Joe's",  name:'Ahi Tuna Steak',           category:'meat',      icon:'🐟', unit:'per lb'     },
  { id: 79, store:'traderjoes', storeName:"Trader Joe's",  name:'Dried Fruit & Nut Bars',   category:'snacks',    icon:'🍫', unit:'each'       },
  { id: 80, store:'traderjoes', storeName:"Trader Joe's",  name:'Chickpeas 15oz',           category:'pantry',    icon:'🥫', unit:'each'       },

  // Weis Markets — 20 items
  { id: 81, store:'weis',       storeName:'Weis Markets',  name:'Skim Milk',                category:'dairy',     icon:'🥛', unit:'per gallon' },
  { id: 82, store:'weis',       storeName:'Weis Markets',  name:'Extra Large Eggs',         category:'dairy',     icon:'🥚', unit:'per dozen'  },
  { id: 83, store:'weis',       storeName:'Weis Markets',  name:'Rye Bread',                category:'bakery',    icon:'🍞', unit:'each'       },
  { id: 84, store:'weis',       storeName:'Weis Markets',  name:'Beef Sirloin Steak',       category:'meat',      icon:'🥩', unit:'per lb'     },
  { id: 85, store:'weis',       storeName:'Weis Markets',  name:'Red Delicious Apples',     category:'produce',   icon:'🍎', unit:'per lb'     },
  { id: 86, store:'weis',       storeName:'Weis Markets',  name:'Angel Hair Pasta 16oz',    category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 87, store:'weis',       storeName:'Weis Markets',  name:'Basmati Rice 2lb',         category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 88, store:'weis',       storeName:'Weis Markets',  name:'Low-Fat Yogurt 32oz',      category:'dairy',     icon:'🥛', unit:'each'       },
  { id: 89, store:'weis',       storeName:'Weis Markets',  name:'Fresh Kale Bunch',         category:'produce',   icon:'🥬', unit:'each'       },
  { id: 90, store:'weis',       storeName:'Weis Markets',  name:'Lemonade 59oz',            category:'beverages', icon:'🍋', unit:'each'       },
  { id: 91, store:'weis',       storeName:'Weis Markets',  name:'Swiss Cheese 8oz',         category:'dairy',     icon:'🧀', unit:'each'       },
  { id: 92, store:'weis',       storeName:'Weis Markets',  name:'Whipped Butter',           category:'dairy',     icon:'🧈', unit:'each'       },
  { id: 93, store:'weis',       storeName:'Weis Markets',  name:'Fresh Peaches',            category:'produce',   icon:'🍑', unit:'per lb'     },
  { id: 94, store:'weis',       storeName:'Weis Markets',  name:'Turkey Burgers 4-pack',    category:'meat',      icon:'🍔', unit:'each'       },
  { id: 95, store:'weis',       storeName:'Weis Markets',  name:'Pizza Sauce 15oz',         category:'pantry',    icon:'🥫', unit:'each'       },
  { id: 96, store:'weis',       storeName:'Weis Markets',  name:'Quick Oats 42oz',          category:'pantry',    icon:'🥣', unit:'each'       },
  { id: 97, store:'weis',       storeName:'Weis Markets',  name:'Frozen Mixed Vegetables',  category:'frozen',    icon:'🧊', unit:'each'       },
  { id: 98, store:'weis',       storeName:'Weis Markets',  name:'Jumbo Shrimp 1lb',         category:'meat',      icon:'🍤', unit:'each'       },
  { id: 99, store:'weis',       storeName:'Weis Markets',  name:'Mixed Nut Bars 6-pack',    category:'snacks',    icon:'🥜', unit:'each'       },
  { id:100, store:'weis',       storeName:'Weis Markets',  name:'Black-Eyed Peas 15oz',     category:'pantry',    icon:'🥫', unit:'each'       },
];

// ── Week/progress helpers ─────────────────────────────────────────────────────

function getWeekId() {
  const d   = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setHours(0, 0, 0, 0);
  mon.setDate(d.getDate() + diff);
  return mon.toISOString().slice(0, 10);
}

function nextMonday() {
  const d    = new Date();
  const day  = d.getDay();
  const days = day === 0 ? 1 : 8 - day;
  const next = new Date(d);
  next.setDate(d.getDate() + days);
  next.setHours(0, 0, 0, 0);
  return next;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem('bingo_week_' + getWeekId());
    return raw ? JSON.parse(raw) : { completed: {} };
  } catch { return { completed: {} }; }
}

function saveProgress(p) {
  try {
    localStorage.setItem('bingo_week_' + getWeekId(), JSON.stringify(p));
    // Mark week complete if all 100 done
    if (Object.keys(p.completed).length >= 100) {
      markWeekComplete();
    }
  } catch {}
}

function markWeekComplete() {
  try {
    const key  = 'bingo_completed_weeks';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const wid  = getWeekId();
    if (!list.includes(wid)) {
      list.push(wid);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch {}
}

function countCompletedWeeksThisMonth() {
  try {
    const list  = JSON.parse(localStorage.getItem('bingo_completed_weeks') || '[]');
    const now   = new Date();
    const y     = now.getFullYear();
    const m     = now.getMonth();
    return list.filter(wid => {
      const d = new Date(wid);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  } catch { return 0; }
}

// ── State ─────────────────────────────────────────────────────────────────────
let progress      = loadProgress();   // { completed: { [id]: { price, unit, photoUrl } } }
let currentStore  = 'all';
let currentFilter = 'all';
let pendingItem   = null;
let countdown     = null;

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  updateProgress();
  updateDiscountBanner();
  startCountdown();
  bindStoreTabs();
  bindFilterBtns();
  bindModalClose();
});

// ── Store tabs ────────────────────────────────────────────────────────────────
function bindStoreTabs() {
  document.querySelectorAll('.store-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.store-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentStore = tab.dataset.store;
      applyVisibility();
    });
  });
}

// ── Filter buttons ────────────────────────────────────────────────────────────
function bindFilterBtns() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      applyVisibility();
    });
  });
}

// ── Grid render ───────────────────────────────────────────────────────────────
function renderGrid() {
  const grid = document.getElementById('bingo-grid');
  grid.innerHTML = '';
  document.getElementById('bingo-skeleton').style.display = 'none';
  grid.style.display = 'grid';

  PRODUCTS.forEach(p => {
    const done = !!progress.completed[p.id];
    const cell = document.createElement('div');
    cell.className    = 'bingo-cell ' + (done ? 'mine' : 'open');
    cell.dataset.id   = p.id;
    cell.dataset.store = p.store;
    cell.dataset.state = done ? 'mine' : 'open';
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', `${p.name} at ${p.storeName} — ${done ? 'submitted' : 'tap to submit'}`);

    const sub = done
      ? `✓ $${progress.completed[p.id].price} ${progress.completed[p.id].unit}`
      : 'Tap to submit';

    cell.innerHTML = `
      <span class="bingo-cell-icon">${p.icon}</span>
      <span class="bingo-cell-name">${escHtml(p.name)}</span>
      <span class="bingo-cell-store">${escHtml(p.storeName)}</span>
      <span class="bingo-cell-status">${escHtml(sub)}</span>
    `;

    if (!done) {
      cell.addEventListener('click', () => openModal(p));
    }
    grid.appendChild(cell);
  });

  applyVisibility();
}

function applyVisibility() {
  document.querySelectorAll('.bingo-cell').forEach(cell => {
    const storeMatch  = currentStore  === 'all' || cell.dataset.store === currentStore;
    const filterMatch = currentFilter === 'all'
      || (currentFilter === 'open' && cell.dataset.state === 'open')
      || (currentFilter === 'mine' && cell.dataset.state === 'mine');
    cell.style.display = (storeMatch && filterMatch) ? '' : 'none';
  });
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function updateProgress() {
  const count = Object.keys(progress.completed).length;
  const pct   = Math.min((count / 100) * 100, 100);
  document.getElementById('progress-count').textContent = `${count} / 100 items submitted`;
  document.getElementById('progress-fill').style.width  = `${pct}%`;
}

// ── Discount banner ───────────────────────────────────────────────────────────
function updateDiscountBanner() {
  const completedWeeks = countCompletedWeeksThisMonth();
  const thisWeekCount  = Object.keys(progress.completed).length;
  const banner         = document.getElementById('discount-banner');
  const text           = document.getElementById('discount-text');

  if (completedWeeks === 0 && thisWeekCount === 0) {
    banner.style.display = 'none';
    return;
  }

  banner.style.display = '';
  const discount = Math.min(completedWeeks, 4) * 5;

  if (discount > 0) {
    text.innerHTML = `You've earned <strong>${discount}% off</strong> your next monthly subscription! ${completedWeeks < 4 ? `Complete ${4 - completedWeeks} more week${4 - completedWeeks > 1 ? 's' : ''} to reach 20%.` : 'Max discount reached!'}`;
  } else {
    const remaining = 100 - thisWeekCount;
    text.innerHTML = `<strong>${thisWeekCount}/100</strong> submitted this week — ${remaining} more to earn 5% off!`;
  }
}

// ── Countdown timer ───────────────────────────────────────────────────────────
function startCountdown() {
  if (countdown) clearInterval(countdown);
  function tick() {
    const diff = nextMonday() - Date.now();
    if (diff <= 0) {
      document.getElementById('countdown-timer').textContent = 'Resetting…';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    document.getElementById('countdown-timer').textContent =
      d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
  }
  tick();
  countdown = setInterval(tick, 1000);
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(item) {
  pendingItem = item;
  document.getElementById('modal-title-text').textContent  = item.name;
  document.getElementById('modal-store-badge').textContent = item.storeName;
  document.getElementById('modal-item-name').textContent   = item.name;
  document.getElementById('modal-date').textContent =
    new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  document.getElementById('unit-select').value   = item.unit;
  document.getElementById('price-input').value   = '';
  document.getElementById('photo-input').value   = '';
  document.getElementById('photo-preview').style.display = 'none';
  document.getElementById('photo-preview').src   = '';
  const btn = document.getElementById('submit-btn');
  btn.disabled    = false;
  btn.textContent = 'Submit Price';
  document.getElementById('submit-modal').classList.add('open');
  setTimeout(() => document.getElementById('price-input').focus(), 200);
}

window.closeModal = function () {
  document.getElementById('submit-modal').classList.remove('open');
  pendingItem = null;
};

function bindModalClose() {
  document.getElementById('submit-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.getElementById('submit-form').addEventListener('submit', handleSubmit);

  // Photo preview
  document.getElementById('photo-input').addEventListener('change', function () {
    const file    = this.files[0];
    const preview = document.getElementById('photo-preview');
    if (!file) { preview.style.display = 'none'; return; }
    const reader  = new FileReader();
    reader.onload = e => {
      preview.src           = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });
}

function handleSubmit(e) {
  e.preventDefault();
  if (!pendingItem) return;

  const price = parseFloat(document.getElementById('price-input').value);
  const unit  = document.getElementById('unit-select').value;
  if (!price || price <= 0) { document.getElementById('price-input').focus(); return; }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true; btn.textContent = 'Saving…';

  // Read photo as data URL (stored locally — no server upload)
  const file = document.getElementById('photo-input').files[0];
  const saveEntry = (photoUrl) => {
    progress.completed[pendingItem.id] = { price, unit, photoUrl: photoUrl || null };
    saveProgress(progress);

    closeModal();
    renderGrid();
    updateProgress();
    updateDiscountBanner();

    const count = Object.keys(progress.completed).length;
    if (count === 100) {
      showCelebration();
    } else {
      showToast('Price submitted! Thanks for contributing. 🎉', 'success');
    }
  };

  if (file && file.size <= 5 * 1024 * 1024) {
    const reader = new FileReader();
    reader.onload = e => saveEntry(e.target.result);
    reader.onerror = () => saveEntry(null);
    reader.readAsDataURL(file);
  } else {
    saveEntry(null);
  }
}

// ── Celebration ───────────────────────────────────────────────────────────────
function showCelebration() {
  const completedWeeks = countCompletedWeeksThisMonth();
  const discount       = Math.min(completedWeeks, 4) * 5;
  document.getElementById('celebration-weeks').textContent    = completedWeeks;
  document.getElementById('celebration-discount').textContent = discount + '%';
  fireConfetti();
  document.getElementById('celebration-overlay').classList.add('active');
}

window.closeCelebration = function () {
  document.getElementById('celebration-overlay').classList.remove('active');
  document.getElementById('confetti-container').innerHTML = '';
};

// ── Confetti ──────────────────────────────────────────────────────────────────
function fireConfetti() {
  const container = document.getElementById('confetti-container');
  const colors    = ['#4CAF50','#66BB6A','#2E7D32','#FFD700','#FF6B6B','#4FC3F7','#CE93D8'];
  container.innerHTML = '';
  for (let i = 0; i < 120; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.cssText = `
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*.8}s;
      width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
    `;
    container.appendChild(p);
  }
  setTimeout(() => container.innerHTML = '', 4000);
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type) {
  document.getElementById('bingo-toast')?.remove();
  const bg = type === 'success' ? 'var(--green-dark)' : type === 'warning' ? '#F57F17' : '#D32F2F';
  const t  = document.createElement('div');
  t.id = 'bingo-toast';
  t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${bg};color:#fff;padding:12px 24px;border-radius:50px;font-size:.9rem;font-weight:600;z-index:3000;box-shadow:0 4px 16px rgba(0,0,0,.25);max-width:90vw;text-align:center;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

// ── Keyboard ──────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeCelebration(); }
});
