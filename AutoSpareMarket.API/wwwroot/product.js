/* product.js — Product Detail Page Logic */

const API_BASE_P = '/api/v1';

const TEST_PRODUCTS_P = {
  1: { id: 1, name: 'Тормозные колодки передние', description: 'Высококачественные керамические тормозные колодки для BMW 3-series (E46), Toyota Camry (V50). Обеспечивают плавное и эффективное торможение, минимальный шум и пыль. Совместимы с оригинальными суппортами.', warehouseCellId: 'A-01', price: 2490 },
  2: { id: 2, name: 'Масляный фильтр MANN-FILTER', description: 'Полнопоточный масляный фильтр для ВАЗ 2110–2115, Lada Priora, Kalina. Надёжная очистка масла от механических загрязнений. Фильтрующий элемент из специальной бумаги.', warehouseCellId: 'B-03', price: 380 },
  3: { id: 3, name: 'Амортизатор передний SACHS', description: 'Газомасляный амортизатор для Ford Focus II, Mazda 3 BK. Обеспечивает превосходную управляемость и комфорт вождения. Давление газа 25 бар.', warehouseCellId: 'C-12', price: 4200 },
  4: { id: 4, name: 'Свеча зажигания NGK Iridium', description: 'Иридиевая свеча зажигания с увеличенным ресурсом до 100 000 км. Универсальная для бензиновых двигателей. Стабильная искра в любых условиях.', warehouseCellId: 'D-05', price: 890 },
  5: { id: 5, name: 'Воздушный фильтр BOSCH', description: 'Воздушный фильтр для Hyundai Solaris, Kia Rio III. Изготовлен из целлюлозы с полиэстером. Обеспечивает оптимальный воздухообмен двигателя.', warehouseCellId: 'E-07', price: 650 },
};

let PRODUCT_IMAGES = {
    77: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqw-grNwSL6z8Pca9xZ04xgcTebZJGN3NLiQ&s',
    78: 'https://example.com/images/brake-pads-trw-2.jpg',
    79: 'https://example.com/images/brake-disc-brembo.jpg',
    80: 'https://example.com/images/brake-fluid-dot4.jpg',
    81: 'https://example.com/images/brake-booster-ate.jpg',
    82: 'https://example.com/images/shock-absorber-kyb.jpg',
    83: 'https://example.com/images/silentblock-lemforder.jpg',
    84: 'https://example.com/images/ball-joint-lemforder.jpg',
    85: 'https://example.com/images/spring-eibach.jpg',
    86: 'https://example.com/images/spring-eibach-2.jpg',
    87: 'https://example.com/images/timing-belt-gates.jpg',
    88: 'https://example.com/images/engine-mount-febi.jpg',
    89: 'https://example.com/images/head-gasket-victor.jpg',
    90: 'https://example.com/images/timing-chain-iwis.jpg',
    91: 'https://example.com/images/oil-filter-mann.jpg',
    92: 'https://example.com/images/air-filter-mann.jpg',
    93: 'https://example.com/images/cabin-filter-mann.jpg',
    94: 'https://example.com/images/starter-bosch.jpg',
    95: 'https://example.com/images/alternator-valeo.jpg',
    96: 'https://example.com/images/spark-plug-ngk.jpg',
    97: 'https://example.com/images/spark-plug-ngk-2.jpg',
    98: 'https://example.com/images/shell-oil-5w40.jpg',
    99: 'https://example.com/images/mobil1-0w40.jpg',
    100: 'https://example.com/images/castrol-syntrans.jpg',
    101: 'https://example.com/images/zf-lifeguard.jpg',
    102: 'https://example.com/images/castrol-brake-fluid.jpg',
    103: 'https://example.com/images/antifreeze-g12plus.jpg',
    104: 'https://example.com/images/antifreeze-g11.jpg',
    105: 'https://example.com/images/michelin-pilot-sport.jpg',
    106: 'https://example.com/images/michelin-pilot-sport-2.jpg',
    107: 'https://example.com/images/nokian-hakkapeliitta.jpg',
    108: 'https://example.com/images/goodyear-vector.jpg',
    109: 'https://example.com/images/alloy-wheel-replica.jpg',
    110: 'https://example.com/images/forged-wheel-kk.jpg',
    111: 'https://example.com/images/inner-tube-13.jpg',
    112: 'https://example.com/images/tire-repair-kit.jpg',
    113: 'https://example.com/images/tire-valve-caps.jpg',
    114: 'https://example.com/images/windshield-fluid.jpg',
    115: 'https://example.com/images/injector-cleaner.jpg',
    116: 'https://example.com/images/socket-set-force.jpg',
    117: 'https://example.com/images/hydraulic-jack.jpg',
    118: 'https://example.com/images/car-vacuum.jpg',
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
