/* ============================================================
   STORE.JS — Customer Storefront Logic
   ============================================================ */

const API_BASE = '/api/v1';
const CART_KEY = 'asm_cart';
const PAGE_SIZE = 20;

/* ── TEST DATA (shown when API returns no products) ── */
const TEST_PRODUCTS = [
  { id: 1, name: 'Тормозные колодки передние', description: 'Керамические тормозные колодки для BMW 3-series, Toyota Camry. Высокая эффективность торможения.', warehouseCellId: 'A-01', price: 2490 },
  { id: 2, name: 'Масляный фильтр MANN-FILTER', description: 'Полнопоточный масляный фильтр для ВАЗ 2110–2115, Lada Priora, Kalina. Надёжная очистка масла.', warehouseCellId: 'B-03', price: 380 },
  { id: 3, name: 'Амортизатор передний SACHS', description: 'Газомасляный амортизатор для Ford Focus II, Mazda 3 BK. Превосходная управляемость.', warehouseCellId: 'C-12', price: 4200 },
  { id: 4, name: 'Свеча зажигания NGK Iridium', description: 'Иридиевая свеча зажигания. Универсальная для бензиновых двигателей. Увеличенный ресурс.', warehouseCellId: 'D-05', price: 890 },
  { id: 5, name: 'Воздушный фильтр BOSCH', description: 'Воздушный фильтр для Hyundai Solaris, Kia Rio III. Улучшенный воздухообмен двигателя.', warehouseCellId: 'E-07', price: 650 },
  { id: 6, name: 'Ремень ГРМ Gates', description: 'Ремень газораспределительного механизма для Renault Logan, Sandero. Усиленный корд.', warehouseCellId: 'A-15', price: 1850 },
  { id: 7, name: 'Термостат охлаждения', description: 'Термостат системы охлаждения для Volkswagen Golf IV, Passat B5. Точная регулировка температуры.', warehouseCellId: 'B-09', price: 1200 },
  { id: 8, name: 'Радиатор охлаждения двигателя', description: 'Алюминиевый радиатор для Opel Astra H, Zafira. Эффективный теплообмен.', warehouseCellId: 'C-03', price: 6800 },
  { id: 9, name: 'Стойка стабилизатора передняя', description: 'Стойка стабилизатора поперечной устойчивости для Nissan Almera Classic, G15.', warehouseCellId: 'D-11', price: 720 },
  { id: 10, name: 'Свеча накаливания Bosch', description: 'Свеча накаливания для дизельных двигателей Mercedes-Benz C-класс, E-класс.', warehouseCellId: 'E-02', price: 1350 },
  { id: 11, name: 'Катушка зажигания', description: 'Катушка зажигания для Honda Civic VIII, CR-V III. Мощная искра для надёжного пуска.', warehouseCellId: 'F-08', price: 2100 },
  { id: 12, name: 'Фильтр салонный угольный', description: 'Угольный фильтр салона для Toyota Corolla E150. Поглощает неприятные запахи и вредные газы.', warehouseCellId: 'A-22', price: 420 },
];

const PRODUCT_IMAGES = {
  1: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
  2: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
  3: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
  4: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
  5: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg?auto=compress&cs=tinysrgb&w=400',
  6: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
  7: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
  8: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg?auto=compress&cs=tinysrgb&w=400',
  9: 'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400',
  10: 'https://images.pexels.com/photos/2244746/pexels-photo-2244746.jpeg?auto=compress&cs=tinysrgb&w=400',
  11: 'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
  12: 'https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg?auto=compress&cs=tinysrgb&w=400',
};

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
  if (!isLoggedIn()) {
    openModal('authModal');
    showToast('Войдите, чтобы добавить товар в корзину', 'error');
    return;
  }
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === product.id);
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ id: product.id, name: product.name, description: product.description, price: product.price, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`«${product.name}» добавлен в корзину`, 'success');
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

/* ── AUTH UI ── */
function updateAuthUI() {
  const user = getCurrentUser();
  const profile = JSON.parse(localStorage.getItem('asm_profile') || 'null');
  const authNav = document.getElementById('authNav');
  const userNav = document.getElementById('userNav');
  const greeting = document.getElementById('userGreeting');
  const adminLink = document.getElementById('adminLink');

  if (user) {
    if (authNav) authNav.style.display = 'none';
    if (userNav) userNav.style.display = 'flex';
    const name = profile?.username || profile?.first_name || user.email?.split('@')[0] || 'Пользователь';
    if (greeting) greeting.textContent = name;

    const isAdmin = (profile?.username || '').toLowerCase() === 'admin';
    if (adminLink) adminLink.style.display = isAdmin ? 'flex' : 'none';
  } else {
    if (authNav) authNav.style.display = 'flex';
    if (userNav) userNav.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
  }
}

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

  grid.innerHTML = page.map(p => {
    const img = PRODUCT_IMAGES[p.id];
    const imgHtml = img
      ? `<img src="${img}" alt="${esc(p.name)}" loading="lazy" />`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="opacity:.2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>`;
    const price = p.price ? `<span class="card-price">${p.price.toLocaleString('ru-RU')} ₽</span>` : `<span class="card-price-req">Цена по запросу</span>`;
    return `
    <div class="product-card" data-id="${p.id}">
      <a class="product-card-img" href="product.html?id=${p.id}">${imgHtml}</a>
      <div class="product-card-body">
        <a class="product-card-name" href="product.html?id=${p.id}">${esc(p.name)}</a>
        <div class="product-card-desc">${esc(p.description || 'Описание не указано')}</div>
        <div class="product-card-meta">Арт: ${p.id}</div>
        ${price}
        <div class="product-card-actions">
          <button class="btn-cart" onclick="handleAddToCart(${p.id})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            В корзину
          </button>
          <a class="btn-detail" href="product.html?id=${p.id}">Подробнее</a>
        </div>
      </div>
    </div>`;
  }).join('');

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
  document.getElementById('catalogSection')?.scrollIntoView({ behavior: 'smooth' });
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

  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  if (sort === 'date') list.sort((a, b) => new Date(b.dateAdd || 0) - new Date(a.dateAdd || 0));

  filteredProducts = list;
  currentPage = 1;
  renderProducts();
}

/* ── LOAD PRODUCTS ── */
async function loadProducts() {
  const loadingMsg = document.getElementById('loadingMsg');
  try {
    const data = await api('/products');
    const fromApi = Array.isArray(data) ? data : [];
    allProducts = fromApi.length > 0 ? fromApi : TEST_PRODUCTS;
    if (loadingMsg) loadingMsg.style.display = 'none';
    applyFilters();
  } catch {
    allProducts = TEST_PRODUCTS;
    if (loadingMsg) loadingMsg.style.display = 'none';
    applyFilters();
  }
}

/* ── LOAD PROMOTIONS ── */
async function loadPromotions() {
  try {
    const data = await api('/promotions');
    const list = Array.isArray(data) ? data : [];
    if (list.length === 0) return;
    const section = document.getElementById('promotionsSection');
    const grid = document.getElementById('promotionsGrid');
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
  } catch { /* optional */ }
}

/* ── SUPPORT FORM ── */
async function submitSupportForm(form) {
  const fd = new FormData(form);
  const payload = { category: fd.get('category'), subject: fd.get('subject'), message: fd.get('message'), email: fd.get('email') };
  const errEl = document.getElementById('supportError');
  const okEl  = document.getElementById('supportSuccess');
  const btn   = document.getElementById('supportSubmitBtn');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }
  if (okEl)  okEl.style.display = 'none';
  if (btn)   { btn.disabled = true; btn.textContent = 'Отправка…'; }

  try {
    const supabaseUrl  = 'https://exvbhqoiqwyxbffzfemy.supabase.co';
    const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dmJocW9pcXd5eGJmZnpmZW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MTg0OTgsImV4cCI6MjA5MjA5NDQ5OH0.AVJw1JbKz0SkvtBhjmIxAH7EeSoZnBFB1Zyg77dl0HI';
    await fetch(`${supabaseUrl}/functions/v1/support-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseAnon}`, 'Apikey': supabaseAnon },
      body: JSON.stringify(payload),
    });
    if (okEl) okEl.style.display = '';
    form.reset();
    showToast('Обращение отправлено!', 'success');
    setTimeout(() => closeModal('supportModal'), 2000);
  } catch {
    if (errEl) { errEl.textContent = 'Ошибка отправки. Попробуйте позже.'; errEl.style.display = ''; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Отправить обращение'; }
  }
}

/* ── UTILITIES ── */
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── AUTH MODAL LOGIC ── */
function switchAuthTab(show) {
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('regForm');
  const tabLogin = document.getElementById('tabLogin');
  const tabReg = document.getElementById('tabReg');
  if (show === 'regForm') {
    loginForm.style.display = 'none';
    regForm.style.display = '';
    tabLogin.classList.remove('active');
    tabReg.classList.add('active');
  } else {
    loginForm.style.display = '';
    regForm.style.display = 'none';
    tabLogin.classList.add('active');
    tabReg.classList.remove('active');
  }
}

function openAuthModal(tab) {
  openModal('authModal');
  switchAuthTab(tab === 'reg' ? 'regForm' : 'loginForm');
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  updateCartBadge();
  loadProducts();
  loadPromotions();

  if (isLoggedIn()) {
    const profile = await fetchUserProfile();
    if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
  }
  updateAuthUI();

  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('searchBtn')?.addEventListener('click', applyFilters);
  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);

  document.getElementById('openSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
  document.getElementById('heroSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
  document.getElementById('footerSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
  document.getElementById('closeSupportBtn')?.addEventListener('click', () => closeModal('supportModal'));
  document.getElementById('supportModal')?.addEventListener('click', e => { if (e.target.id === 'supportModal') closeModal('supportModal'); });
  document.getElementById('supportForm')?.addEventListener('submit', e => { e.preventDefault(); submitSupportForm(e.target); });

  document.getElementById('headerLoginBtn')?.addEventListener('click', () => openAuthModal('login'));
  document.getElementById('headerRegBtn')?.addEventListener('click', () => openAuthModal('reg'));
  document.getElementById('closeAuthBtn')?.addEventListener('click', () => closeModal('authModal'));
  document.getElementById('authModal')?.addEventListener('click', e => { if (e.target.id === 'authModal') closeModal('authModal'); });
  document.getElementById('tabLogin')?.addEventListener('click', () => switchAuthTab('loginForm'));
  document.getElementById('tabReg')?.addEventListener('click', () => switchAuthTab('regForm'));
  document.getElementById('switchToReg')?.addEventListener('click', () => switchAuthTab('regForm'));
  document.getElementById('switchToLogin')?.addEventListener('click', () => switchAuthTab('loginForm'));

  document.getElementById('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const errEl = document.getElementById('loginError');
    const btn = document.getElementById('loginSubmitBtn');
    if (errEl) errEl.style.display = 'none';
    if (btn) { btn.disabled = true; btn.textContent = 'Вход…'; }
    try {
      await authLogin(fd.get('email'), fd.get('password'));
      const profile = await fetchUserProfile();
      if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
      updateAuthUI();
      closeModal('authModal');
      showToast('Вы успешно вошли!', 'success');
    } catch (err) {
      if (errEl) { errEl.textContent = 'Неверный email или пароль'; errEl.style.display = ''; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Войти'; }
    }
  });

  document.getElementById('regForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const errEl = document.getElementById('regError');
    const btn = document.getElementById('regSubmitBtn');
    if (errEl) errEl.style.display = 'none';
    if (btn) { btn.disabled = true; btn.textContent = 'Регистрация…'; }
    try {
      await authRegister(fd.get('username'), fd.get('email'), fd.get('password'), fd.get('firstName'), fd.get('lastName'), fd.get('phone'));
      const profile = await fetchUserProfile();
      if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
      updateAuthUI();
      closeModal('authModal');
      showToast('Аккаунт создан! Добро пожаловать!', 'success');
    } catch (err) {
      if (errEl) { errEl.textContent = err.message || 'Ошибка регистрации'; errEl.style.display = ''; }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Зарегистрироваться'; }
    }
  });

  document.getElementById('headerLogoutBtn')?.addEventListener('click', async () => {
    await authLogout();
    localStorage.removeItem('asm_profile');
    updateAuthUI();
    showToast('Вы вышли из аккаунта');
  });
});
