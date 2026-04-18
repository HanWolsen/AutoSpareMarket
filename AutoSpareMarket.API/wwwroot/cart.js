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

  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  if (countEl)  countEl.textContent = `${total} ${pluralize(total, 'товар','товара','товаров')}`;
  if (sumCount) sumCount.textContent = total;

  if (listEl) {
    listEl.innerHTML = cart.map((item, idx) => `
      <div class="cart-item" data-idx="${idx}">
        <div class="cart-item-img"><span>&#9881;</span></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${esc(item.name)}</div>
          <div class="cart-item-desc">${esc(item.description || '')}</div>
          <div class="cart-item-id">Артикул: ${item.id}</div>
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

/* ── PROMO CODE ── */
document.getElementById('promoApplyBtn')?.addEventListener('click', () => {
  const code  = (document.getElementById('promoInput')?.value || '').trim().toUpperCase();
  const msgEl = document.getElementById('promoMsg');
  if (!msgEl) return;
  if (!code) { msgEl.style.display = 'none'; return; }
  msgEl.textContent  = 'Промокод не распознан. Функция в разработке.';
  msgEl.className    = 'promo-msg promo-err';
  msgEl.style.display = '';
});

/* ── CHECKOUT ── */
document.getElementById('checkoutBtn')?.addEventListener('click', () => {
  openModal('checkoutModal');
});
document.getElementById('closeCheckoutBtn')?.addEventListener('click', () => {
  closeModal('checkoutModal');
});
document.getElementById('checkoutModal')?.addEventListener('click', e => {
  if (e.target.id === 'checkoutModal') closeModal('checkoutModal');
});

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
renderCart();
