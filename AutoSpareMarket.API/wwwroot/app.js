const defaultBase = `${window.location.origin}/api/v1`;
const apiBaseInput = document.getElementById('apiBase');
apiBaseInput.value = localStorage.getItem('apiBase') || defaultBase;

function getBase() {
    return (apiBaseInput.value || defaultBase).replace(/\/$/, '');
}

async function api(path, options = {}) {
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    const res = await fetch(`${getBase()}${path}`, { ...options, headers });
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text || null; }
    if (!res.ok) {
        const msg = data && data.message ? data.message : (data && data.title ? data.title : res.statusText);
        throw new Error(`${res.status}: ${msg}`);
    }
    if (data && typeof data === 'object' && 'data' in data) return data.data;
    return data;
}

function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast toast-${type} show`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

function setConnectionStatus(ok) {
    const badge = document.getElementById('statusBadge');
    const status = document.getElementById('connectionStatus');
    if (ok) {
        badge.className = 'badge badge-ok';
        badge.textContent = '● Подключено';
        status.textContent = 'Подключено';
        status.className = 'connection-status ok';
    } else {
        badge.className = 'badge badge-err';
        badge.textContent = '● Ошибка подключения';
        status.textContent = 'Ошибка';
        status.className = 'connection-status err';
    }
}

document.getElementById('saveApiBase').addEventListener('click', () => {
    const v = apiBaseInput.value.trim().replace(/\/$/, '');
    if (!v) return;
    localStorage.setItem('apiBase', v);
    showToast('URL API сохранён');
});

document.getElementById('pingApi').addEventListener('click', async () => {
    try {
        await api('/products');
        setConnectionStatus(true);
        showToast('Соединение установлено');
    } catch {
        setConnectionStatus(false);
        showToast('Не удалось подключиться к API', 'error');
    }
});

// ── NAVIGATION ────────────────────────────────────────────────
const tabNames = {
    dashboard: 'Дашборд',
    products: 'Товары',
    warehouse: 'Ячейки склада',
    suppliers: 'Поставщики',
    customers: 'Покупатели',
    sales: 'Продажи',
    orders: 'Заказы',
    promotions: 'Акции',
    'cash-registers': 'Кассы',
};

function switchTab(tab) {
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const pane = document.getElementById(`tab-${tab}`);
    if (pane) pane.classList.add('active');
    const link = document.querySelector(`.nav-link[data-tab="${tab}"]`);
    if (link) link.classList.add('active');
    document.getElementById('topbarTitle').textContent = tabNames[tab] || tab;
    loadTabData(tab);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        switchTab(link.dataset.tab);
    });
});

document.querySelectorAll('[data-tab-link]').forEach(el => {
    el.addEventListener('click', e => {
        e.preventDefault();
        switchTab(el.dataset.tabLink);
    });
});

document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
});

function loadTabData(tab) {
    switch (tab) {
        case 'dashboard': loadDashboard(); break;
        case 'products': loadProducts(); break;
        case 'warehouse': loadWarehouse(); break;
        case 'suppliers': loadSuppliers(); break;
        case 'customers': loadCustomers(); break;
        case 'sales': loadSales(); break;
        case 'orders': loadOrders(); break;
        case 'promotions': loadPromotions(); break;
        case 'cash-registers': loadCash(); break;
    }
}

// ── MODALS ────────────────────────────────────────────────────
function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
}

document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.modal || btn.closest('.modal-overlay').id));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
});

// ── DATE HELPERS ──────────────────────────────────────────────
function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function fmtMoney(val) {
    if (val == null) return '—';
    return Number(val).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
}

function empty(tbody, cols, msg = 'Нет данных') {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="empty-row">${msg}</td></tr>`;
}

function searching(tbody, cols) {
    tbody.innerHTML = `<tr><td colspan="${cols}" class="empty-row loading-row">Загрузка...</td></tr>`;
}

function orderStatusLabel(s) {
    const map = { 0: 'Новый', 1: 'В обработке', 2: 'Отправлен', 3: 'Получен', 4: 'Отменён', Pending: 'Новый', Processing: 'В обработке', Shipped: 'Отправлен', Received: 'Получен', Cancelled: 'Отменён' };
    return map[s] ?? s;
}

function orderStatusClass(s) {
    const ok = [3, 'Received'];
    const warn = [1, 2, 'Processing', 'Shipped'];
    const err = [4, 'Cancelled'];
    if (ok.includes(s)) return 'badge-ok';
    if (warn.includes(s)) return 'badge-warn';
    if (err.includes(s)) return 'badge-err';
    return 'badge-neutral';
}

function promoTypeLabel(t) {
    const map = { 0: 'Обычная', 1: 'Happy Hour', 2: 'Товар дня' };
    return map[t] ?? t;
}

// ── SEARCH HELPER ─────────────────────────────────────────────
function addSearch(inputId, render, getData) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    inp.addEventListener('input', () => {
        const q = inp.value.toLowerCase();
        render(getData().filter(item => JSON.stringify(item).toLowerCase().includes(q)));
    });
}

// ── DASHBOARD ─────────────────────────────────────────────────
async function loadDashboard() {
    const endpoints = [
        ['/products', 'stat-products'],
        ['/suppliers', 'stat-suppliers'],
        ['/users', 'stat-customers'],
        ['/sales', 'stat-sales'],
    ];
    for (const [path, id] of endpoints) {
        api(path).then(data => {
            document.getElementById(id).textContent = Array.isArray(data) ? data.length : '—';
        }).catch(() => {
            document.getElementById(id).textContent = '—';
        });
    }
}

// ── PRODUCTS ──────────────────────────────────────────────────
let productsData = [];

async function loadProducts() {
    const tbody = document.getElementById('productsTbody');
    searching(tbody, 6);
    try {
        productsData = await api('/products') || [];
        renderProducts(productsData);
    } catch (e) {
        empty(tbody, 6, `Ошибка: ${e.message}`);
    }
}

function renderProducts(list) {
    const tbody = document.getElementById('productsTbody');
    if (!list.length) { empty(tbody, 6); return; }
    tbody.innerHTML = list.map(p => `
        <tr>
            <td><span class="id-badge">${p.id}</span></td>
            <td><strong>${esc(p.name)}</strong></td>
            <td class="muted-cell">${esc(p.description || '—')}</td>
            <td><span class="cell-badge">${p.warehouseCellId ?? '—'}</span></td>
            <td class="muted-cell">${fmtDate(p.dateAdd)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon" title="Редактировать" onclick="editProduct(${p.id})">✏</button>
                    <button class="btn-icon danger" title="Удалить" onclick="deleteProduct(${p.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('productsSearch', renderProducts, () => productsData);

document.getElementById('refreshProducts').addEventListener('click', loadProducts);
document.getElementById('openProductModal').addEventListener('click', () => {
    document.getElementById('productModalTitle').textContent = 'Новый товар';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    openModal('productModal');
});

document.getElementById('productForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const dto = {
        warehouseCellId: Number(form.warehouseCellId.value),
        name: form.name.value.trim(),
        description: form.description.value.trim() || null,
    };
    try {
        if (id) {
            await api(`/products/${id}`, { method: 'PUT', body: JSON.stringify({ id: Number(id), ...dto }) });
            showToast('Товар обновлён');
        } else {
            await api('/products', { method: 'POST', body: JSON.stringify(dto) });
            showToast('Товар создан');
        }
        closeModal('productModal');
        loadProducts();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function editProduct(id) {
    const p = productsData.find(x => x.id === id);
    if (!p) return;
    const form = document.getElementById('productForm');
    document.getElementById('productModalTitle').textContent = 'Редактировать товар';
    form.id.value = p.id;
    form.warehouseCellId.value = p.warehouseCellId;
    form.name.value = p.name;
    form.description.value = p.description || '';
    openModal('productModal');
}

async function deleteProduct(id) {
    if (!confirm('Удалить товар?')) return;
    try {
        await api(`/products/${id}`, { method: 'DELETE' });
        showToast('Товар удалён');
        loadProducts();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── WAREHOUSE ─────────────────────────────────────────────────
let warehouseData = [];

async function loadWarehouse() {
    const tbody = document.getElementById('warehouseTbody');
    searching(tbody, 3);
    try {
        const products = await api('/products') || [];
        warehouseData = products.map(p => ({ cellId: p.warehouseCellId, product: p.name }));
        renderWarehouse(warehouseData);
    } catch (e) {
        empty(tbody, 3, `Ошибка: ${e.message}`);
    }
}

function renderWarehouse(list) {
    const tbody = document.getElementById('warehouseTbody');
    if (!list.length) { empty(tbody, 3); return; }
    tbody.innerHTML = list.map(w => `
        <tr>
            <td><span class="cell-badge">${w.cellId ?? '—'}</span></td>
            <td>—</td>
            <td>${esc(w.product)}</td>
        </tr>`).join('');
}

addSearch('warehouseSearch', renderWarehouse, () => warehouseData);

document.getElementById('refreshWarehouse').addEventListener('click', loadWarehouse);
document.getElementById('openWarehouseModal').addEventListener('click', () => {
    document.getElementById('warehouseForm').reset();
    openModal('warehouseModal');
});

document.getElementById('warehouseForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const dto = {
        cellNumber: form.cellNumber.value.trim(),
        quantity: Number(form.quantity.value || 0),
    };
    try {
        await api('/products/create-warehousecell', { method: 'POST', body: JSON.stringify(dto) });
        showToast('Ячейка создана');
        closeModal('warehouseModal');
        loadWarehouse();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ── SUPPLIERS ─────────────────────────────────────────────────
let suppliersData = [];

async function loadSuppliers() {
    const tbody = document.getElementById('suppliersTbody');
    searching(tbody, 7);
    try {
        suppliersData = await api('/suppliers') || [];
        renderSuppliers(suppliersData);
    } catch (e) {
        empty(tbody, 7, `Ошибка: ${e.message}`);
    }
}

function renderSuppliers(list) {
    const tbody = document.getElementById('suppliersTbody');
    if (!list.length) { empty(tbody, 7); return; }
    tbody.innerHTML = list.map(s => `
        <tr>
            <td><span class="id-badge">${s.id}</span></td>
            <td><strong>${esc(s.name)}</strong></td>
            <td>${esc(s.country)}</td>
            <td><span class="badge ${s.isActive ? 'badge-ok' : 'badge-err'}">${s.isActive ? 'Активен' : 'Неактивен'}</span></td>
            <td class="muted-cell">${esc(s.countryInfo || '—')}</td>
            <td class="muted-cell">${fmtDate(s.createdAt)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon" title="Редактировать" onclick="editSupplier(${s.id})">✏</button>
                    <button class="btn-icon danger" title="Удалить" onclick="deleteSupplier(${s.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('suppliersSearch', renderSuppliers, () => suppliersData);

document.getElementById('refreshSuppliers').addEventListener('click', loadSuppliers);
document.getElementById('openSupplierModal').addEventListener('click', () => {
    document.getElementById('supplierModalTitle').textContent = 'Новый поставщик';
    document.getElementById('supplierForm').reset();
    document.getElementById('supplierId').value = '';
    document.querySelector('#supplierForm [name=isActive]').checked = true;
    openModal('supplierModal');
});
document.getElementById('openAssignModal').addEventListener('click', () => {
    document.getElementById('assignForm').reset();
    openModal('assignModal');
});

document.getElementById('supplierForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const dto = {
        name: form.name.value.trim(),
        country: form.country.value.trim(),
        isActive: form.isActive.checked,
        countryInfo: form.countryInfo.value.trim() || null,
    };
    try {
        if (id) {
            await api(`/suppliers/${id}`, { method: 'PUT', body: JSON.stringify({ id: Number(id), ...dto }) });
            showToast('Поставщик обновлён');
        } else {
            await api('/suppliers', { method: 'POST', body: JSON.stringify(dto) });
            showToast('Поставщик создан');
        }
        closeModal('supplierModal');
        loadSuppliers();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function editSupplier(id) {
    const s = suppliersData.find(x => x.id === id);
    if (!s) return;
    const form = document.getElementById('supplierForm');
    document.getElementById('supplierModalTitle').textContent = 'Редактировать поставщика';
    form.id.value = s.id;
    form.name.value = s.name;
    form.country.value = s.country;
    form.isActive.checked = s.isActive;
    form.countryInfo.value = s.countryInfo || '';
    openModal('supplierModal');
}

async function deleteSupplier(id) {
    if (!confirm('Удалить поставщика?')) return;
    try {
        await api(`/suppliers/${id}`, { method: 'DELETE' });
        showToast('Поставщик удалён');
        loadSuppliers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

document.getElementById('assignForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const supplierId = Number(form.supplierId.value);
    const productId = Number(form.productId.value);
    const isActive = form.isActive.checked;
    const supplier = suppliersData.find(s => s.id === supplierId);
    try {
        await api('/suppliers/assign-product', {
            method: 'POST',
            body: JSON.stringify({
                id: supplierId,
                productId,
                isActive,
                name: supplier ? supplier.name : '',
                country: supplier ? supplier.country : '',
                countryInfo: supplier ? (supplier.countryInfo || '') : '',
            }),
        });
        showToast('Товар привязан к поставщику');
        closeModal('assignModal');
        loadSuppliers();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

// ── CUSTOMERS ─────────────────────────────────────────────────
let customersData = [];

async function loadCustomers() {
    const tbody = document.getElementById('customersTbody');
    searching(tbody, 6);
    try {
        customersData = await api('/customers') || [];
        renderCustomers(customersData);
    } catch (e) {
        empty(tbody, 6, `Ошибка: ${e.message}`);
    }
}

function renderCustomers(list) {
    const tbody = document.getElementById('customersTbody');
    if (!list.length) { empty(tbody, 6); return; }
    tbody.innerHTML = list.map(c => `
        <tr>
            <td><span class="id-badge">${c.id}</span></td>
            <td><strong>${esc(c.firstName)} ${esc(c.lastName)}</strong></td>
            <td>${esc(c.email)}</td>
            <td class="muted-cell">${esc(c.phone || '—')}</td>
            <td class="muted-cell">${fmtDate(c.createdAt)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon" title="Редактировать" onclick="editCustomer(${c.id})">✏</button>
                    <button class="btn-icon danger" title="Удалить" onclick="deleteCustomer(${c.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('customersSearch', renderCustomers, () => customersData);

document.getElementById('refreshCustomers').addEventListener('click', loadCustomers);
document.getElementById('openCustomerModal').addEventListener('click', () => {
    document.getElementById('customerModalTitle').textContent = 'Новый покупатель';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
    openModal('customerModal');
});

document.getElementById('customerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const dto = {
        firstName: form.firstName.value.trim(),
        lastName: form.lastName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim() || null,
    };
    try {
        if (id) {
            await api(`/customers/${id}`, { method: 'PUT', body: JSON.stringify({ id: Number(id), ...dto }) });
            showToast('Покупатель обновлён');
        } else {
            await api('/customers', { method: 'POST', body: JSON.stringify(dto) });
            showToast('Покупатель добавлен');
        }
        closeModal('customerModal');
        loadCustomers();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function editCustomer(id) {
    const c = customersData.find(x => x.id === id);
    if (!c) return;
    const form = document.getElementById('customerForm');
    document.getElementById('customerModalTitle').textContent = 'Редактировать покупателя';
    form.id.value = c.id;
    form.firstName.value = c.firstName;
    form.lastName.value = c.lastName;
    form.email.value = c.email;
    form.phone.value = c.phone || '';
    openModal('customerModal');
}

async function deleteCustomer(id) {
    if (!confirm('Удалить покупателя?')) return;
    try {
        await api(`/customers/${id}`, { method: 'DELETE' });
        showToast('Покупатель удалён');
        loadCustomers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── SALES ─────────────────────────────────────────────────────
let salesData = [];

async function loadSales() {
    const tbody = document.getElementById('salesTbody');
    searching(tbody, 8);
    try {
        salesData = await api('/sales') || [];
        renderSales(salesData);
    } catch (e) {
        empty(tbody, 8, `Ошибка: ${e.message}`);
    }
}

function renderSales(list) {
    const tbody = document.getElementById('salesTbody');
    if (!list.length) { empty(tbody, 8); return; }
    tbody.innerHTML = list.map(s => `
        <tr>
            <td><span class="id-badge">${s.id}</span></td>
            <td>${s.customerId ?? '—'}</td>
            <td>${s.cashRegisterId ?? '—'}</td>
            <td>${esc(s.paymentMethod || '—')}</td>
            <td><strong>${fmtMoney(s.totalAmount)}</strong></td>
            <td>${s.items ? s.items.length : '—'}</td>
            <td class="muted-cell">${fmtDate(s.createdAt)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon" title="Детали" onclick="viewSale(${s.id})">👁</button>
                    <button class="btn-icon danger" title="Удалить" onclick="deleteSale(${s.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('salesSearch', renderSales, () => salesData);

document.getElementById('refreshSales').addEventListener('click', loadSales);

document.getElementById('openSaleModal').addEventListener('click', () => {
    document.getElementById('saleForm').reset();
    document.getElementById('saleItems').innerHTML = '';
    addSaleItemRow();
    openModal('saleModal');
});

document.getElementById('openTransactionModal').addEventListener('click', () => {
    document.getElementById('transactionForm').reset();
    openModal('transactionModal');
});

document.getElementById('addSaleItem').addEventListener('click', addSaleItemRow);

function addSaleItemRow() {
    const container = document.getElementById('saleItems');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <div class="item-row-fields">
            <label>Товар ID<input name="productId" type="number" min="1" required placeholder="1"></label>
            <label>Поставщик ID<input name="supplierId" type="number" min="1" required placeholder="1"></label>
            <label>Кол-во<input name="quantity" type="number" min="1" value="1" required></label>
            <label>Цена продажи<input name="unitPrice" type="number" min="0" step="0.01" required placeholder="0.00"></label>
            <label>Себестоимость<input name="unitCost" type="number" min="0" step="0.01" required placeholder="0.00"></label>
        </div>
        <button type="button" class="btn-icon danger remove-row" title="Удалить строку">✕</button>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
}

document.getElementById('saleForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const items = collectItemRows('saleItems', ['productId', 'supplierId', 'quantity', 'unitPrice', 'unitCost']);
    const dto = {
        customerId: Number(form.customerId.value),
        cashRegisterId: Number(form.cashRegisterId.value),
        paymentMethod: form.paymentMethod.value,
        items,
    };
    try {
        await api('/sales', { method: 'POST', body: JSON.stringify(dto) });
        showToast('Продажа создана');
        closeModal('saleModal');
        loadSales();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

document.getElementById('transactionForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const saleId = Number(form.saleId.value);
    const dto = {
        cashRegisterId: Number(form.cashRegisterId.value),
        amount: Number(form.amount.value),
        type: form.type.value,
        note: form.note.value.trim() || null,
    };
    try {
        await api(`/sales/${saleId}/transactions`, { method: 'POST', body: JSON.stringify(dto) });
        showToast('Транзакция добавлена');
        closeModal('transactionModal');
        loadSales();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function viewSale(id) {
    try {
        const s = await api(`/sales/${id}`);
        const txns = await api(`/sales/${id}/transactions`).catch(() => []);
        document.getElementById('saleDetailTitle').textContent = `Продажа #${id}`;
        const body = document.getElementById('saleDetailBody');
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span>ID</span><strong>${s.id}</strong></div>
                <div class="detail-item"><span>Покупатель ID</span><strong>${s.customerId ?? '—'}</strong></div>
                <div class="detail-item"><span>Касса ID</span><strong>${s.cashRegisterId ?? '—'}</strong></div>
                <div class="detail-item"><span>Способ оплаты</span><strong>${esc(s.paymentMethod || '—')}</strong></div>
                <div class="detail-item"><span>Сумма</span><strong>${fmtMoney(s.totalAmount)}</strong></div>
                <div class="detail-item"><span>Дата</span><strong>${fmtDate(s.createdAt)}</strong></div>
            </div>
            <h4>Позиции</h4>
            <table class="data-table">
                <thead><tr><th>Товар ID</th><th>Поставщик ID</th><th>Кол-во</th><th>Цена</th><th>Себест.</th></tr></thead>
                <tbody>${(s.items || []).map(i => `<tr><td>${i.productId}</td><td>${i.supplierId}</td><td>${i.quantity}</td><td>${fmtMoney(i.unitPrice)}</td><td>${fmtMoney(i.unitCost)}</td></tr>`).join('') || '<tr><td colspan="5" class="empty-row">Нет позиций</td></tr>'}</tbody>
            </table>
            <h4>Транзакции</h4>
            <table class="data-table">
                <thead><tr><th>ID</th><th>Касса</th><th>Сумма</th><th>Тип</th><th>Комментарий</th></tr></thead>
                <tbody>${(Array.isArray(txns) ? txns : []).map(t => `<tr><td>${t.id}</td><td>${t.cashRegisterId}</td><td>${fmtMoney(t.amount)}</td><td>${t.type}</td><td>${esc(t.note || '—')}</td></tr>`).join('') || '<tr><td colspan="5" class="empty-row">Нет транзакций</td></tr>'}</tbody>
            </table>`;
        openModal('saleDetailModal');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteSale(id) {
    if (!confirm('Удалить продажу?')) return;
    try {
        await api(`/sales/${id}`, { method: 'DELETE' });
        showToast('Продажа удалена');
        loadSales();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── ORDERS ────────────────────────────────────────────────────
let ordersData = [];

async function loadOrders() {
    const tbody = document.getElementById('ordersTbody');
    searching(tbody, 8);
    try {
        ordersData = await api('/orders') || [];
        renderOrders(ordersData);
    } catch (e) {
        empty(tbody, 8, `Ошибка: ${e.message}`);
    }
}

function renderOrders(list) {
    const tbody = document.getElementById('ordersTbody');
    if (!list.length) { empty(tbody, 8); return; }
    tbody.innerHTML = list.map(o => `
        <tr>
            <td><span class="id-badge">${o.id}</span></td>
            <td>${o.supplierId ?? '—'}</td>
            <td>${o.managerId ?? '—'}</td>
            <td><span class="badge ${orderStatusClass(o.status)}">${orderStatusLabel(o.status)}</span></td>
            <td><strong>${fmtMoney(o.totalAmount)}</strong></td>
            <td>${o.items ? o.items.length : '—'}</td>
            <td class="muted-cell">${fmtDate(o.createdAt)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon" title="Детали" onclick="viewOrder(${o.id})">👁</button>
                    <button class="btn-icon danger" title="Удалить" onclick="deleteOrder(${o.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('ordersSearch', renderOrders, () => ordersData);

document.getElementById('refreshOrders').addEventListener('click', loadOrders);

document.getElementById('openOrderModal').addEventListener('click', () => {
    document.getElementById('orderForm').reset();
    document.getElementById('orderItems').innerHTML = '';
    addOrderItemRow();
    openModal('orderModal');
});

document.getElementById('addOrderItem').addEventListener('click', addOrderItemRow);

function addOrderItemRow() {
    const container = document.getElementById('orderItems');
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
        <div class="item-row-fields">
            <label>Товар ID<input name="productId" type="number" min="1" required placeholder="1"></label>
            <label>Кол-во<input name="quantity" type="number" min="1" value="1" required></label>
            <label>Цена за ед.<input name="unitPrice" type="number" min="0" step="0.01" required placeholder="0.00"></label>
        </div>
        <button type="button" class="btn-icon danger remove-row" title="Удалить строку">✕</button>`;
    row.querySelector('.remove-row').addEventListener('click', () => row.remove());
    container.appendChild(row);
}

document.getElementById('orderForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const items = collectItemRows('orderItems', ['productId', 'quantity', 'unitPrice']);
    const dto = {
        supplierId: Number(form.supplierId.value),
        managerId: Number(form.managerId.value),
        items,
    };
    try {
        await api('/orders', { method: 'POST', body: JSON.stringify(dto) });
        showToast('Заказ создан');
        closeModal('orderModal');
        loadOrders();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function viewOrder(id) {
    try {
        const o = await api(`/orders/${id}`);
        document.getElementById('orderDetailTitle').textContent = `Заказ #${id}`;
        const body = document.getElementById('orderDetailBody');
        body.innerHTML = `
            <div class="detail-grid">
                <div class="detail-item"><span>ID</span><strong>${o.id}</strong></div>
                <div class="detail-item"><span>Поставщик ID</span><strong>${o.supplierId ?? '—'}</strong></div>
                <div class="detail-item"><span>Менеджер ID</span><strong>${o.managerId ?? '—'}</strong></div>
                <div class="detail-item"><span>Статус</span><span class="badge ${orderStatusClass(o.status)}">${orderStatusLabel(o.status)}</span></div>
                <div class="detail-item"><span>Сумма</span><strong>${fmtMoney(o.totalAmount)}</strong></div>
                <div class="detail-item"><span>Создан</span><strong>${fmtDate(o.createdAt)}</strong></div>
            </div>
            <h4>Позиции</h4>
            <table class="data-table">
                <thead><tr><th>Товар ID</th><th>Кол-во</th><th>Цена за ед.</th><th>Сумма</th></tr></thead>
                <tbody>${(o.items || []).map(i => `<tr><td>${i.productId}</td><td>${i.quantity}</td><td>${fmtMoney(i.unitPrice)}</td><td>${fmtMoney((i.quantity || 0) * (i.unitPrice || 0))}</td></tr>`).join('') || '<tr><td colspan="4" class="empty-row">Нет позиций</td></tr>'}</tbody>
            </table>`;
        openModal('orderDetailModal');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteOrder(id) {
    if (!confirm('Удалить заказ?')) return;
    try {
        await api(`/orders/${id}`, { method: 'DELETE' });
        showToast('Заказ удалён');
        loadOrders();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── PROMOTIONS ────────────────────────────────────────────────
let promotionsData = [];

async function loadPromotions() {
    const tbody = document.getElementById('promotionsTbody');
    searching(tbody, 8);
    try {
        promotionsData = await api('/promotions') || [];
        renderPromotions(promotionsData);
    } catch (e) {
        empty(tbody, 8, `Ошибка: ${e.message}`);
    }
}

function renderPromotions(list) {
    const tbody = document.getElementById('promotionsTbody');
    if (!list.length) { empty(tbody, 8); return; }
    tbody.innerHTML = list.map(p => `
        <tr>
            <td><span class="id-badge">${p.id}</span></td>
            <td><strong>${esc(p.name)}</strong></td>
            <td>${promoTypeLabel(p.promotionType)}</td>
            <td><span class="discount-badge">${p.discountPercent ?? '—'}%</span></td>
            <td>${p.productId ?? '—'}</td>
            <td class="muted-cell">${fmtDate(p.startAt)}</td>
            <td class="muted-cell">${fmtDate(p.endAt)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon danger" title="Удалить" onclick="deletePromotion(${p.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('promotionsSearch', renderPromotions, () => promotionsData);

document.getElementById('refreshPromotions').addEventListener('click', loadPromotions);

function openPromoModal(type) {
    const form = document.getElementById('promotionForm');
    form.reset();
    document.getElementById('promoTypeHidden').value = type;
    const labels = { generic: 'Новая акция', 'happy-hour': 'Создать Happy Hour', 'product-of-day': 'Товар дня' };
    document.getElementById('promotionModalTitle').textContent = labels[type] || 'Новая акция';
    const typeSelect = form.querySelector('[name=promotionType]');
    if (type === 'happy-hour') typeSelect.value = '1';
    else if (type === 'product-of-day') typeSelect.value = '2';
    else typeSelect.value = '0';
    openModal('promotionModal');
}

document.getElementById('openPromotionModal').addEventListener('click', () => openPromoModal('generic'));
document.getElementById('openHappyHourModal').addEventListener('click', () => openPromoModal('happy-hour'));
document.getElementById('openProductOfDayModal').addEventListener('click', () => openPromoModal('product-of-day'));

document.getElementById('promotionForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const promoType = document.getElementById('promoTypeHidden').value;
    const dto = {
        name: form.name.value.trim(),
        promotionType: Number(form.promotionType.value),
        productId: Number(form.productId.value),
        discountPercent: Number(form.discountPercent.value),
        startAt: form.startAt.value ? new Date(form.startAt.value).toISOString() : null,
        endAt: form.endAt.value ? new Date(form.endAt.value).toISOString() : null,
    };
    let endpoint = '/promotions';
    if (promoType === 'happy-hour') endpoint = '/promotions/happy-hour';
    else if (promoType === 'product-of-day') endpoint = '/promotions/product-of-day';
    try {
        await api(endpoint, { method: 'POST', body: JSON.stringify(dto) });
        showToast('Акция создана');
        closeModal('promotionModal');
        loadPromotions();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function deletePromotion(id) {
    if (!confirm('Удалить акцию?')) return;
    try {
        await api(`/promotions/${id}`, { method: 'DELETE' });
        showToast('Акция удалена');
        loadPromotions();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── CASH REGISTERS ────────────────────────────────────────────
let cashData = [];

async function loadCash() {
    const tbody = document.getElementById('cashTbody');
    searching(tbody, 4);
    try {
        cashData = await api('/cash-registers') || [];
        renderCash(cashData);
    } catch (e) {
        empty(tbody, 4, `Ошибка: ${e.message}`);
    }
}

function renderCash(list) {
    const tbody = document.getElementById('cashTbody');
    if (!list.length) { empty(tbody, 4); return; }
    tbody.innerHTML = list.map(c => `
        <tr>
            <td><span class="id-badge">${c.id}</span></td>
            <td><strong>${esc(c.name)}</strong></td>
            <td>${esc(c.location)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn-icon" title="Редактировать" onclick="editCash(${c.id})">✏</button>
                    <button class="btn-icon danger" title="Удалить" onclick="deleteCash(${c.id})">✕</button>
                </div>
            </td>
        </tr>`).join('');
}

addSearch('cashSearch', renderCash, () => cashData);

document.getElementById('refreshCash').addEventListener('click', loadCash);
document.getElementById('openCashModal').addEventListener('click', () => {
    document.getElementById('cashModalTitle').textContent = 'Новая касса';
    document.getElementById('cashForm').reset();
    document.getElementById('cashId').value = '';
    openModal('cashModal');
});

document.getElementById('cashForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const id = form.id.value;
    const dto = {
        name: form.name.value.trim(),
        location: form.location.value.trim(),
    };
    try {
        if (id) {
            await api(`/cash-registers/${id}`, { method: 'PUT', body: JSON.stringify({ id: Number(id), ...dto }) });
            showToast('Касса обновлена');
        } else {
            await api('/cash-registers', { method: 'POST', body: JSON.stringify(dto) });
            showToast('Касса создана');
        }
        closeModal('cashModal');
        loadCash();
    } catch (err) {
        showToast(err.message, 'error');
    }
});

async function editCash(id) {
    const c = cashData.find(x => x.id === id);
    if (!c) return;
    const form = document.getElementById('cashForm');
    document.getElementById('cashModalTitle').textContent = 'Редактировать кассу';
    form.id.value = c.id;
    form.name.value = c.name;
    form.location.value = c.location;
    openModal('cashModal');
}

async function deleteCash(id) {
    if (!confirm('Удалить кассу?')) return;
    try {
        await api(`/cash-registers/${id}`, { method: 'DELETE' });
        showToast('Касса удалена');
        loadCash();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ── UTILITIES ─────────────────────────────────────────────────
function collectItemRows(containerId, fields) {
    const container = document.getElementById(containerId);
    return Array.from(container.querySelectorAll('.item-row')).map(row => {
        const entry = {};
        fields.forEach(field => {
            const input = row.querySelector(`[name="${field}"]`);
            const raw = input ? input.value.trim() : '';
            const num = Number(raw);
            entry[field] = raw === '' ? null : (Number.isFinite(num) ? num : raw);
        });
        return entry;
    }).filter(item => item[fields[0]] !== null);
}

function esc(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── INIT ──────────────────────────────────────────────────────
(async function init() {
    try {
        await api('/products');
        setConnectionStatus(true);
    } catch {
        setConnectionStatus(false);
    }
    loadDashboard();
})();
