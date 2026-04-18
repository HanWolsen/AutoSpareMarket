/* product.js — Product Detail Page Logic */

const API_BASE_P = '/api/v1';

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

async function loadProduct(id) {
  try {
    const p = await apiP(`/products/${id}`);
    const product = p?.data ?? p;

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

    document.getElementById('addToCartBtn').addEventListener('click', () => {
      const qty = parseInt(document.getElementById('qtyInput').value) || 1;
      for (let i = 0; i < qty; i++) {
        addToCart({ id: product.id, name: product.name, description: product.description });
      }
    });

    loadSuppliers(id);
  } catch {
    document.getElementById('productLoading').style.display = 'none';
    document.getElementById('productError').style.display = '';
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

/* Init */
const urlParams = new URLSearchParams(location.search);
const pid = urlParams.get('id');
if (pid) {
  loadProduct(parseInt(pid));
} else {
  document.getElementById('productLoading').style.display = 'none';
  document.getElementById('productError').style.display = '';
}
