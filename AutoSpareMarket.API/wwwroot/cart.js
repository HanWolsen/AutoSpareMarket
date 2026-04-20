/* cart.js — Cart Page Logic */

const API_BASE_C = '/api/v1';

async function apiC(path, options = {}) {
  const res = await fetch(`${API_BASE_C}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json?.data ?? json;
}

/* ── RENDER CART ── */
function renderCart() {
  const cart = getCart();
  const emptyEl   = document.getElementById('cartEmpty');
  const contentEl = document.getElementById('cartContent');
  const listEl    = document.getElementById('cartItemsList');
  const countEl   = document.getElementById('cartItemsCount');
  const sumCount  = document.getElementById('summaryCount');

  updateCartBadge();

  if (cart.length === 0) {
    if (emptyEl)   emptyEl.style.display = '';
    if (contentEl) contentEl.style.display = 'none';
    return;
  }

  if (emptyEl)   emptyEl.style.display = 'none';
  if (contentEl) contentEl.style.display = '';

  const totalQty = cart.reduce((s, i) => s + (i.qty || 1), 0);
  if (countEl)  countEl.textContent = `${totalQty} ${pluralize(totalQty, 'товар','товара','товаров')}`;
  if (sumCount) sumCount.textContent = totalQty;

  const totalPrice = cart.reduce((s, i) => s + ((i.price || 0) * (i.qty || 1)), 0);
  const priceEl  = document.getElementById('summaryPrice');
  const totalEl  = document.getElementById('summaryTotal');
  if (totalPrice > 0) {
    const fmt = totalPrice.toLocaleString('ru-RU') + ' ₽';
    if (priceEl) priceEl.textContent = fmt;
    if (totalEl) totalEl.textContent = fmt;
  } else {
    if (priceEl) priceEl.textContent = 'По запросу';
    if (totalEl) totalEl.textContent = 'По запросу';
  }

  if (listEl) {
    listEl.innerHTML = cart.map((item, idx) => `
      <div class="cart-item" data-idx="${idx}">
        <div class="cart-item-img">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40" style="opacity:.2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${esc(item.name)}</div>
          <div class="cart-item-desc">${esc(item.description || '')}</div>
          <div class="cart-item-id">Артикул: ${item.id}</div>
          ${item.price ? `<div class="cart-item-price">${(item.price * (item.qty || 1)).toLocaleString('ru-RU')} ₽</div>` : ''}
        </div>
        <div class="cart-item-right">
          <button class="cart-item-remove" data-idx="${idx}">Удалить</button>
          <div class="cart-qty-wrap">
            <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">&#8722;</button>
            <div class="cart-qty-val">${item.qty || 1}</div>
            <button class="cart-qty-btn" data-action="plus"  data-idx="${idx}">&#43;</button>
          </div>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.idx)));
    });
    listEl.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const action = btn.dataset.action;
        changeQty(idx, action === 'plus' ? 1 : -1);
      });
    });
  }
}

function removeItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
}

function changeQty(idx, delta) {
  const cart = getCart();
  if (!cart[idx]) return;
  cart[idx].qty = Math.max(1, Math.min(99, (cart[idx].qty || 1) + delta));
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

/* ── CHECKOUT ── */
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  if (!isLoggedIn()) {
    openModal('authModal');
    showToast('Войдите, чтобы оформить заказ', 'error');
    return;
  }
  prefillCheckoutForm();
  openModal('checkoutModal');
});
document.getElementById('closeCheckoutBtn')?.addEventListener('click', () => {
  closeModal('checkoutModal');
});
document.getElementById('checkoutModal')?.addEventListener('click', e => {
  if (e.target.id === 'checkoutModal') closeModal('checkoutModal');
});

function prefillCheckoutForm() {
  const profile = JSON.parse(localStorage.getItem('asm_profile') || 'null');
  if (!profile) return;
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  if (profile.first_name) form.querySelector('[name=firstName]').value = profile.first_name;
  if (profile.last_name)  form.querySelector('[name=lastName]').value  = profile.last_name;
  if (profile.email)      form.querySelector('[name=email]').value     = profile.email;
  if (profile.phone)      form.querySelector('[name=phone]').value     = profile.phone;
}

document.getElementById('checkoutForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form   = e.target;
  const fd     = new FormData(form);
  const errEl  = document.getElementById('checkoutError');
  const btn    = document.getElementById('checkoutSubmitBtn');

  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.disabled = true; btn.textContent = 'Оформление…'; }

  const customerData = {
    firstName: fd.get('firstName'),
    lastName:  fd.get('lastName'),
    email:     fd.get('email'),
    phone:     fd.get('phone') || null,
  };

  try {
    const customer = await apiC('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });

    const customerId = customer?.id ?? customer?.data?.id;

    const cart = getCart();
    const saleItems = cart.map(item => ({
      productId: item.id,
      quantity:  item.qty || 1,
    }));

    let cashRegisterId = 1;
    try {
      const registers = await apiC('/cash-registers');
      const list = Array.isArray(registers) ? registers : [];
      if (list.length > 0) cashRegisterId = list[0].id;
    } catch { /* use default */ }

    const saleData = {
      customerId:      customerId,
      cashRegisterId:  cashRegisterId,
      paymentMethod:   fd.get('paymentMethod'),
      items:           saleItems,
    };

    await apiC('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });

    saveCart([]);
    updateCartBadge();

    document.getElementById('checkoutStep1').style.display = 'none';
    document.getElementById('checkoutStep2').style.display = '';
    const msg = document.getElementById('orderSuccessMsg');
    if (msg) msg.textContent = `Заказ оформлен! Подтверждение придёт на ${customerData.email}.`;

  } catch (err) {
    if (errEl) {
      errEl.textContent = `Ошибка: ${err.message || 'Не удалось оформить заказ.'}`;
      errEl.style.display = '';
    }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Подтвердить заказ'; }
  }
});

/* ── AUTH UI ── */
function updateAuthUICart() {
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

/* ── AUTH MODAL ── */
document.getElementById('headerLoginBtn')?.addEventListener('click', () => openModal('authModal'));
document.getElementById('headerRegBtn')?.addEventListener('click', () => openModal('authModal'));
document.getElementById('closeAuthBtn')?.addEventListener('click', () => closeModal('authModal'));
document.getElementById('authModal')?.addEventListener('click', e => { if (e.target.id === 'authModal') closeModal('authModal'); });
document.getElementById('tabLogin')?.addEventListener('click', () => switchCartAuthTab('loginForm'));
document.getElementById('tabReg')?.addEventListener('click', () => switchCartAuthTab('regForm'));

function switchCartAuthTab(show) {
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
    // Restore cart saved before logout
    const user = getCurrentUser();
    if (user) {
      const saved = localStorage.getItem(`${CART_KEY}_${user.id}`);
      if (saved) {
        try {
          const items = JSON.parse(saved);
          if (Array.isArray(items) && items.length > 0) {
            saveCart(items);
            localStorage.removeItem(`${CART_KEY}_${user.id}`);
          }
        } catch { /* ignore */ }
      }
    }
    updateAuthUICart();
    closeModal('authModal');
    renderCart();
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
    updateAuthUICart();
    closeModal('authModal');
    showToast('Аккаунт создан!', 'success');
  } catch (err) {
    if (errEl) { errEl.textContent = err.message || 'Ошибка'; errEl.style.display = ''; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Зарегистрироваться'; }
  }
});

document.getElementById('headerLogoutBtn')?.addEventListener('click', async () => {
  // Save cart under user key before clearing
  const user = getCurrentUser();
  if (user) {
    const cart = getCart();
    if (cart.length > 0) {
      localStorage.setItem(`${CART_KEY}_${user.id}`, JSON.stringify(cart));
    }
  }
  saveCart([]);
  await authLogout();
  localStorage.removeItem('asm_profile');
  updateAuthUICart();
  renderCart();
  showToast('Вы вышли из аккаунта');
});

/* ── UTILS ── */
function pluralize(n, one, few, many) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} ${few}`;
  return `${n} ${many}`;
}
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── SUPPORT MODAL ── */
document.getElementById('openSupportBtn')?.addEventListener('click', () => openModal('supportModal'));
document.getElementById('closeSupportBtn')?.addEventListener('click', () => closeModal('supportModal'));
document.getElementById('supportModal')?.addEventListener('click', e => {
  if (e.target.id === 'supportModal') closeModal('supportModal');
});
document.getElementById('supportForm')?.addEventListener('submit', e => {
  e.preventDefault();
  submitSupportForm(e.target);
});

/* ── SEARCH REDIRECT ── */
document.getElementById('searchBtn')?.addEventListener('click', () => {
  const q = document.getElementById('searchInput')?.value?.trim();
  if (q) location.href = `/?q=${encodeURIComponent(q)}`;
});
document.getElementById('searchInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('searchBtn')?.click();
});

/* ── CLEAR CART ── */
document.getElementById('clearCartBtn')?.addEventListener('click', () => {
  if (confirm('Очистить корзину?')) clearCart();
});

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  updateCartBadge();
  if (isLoggedIn()) {
    const profile = await fetchUserProfile();
    if (profile) localStorage.setItem('asm_profile', JSON.stringify(profile));
  }
  updateAuthUICart();
  renderCart();
});
