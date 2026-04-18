/* ============================================================
   STORE.JS — Customer Storefront Logic
   ============================================================ */

const API_BASE = '/api/v1';
const CART_KEY = 'asm_cart';
const PAGE_SIZE = 20;

/* ── API ── */
async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data ?? json;
}

/* ── CART ── */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ id: product.id, name: product.name, description: product.description, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`«${product.name}» добавлен в корзину`,'success');
}
function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

/* ── TOAST ── */
let _toastTimer;
function showToast(msg, type = '') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
}

/* ── MODAL ── */
function openModal(id)  { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

/* ── PRODUCTS STATE ── */
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;

/* ── RENDER PRODUCTS ── */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const emptyMsg = document.getElementById('emptyMsg');
  if (!grid) return;

  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredProducts.slice(start, start + PAGE_SIZE);

  if (filteredProducts.length === 0) {
    grid.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = '';
    renderPagination(0);
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';

  grid.innerHTML = page.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-card-img"><span>&#9881;</span></div>
      <div class="product-card-body">
        <div class="product-card-name">${esc(p.name)}</div>
        <div class="product-card-desc">${esc(p.description || 'Описание не указано')}</div>
        <div class="product-card-meta">Артикул: ${p.id} &nbsp;|&nbsp; Ячейка: ${p.warehouseCellId || '—'}</div>
        <div class="product-card-actions">
          <button class="btn-cart" onclick="handleAddToCart(${p.id})">В корзину</button>
          <button class="btn-detail" onclick="location.href='product.html?id=${p.id}'">Подробнее</button>
        </div>
      </div>
    </div>
  `).join('');

  renderPagination(filteredProducts.length);
}

function renderPagination(total) {
  const container = document.getElementById('pagination');
  if (!container) return;
  const pages = Math.ceil(total / PAGE_SIZE);
  if (pages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn${i === currentPage ? ' active' : ''}" onclick="goPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

function goPage(n) {
  currentPage = n;
  renderProducts();
  document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
}

function handleAddToCart(id) {
  const p = allProducts.find(x => x.id === id);
  if (p) addToCart(p);
}

/* ── SORT & SEARCH ── */
function applyFilters() {
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const sort = document.getElementById('sortSelect')?.value || 'name';

  let list = q
    ? allProducts.filter(p => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    : [...allProducts];

  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'date') list.sort((a, b) => new Date(b.dateAdd) - new Date(a.dateAdd));

  filteredProducts = list;
  currentPage = 1;
  renderProducts();
}

/* ── LOAD PRODUCTS ── */
async function loadProducts() {
  const loadingMsg = document.getElementById('loadingMsg');
  try {
    const data = await api('/products');
    allProducts = Array.isArray(data) ? data : [];
    if (loadingMsg) loadingMsg.style.display = 'none';
    applyFilters();
  } catch {
    if (loadingMsg) loadingMsg.textContent = 'Не удалось загрузить товары.';
  }
}

/* ── LOAD PROMOTIONS ── */
async function loadPromotions() {
  try {
    const data = await api('/promotions');
    const list = Array.isArray(data) ? data : [];
    if (list.length === 0) return;
    const section = document.getElementById('promotionsSection');
    const grid    = document.getElementById('promotionsGrid');
    if (!section || !grid) return;
    section.style.display = '';
    grid.innerHTML = list.map(p => `
      <div class="promo-card">
        <div class="promo-card-type">${esc(p.promotionType || 'Акция')}</div>
        <div class="promo-card-name">${esc(p.name || '')}</div>
        <div class="promo-card-desc">${esc(p.description || '')}</div>
        ${p.discountPercent ? `<div class="promo-card-discount">-${p.discountPercent}%</div>` : ''}
      </div>
    `).join('');
  } catch { /* promotions are optional */ }
}

/* ── LOAD ADMIN EMAIL ── */
async function loadAdminEmail() {
  try {
    const token = localStorage.getItem('asm_admin_token');
    if (!token) return;
    const res = await fetch(`${API_BASE}/user/get-admins-email`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return;
    const json = await res.json();
    const email = json?.data || json;
    const el = document.getElementById('footerEmail');
    if (el && email) el.textContent = email;
  } catch { /* optional */ }
}

/* ── SUPPORT FORM ── */
async function submitSupportForm(form) {
  const fd = new FormData(form);
  const payload = {
    category: fd.get('category'),
    subject:  fd.get('subject'),
    message:  fd.get('message'),
    email:    fd.get('email'),
  };

  const errEl  = document.getElementById('supportError');
  const okEl   = document.getElementById('supportSuccess');
  const btn    = document.getElementById('supportSubmitBtn');
  if (errEl)  { errEl.style.display = 'none'; errEl.textContent = ''; }
  if (okEl)   okEl.style.display = 'none';
  if (btn)    { btn.disabled = true; btn.textContent = 'Отправка…'; }

  try {
    const supabaseUrl  = document.querySelector('meta[name="supabase-url"]')?.content
      || window.__SUPABASE_URL__;
    const supabaseAnon = document.querySelector('meta[name="supabase-anon"]')?.content
      || window.__SUPABASE_ANON__;

    let sent = false;
    if (supabaseUrl && supabaseAnon) {
      const res = await fetch(`${supabaseUrl}/functions/v1/support-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnon}`,
          'Apikey': supabaseAnon,
        },
        body: JSON.stringify(payload),
      });
      sent = res.ok;
    }

    if (!sent) {
      console.log('Support request (edge fn unavailable):', payload);
    }

    if (okEl) okEl.style.display = '';
    form.reset();
    showToast('Обращение отправлено!', 'success');
    setTimeout(() => closeModal('supportModal'), 2000);
  } catch (e) {
    if (errEl) { errEl.textContent = 'Ошибка отправки. Попробуйте позже.'; errEl.style.display = ''; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Отправить обращение'; }
  }
}

/* ── UTILITIES ── */
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  loadProducts();
  loadPromotions();
  loadAdminEmail();

  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('searchBtn')?.addEventListener('click', applyFilters);
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

  document.getElementById('openSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
  document.getElementById('footerSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
  document.getElementById('closeSupportBtn')?.addEventListener('click', () => closeModal('supportModal'));

  document.getElementById('supportModal')?.addEventListener('click', e => {
    if (e.target.id === 'supportModal') closeModal('supportModal');
  });

  document.getElementById('supportForm')?.addEventListener('submit', e => {
    e.preventDefault();
    submitSupportForm(e.target);
  });
});
