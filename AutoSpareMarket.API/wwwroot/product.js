/* product.js — Product Detail Page Logic */

const API_BASE_P = '/api/v1';

const TEST_PRODUCTS_P = {
  1: { id: 1, name: 'Тормозные колодки передние', description: 'Высококачественные керамические тормозные колодки для BMW 3-series (E46), Toyota Camry (V50). Обеспечивают плавное и эффективное торможение, минимальный шум и пыль. Совместимы с оригинальными суппортами.', warehouseCellId: 'A-01', price: 2490 },
  2: { id: 2, name: 'Масляный фильтр MANN-FILTER', description: 'Полнопоточный масляный фильтр для ВАЗ 2110–2115, Lada Priora, Kalina. Надёжная очистка масла от механических загрязнений. Фильтрующий элемент из специальной бумаги.', warehouseCellId: 'B-03', price: 380 },
  3: { id: 3, name: 'Амортизатор передний SACHS', description: 'Газомасляный амортизатор для Ford Focus II, Mazda 3 BK. Обеспечивает превосходную управляемость и комфорт вождения. Давление газа 25 бар.', warehouseCellId: 'C-12', price: 4200 },
  4: { id: 4, name: 'Свеча зажигания NGK Iridium', description: 'Иридиевая свеча зажигания с увеличенным ресурсом до 100 000 км. Универсальная для бензиновых двигателей. Стабильная искра в любых условиях.', warehouseCellId: 'D-05', price: 890 },
  5: { id: 5, name: 'Воздушный фильтр BOSCH', description: 'Воздушный фильтр для Hyundai Solaris, Kia Rio III. Изготовлен из целлюлозы с полиэстером. Обеспечивает оптимальный воздухообмен двигателя.', warehouseCellId: 'E-07', price: 650 },
};

const PRODUCT_IMAGES_P = {
    77: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    78: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    79: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    80: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    81: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    82: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    83: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    84: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    85: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    86: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    87: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    88: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    89: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    90: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    91: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    92: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    93: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    94: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    95: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    96: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    97: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    98: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    99: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    100: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    101: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    102: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    103: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    104: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    105: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    106: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    107: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    108: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    109: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    110: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    111: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    112: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    113: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    114: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    115: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    116: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    117: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    118: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
};

async function apiP(path) {
  const res = await fetch(`${API_BASE_P}${path}`, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data ?? json;
}

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

let currentProduct = null;

async function loadProduct(id) {
  try {
    let product;
    try {
      const p = await apiP(`/products/${id}`);
      product = p?.data ?? p;
    } catch {
      product = TEST_PRODUCTS_P[id] || TEST_PRODUCTS_P[1];
    }

    currentProduct = product;
    document.getElementById('productLoading').style.display = 'none';
    document.getElementById('productContent').style.display = '';

    const name = product.name || 'Товар';
    document.title = `${name} — АвтоЗапчасти`;
    document.getElementById('bcName').textContent = name;
    document.getElementById('productTitle').textContent = name;
    document.getElementById('productId').textContent   = product.id;
    document.getElementById('productDate').textContent = fmt(product.dateAdd);
    document.getElementById('productDesc').textContent = product.description || 'Описание не указано.';
    document.getElementById('specId').textContent   = product.id;
    document.getElementById('specCell').textContent = product.warehouseCellId || '—';
    document.getElementById('specDate').textContent = fmt(product.dateAdd);

    const priceEl = document.getElementById('productPriceVal');
    if (priceEl) {
      priceEl.textContent = product.price ? `${product.price.toLocaleString('ru-RU')} ₽` : 'По запросу';
    }

    const imgEl = document.querySelector('.product-img-main img');
    const imgFallback = document.querySelector('.product-img-main .img-placeholder');
    const imgUrl = PRODUCT_IMAGES[product.id];
    if (imgEl && imgUrl) {
      imgEl.src = imgUrl;
      imgEl.alt = name;
      imgEl.style.display = '';
      if (imgFallback) imgFallback.style.display = 'none';
    } else if (imgFallback) {
      imgFallback.style.display = '';
      if (imgEl) imgEl.style.display = 'none';
    }

    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qtyInput').value) || 1;
      for (let i = 0; i < qty; i++) {
        addToCart({ id: product.id, name: product.name, description: product.description, price: product.price });
      }
    });

    loadSuppliers(id);
    loadSpecs(id);
  } catch {
    document.getElementById('productLoading').style.display = 'none';
    document.getElementById('productError').style.display = '';
  }
}

async function loadSpecs(productId) {
  const specsBody = document.getElementById('specsTableBody');
  if (!specsBody) return;

  try {
    const specs = await fetchProductSpecs(productId);
    if (specs.length > 0) {
      specsBody.innerHTML = specs.map(s => `
        <tr><th>${s.spec_key}</th><td>${s.spec_value}</td></tr>
      `).join('');
    } else {
      const fallback = document.getElementById('specsBasicRows');
      if (fallback) fallback.style.display = '';
    }
  } catch {
    const fallback = document.getElementById('specsBasicRows');
    if (fallback) fallback.style.display = '';
  }
}

async function loadSuppliers(productId) {
  const container = document.getElementById('suppliersList');
  try {
    const data = await apiP(`/suppliers/by-product/${productId}`);
    const list = Array.isArray(data) ? data : (data?.data ? [data.data] : []);
    if (list.length === 0) {
      container.innerHTML = '<span style="color:var(--text-muted)">Поставщики не найдены</span>';
      return;
    }
    container.innerHTML = list.map(s => `
      <div class="supplier-card">
        <div class="supplier-card-name">${s.name || '—'}</div>
        <div class="supplier-card-meta">
          ${s.contactInfo ? `Контакт: ${s.contactInfo}` : ''}
          ${s.email ? ` &nbsp;|&nbsp; Email: ${s.email}` : ''}
        </div>
      </div>
    `).join('');
  } catch {
    container.innerHTML = '<span style="color:var(--text-muted)">Не удалось загрузить поставщиков</span>';
  }
}

/* Tabs */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(`tab-${btn.dataset.tab}`);
    if (target) target.classList.add('active');
  });
});

/* Qty controls */
document.getElementById('qtyMinus')?.addEventListener('click', () => {
  const inp = document.getElementById('qtyInput');
  inp.value = Math.max(1, parseInt(inp.value) - 1);
});
document.getElementById('qtyPlus')?.addEventListener('click', () => {
  const inp = document.getElementById('qtyInput');
  inp.value = Math.min(99, parseInt(inp.value) + 1);
});

/* Search redirect */
document.getElementById('searchBtn')?.addEventListener('click', () => {
  const q = document.getElementById('searchInput')?.value?.trim();
  if (q) location.href = `/?q=${encodeURIComponent(q)}`;
});
document.getElementById('searchInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('searchBtn')?.click();
});

/* Auth UI */
function updateAuthUIProduct() {
  const user = getCurrentUser();
  const profile = JSON.parse(localStorage.getItem('asm_profile') || 'null');
  const authNav = document.getElementById('authNav');
  const userNav = document.getElementById('userNav');
  const greeting = document.getElementById('userGreeting');
  if (user) {
    if (authNav) authNav.style.display = 'none';
    if (userNav) userNav.style.display = 'flex';
    const name = profile?.username || profile?.first_name || user.email?.split('@')[0] || 'Пользователь';
    if (greeting) greeting.textContent = name;
  } else {
    if (authNav) authNav.style.display = 'flex';
    if (userNav) userNav.style.display = 'none';
  }
  updateCartBadge();
}

/* Support modal */
document.getElementById('openSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
document.getElementById('closeSupportBtn')?.addEventListener('click', () => closeModal('supportModal'));
document.getElementById('supportModal')?.addEventListener('click', e => {
  if (e.target.id === 'supportModal') closeModal('supportModal');
});
document.getElementById('supportForm')?.addEventListener('submit', e => {
  e.preventDefault();
  submitSupportForm(e.target);
});

/* Auth modal on product page */
document.getElementById('headerLoginBtn')?.addEventListener('click', () => openModal('authModal'));
document.getElementById('headerRegBtn')?.addEventListener('click', () => openModal('authModal'));
document.getElementById('closeAuthBtn')?.addEventListener('click', () => closeModal('authModal'));
document.getElementById('authModal')?.addEventListener('click', e => { if (e.target.id === 'authModal') closeModal('authModal'); });
document.getElementById('tabLogin')?.addEventListener('click', () => switchAuthTab('loginForm'));
document.getElementById('tabReg')?.addEventListener('click', () => switchAuthTab('regForm'));

function switchAuthTab(show) {
  const loginForm = document.getElementById('loginForm');
  const regForm   = document.getElementById('regForm');
  const tabLogin  = document.getElementById('tabLogin');
  const tabReg    = document.getElementById('tabReg');
  if (!loginForm || !regForm) return;
  if (show === 'regForm') {
    loginForm.style.display = 'none'; regForm.style.display = '';
    tabLogin?.classList.remove('active'); tabReg?.classList.add('active');
  } else {
    loginForm.style.display = ''; regForm.style.display = 'none';
    tabLogin?.classList.add('active'); tabReg?.classList.remove('active');
  }
}

document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const errEl = document.getElementById('loginError');
  const btn   = document.getElementById('loginSubmitBtn');
  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.disabled = true; btn.textContent = 'Вход…'; }
  try {
    await authLogin(fd.get('email'), fd.get('password'));
    const profile = await fetchUserProfile();
    if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
    const user = getCurrentUser();
    if (user) {
      const saved = localStorage.getItem(`${CART_KEY}_${user.id}`);
      if (saved) { try { const items = JSON.parse(saved); if (Array.isArray(items) && items.length > 0) { saveCart(items); localStorage.removeItem(`${CART_KEY}_${user.id}`); } } catch {} }
    }
    updateAuthUIProduct();
    closeModal('authModal');
    showToast('Вы успешно вошли!', 'success');
  } catch {
    if (errEl) { errEl.textContent = 'Неверный email или пароль'; errEl.style.display = ''; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Войти'; }
  }
});

document.getElementById('regForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const errEl = document.getElementById('regError');
  const btn   = document.getElementById('regSubmitBtn');
  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.disabled = true; btn.textContent = 'Регистрация…'; }
  try {
    await authRegister(fd.get('username'), fd.get('email'), fd.get('password'), fd.get('firstName'), fd.get('lastName'), fd.get('phone'));
    const profile = await fetchUserProfile();
    if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
    updateAuthUIProduct();
    closeModal('authModal');
    showToast('Аккаунт создан!', 'success');
  } catch (err) {
    if (errEl) { errEl.textContent = err.message || 'Ошибка'; errEl.style.display = ''; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Зарегистрироваться'; }
  }
});

document.getElementById('headerLogoutBtn')?.addEventListener('click', async () => {
  const user = getCurrentUser();
  if (user) {
    const cart = getCart();
    if (cart.length > 0) localStorage.setItem(`${CART_KEY}_${user.id}`, JSON.stringify(cart));
  }
  saveCart([]);
  await authLogout();
  localStorage.removeItem('asm_profile');
  updateAuthUIProduct();
  updateCartBadge();
  showToast('Вы вышли из аккаунта');
});

/* Init */
document.addEventListener('DOMContentLoaded', async () => {
  updateCartBadge();
  if (isLoggedIn()) {
    const profile = await fetchUserProfile();
    if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
  }
  updateAuthUIProduct();

  const urlParams = new URLSearchParams(location.search);
  const pid = urlParams.get('id');
  if (pid) {
    loadProduct(parseInt(pid));
  } else {
    document.getElementById('productLoading').style.display = 'none';
    document.getElementById('productError').style.display = '';
  }
});
