// ── AUTH ─────────────────────────────────────────────────────
const AUTH_KEY = 'asm_admin_token';
const AUTH_USER_KEY = 'asm_admin_user';

function getToken() { return localStorage.getItem(AUTH_KEY); }
function setToken(t) { localStorage.setItem(AUTH_KEY, t); }
function clearToken() { localStorage.removeItem(AUTH_KEY); localStorage.removeItem(AUTH_USER_KEY); }

function isLoggedIn() { return !!getToken(); }

function showApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').classList.add('show');
    const user = localStorage.getItem(AUTH_USER_KEY) || 'admin';
    document.getElementById('adminUsername').textContent = user;
    initApp();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminApp').classList.remove('show');
}

document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const password = form.password.value;
    const errEl = document.getElementById('loginError');
    errEl.classList.remove('show');
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    btn.textContent = 'Вход...';
    try {
        const base = (localStorage.getItem('apiBase') || `${window.location.origin}/api/v1`).replace(/\/$/, '');
        const res = await fetch(`${base}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName: username, password }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) throw new Error(data?.message || 'Неверные данные для входа');
        const token = data?.data?.token;
        if (!token) throw new Error('Токен не получен от сервера');
        setToken(token);
        localStorage.setItem(AUTH_USER_KEY, username);
        showApp();
    } catch (err) {
        errEl.textContent = err.message;
        errEl.classList.add('show');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Войти';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    clearToken();
    showLogin();
});

// ── API ──────────────────────────────────────────────────────
const defaultBase = `${window.location.origin}/api/v1`;
const apiBaseInput = document.getElementById('apiBase');
if (apiBaseInput) {
    apiBaseInput.value = localStorage.getItem('apiBase') || defaultBase;
}

function getBase() {
    return (apiBaseInput ? apiBaseInput.value : defaultBase).replace(/\/$/, '');
}

async function api(path, options = {}) {
    const token = typeof getToken === 'function' ? getToken() : null;
    const headers = { ...options.headers };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }

    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    } else {
        headers['Accept'] = 'application/json';
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    const res = await fetch(`${getBase()}${normalizedPath}`, { ...options, headers });
    
    if (res.status === 401) {
        if (typeof clearToken === 'function') clearToken();
        if (typeof showLogin === 'function') showLogin();
        throw new Error('Сессия истекла. Войдите снова.');
    }

    const text = await res.text();
    let data = null;
    try { 
        data = text ? JSON.parse(text) : null; 
    } catch { 
        data = text; 
    }

    if (!res.ok) {
        const msg = (data && data.message) ? data.message : ((data && data.title) ? data.title : res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
    }

    if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
    }
    
    return data;
}

function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = `toast toast-${type} show`;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

function setConnectionStatus(ok) {
    const badge = document.getElementById('statusBadge');
    const status = document.getElementById('connectionStatus');
    if (!badge || !status) return;
    
    if (ok) {
        badge.className = 'badge badge-ok'; badge.textContent = '● Подключено';
        status.textContent = 'Подключено'; status.className = 'connection-status ok';
    } else {
        badge.className = 'badge badge-err'; badge.textContent = '● Ошибка';
        status.textContent = 'Ошибка'; status.className = 'connection-status err';
    }
}

const saveApiBaseBtn = document.getElementById('saveApiBase');
if (saveApiBaseBtn) {
    saveApiBaseBtn.addEventListener('click', () => {
        const v = apiBaseInput.value.trim().replace(/\/$/, '');
        if (!v) return;
        localStorage.setItem('apiBase', v);
        showToast('URL API сохранён');
    });
}

const pingApiBtn = document.getElementById('pingApi');
if (pingApiBtn) {
    pingApiBtn.addEventListener('click', async () => {
        try { 
            await fetch(`${getBase()}/products`); 
            setConnectionStatus(true); 
            showToast('Соединение установлено'); 
        } catch { 
            setConnectionStatus(false); 
            showToast('Нет связи с API', 'error'); 
        }
    });
}

// ── NAVIGATION ───────────────────────────────────────────────
const tabNames = { dashboard:'Дашборд', products:'Товары', warehouse:'Ячейки склада', suppliers:'Поставщики', customers:'Покупатели', sales:'Продажи', orders:'Заказы', promotions:'Акции', 'cash-registers':'Кассы' };

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

document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', e => { e.preventDefault(); switchTab(l.dataset.tab); }));
document.querySelectorAll('[data-tab-link]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); switchTab(el.dataset.tabLink); }));
document.getElementById('menuToggle').addEventListener('click', e => { e.stopPropagation(); document.getElementById('sidebar').classList.toggle('open'); });
document.addEventListener('click', e => { const sidebar = document.getElementById('sidebar'); if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target.id !== 'menuToggle') sidebar.classList.remove('open'); });

function loadTabData(tab) {
    switch(tab) {
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

// ── MODALS ───────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }
document.querySelectorAll('.modal-close, [data-modal]').forEach(btn => btn.addEventListener('click', () => closeModal(btn.dataset.modal || btn.closest('.modal-overlay').id)));
document.querySelectorAll('.modal-overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) closeModal(o.id); }));
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id)); });

// ── HELPERS ──────────────────────────────────────────────────
function fmtDate(iso) { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('ru-RU', {day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'}); }
function fmtMoney(val) { if (val==null) return '—'; return Number(val).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽'; }
function empty(tbody, cols, msg='Нет данных') { tbody.innerHTML=`<tr><td colspan="${cols}" class="empty-row">${msg}</td></tr>`; }
function loading(tbody, cols) { tbody.innerHTML=`<tr><td colspan="${cols}" class="empty-row loading-row">Загрузка...</td></tr>`; }
function orderStatusLabel(s) { const m={0:'Новый',1:'В обработке',2:'Отправлен',3:'Получен',4:'Отменён',Pending:'Новый',Processing:'В обработке',Shipped:'Отправлен',Received:'Получен',Cancelled:'Отменён'}; return m[s]??s; }
function orderStatusClass(s) { if ([3,'Received'].includes(s)) return 'badge-ok'; if ([1,2,'Processing','Shipped'].includes(s)) return 'badge-warn'; if ([4,'Cancelled'].includes(s)) return 'badge-err'; return 'badge-neutral'; }
function promoTypeLabel(t) { return {0:'Обычная',1:'Happy Hour',2:'Товар дня'}[t]??t; }
function esc(str) { if(str==null)return''; return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function addSearch(inputId, render, getData) { const inp=document.getElementById(inputId); if(!inp)return; inp.addEventListener('input',()=>{ const q=inp.value.toLowerCase(); render(getData().filter(i=>JSON.stringify(i).toLowerCase().includes(q))); }); }
function collectItemRows(containerId, fields) { return Array.from(document.getElementById(containerId).querySelectorAll('.item-row')).map(row=>{ const e={}; fields.forEach(f=>{ const inp=row.querySelector(`[name="${f}"]`); const raw=inp?inp.value.trim():''; const n=Number(raw); e[f]=raw===''?null:(Number.isFinite(n)?n:raw); }); return e; }).filter(i=>i[fields[0]]!==null); }

// ── DASHBOARD ────────────────────────────────────────────────
async function loadDashboard() {
    const eps=[['/products','stat-products'],['/suppliers','stat-suppliers'],['/customers','stat-customers'],['/orders','stat-orders'],['/sales','stat-sales'],['/cash-registers','stat-cash']];
    for(const [p,id] of eps) api(p).then(d=>{ document.getElementById(id).textContent=Array.isArray(d)?d.length:'—'; }).catch(()=>{ document.getElementById(id).textContent='—'; });
}

// ── PRODUCTS ─────────────────────────────────────────────────
let productsData=[];
async function loadProducts() { const b=document.getElementById('productsTbody'); loading(b,7); try{ productsData=await api('/products')||[]; renderProducts(productsData); }catch(e){ empty(b,7,`Ошибка: ${e.message}`); } }
const CATEGORY_LABELS_ADMIN = {'brakes':'Тормоза','suspension':'Подвеска','engine':'Двигатель','filters':'Фильтры','electrics':'Электрика','engine-oils':'Масла мот.','trans-oils':'Масла транс.','brake-fluids':'Торм. жидк.','coolants':'Антифризы','tyres-only':'Шины','wheels':'Диски','tubes':'Камеры','tyre-accessories':'Принадл. шин','chemicals':'Автохимия','tools':'Инструменты','home':'Для дома'};
function renderProducts(list) { const b=document.getElementById('productsTbody'); if(!list.length){empty(b,7);return;} b.innerHTML=list.map(p=>`<tr><td><span class="id-badge">${p.id}</span></td><td><strong>${esc(p.name)}</strong></td><td class="muted-cell">${p.category?`<span class="badge badge-neutral">${esc(CATEGORY_LABELS_ADMIN[p.category]||p.category)}</span>`:'—'}</td><td>${p.price?`<strong>${Number(p.price).toLocaleString('ru-RU')} ₽</strong>`:'—'}</td><td><span class="cell-badge">${p.warehouseCellId??'—'}</span></td><td class="muted-cell">${fmtDate(p.dateAdd)}</td><td><div class="row-actions"><button class="btn-icon" onclick="editProduct(${p.id})">✏</button><button class="btn-icon danger" onclick="deleteProduct(${p.id})">✕</button></div></td></tr>`).join(''); }
addSearch('productsSearch',renderProducts,()=>productsData);
document.getElementById('refreshProducts').addEventListener('click',loadProducts);
document.getElementById('openProductModal').addEventListener('click',()=>{ document.getElementById('productModalTitle').textContent='Новый товар'; document.getElementById('productForm').reset(); document.getElementById('productId').value=''; openModal('productModal'); });
document.getElementById('productForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; const id=f.id.value; const dto={warehouseCellId:Number(f.warehouseCellId.value),name:f.name.value.trim(),description:f.description.value.trim()||null,price:f.price&&f.price.value?Number(f.price.value):null,category:f.category?f.category.value||null:null}; try{ if(id){await api(`/products/${id}`,{method:'PUT',body:JSON.stringify({id:Number(id),...dto})}); showToast('Товар обновлён');}else{await api('/products',{method:'POST',body:JSON.stringify(dto)}); showToast('Товар создан');} closeModal('productModal'); loadProducts(); }catch(err){ showToast(err.message,'error'); } });
async function editProduct(id){ const p=productsData.find(x=>x.id===id); if(!p)return; const f=document.getElementById('productForm'); document.getElementById('productModalTitle').textContent='Редактировать товар'; f.id.value=p.id; f.warehouseCellId.value=p.warehouseCellId; f.name.value=p.name; f.description.value=p.description||''; if(f.price)f.price.value=p.price||''; if(f.category)f.category.value=p.category||''; openModal('productModal'); }
async function deleteProduct(id){ if(!confirm('Удалить товар?'))return; try{await api(`/products/${id}`,{method:'DELETE'}); showToast('Товар удалён'); loadProducts();}catch(err){showToast(err.message,'error');} }

// ── WAREHOUSE ────────────────────────────────────────────────
let warehouseData=[];
async function loadWarehouse(){ const b=document.getElementById('warehouseTbody'); loading(b,3); try{ const p=await api('/products')||[]; warehouseData=p.map(x=>({cellId:x.warehouseCellId,product:x.name})); renderWarehouse(warehouseData); }catch(e){empty(b,3,`Ошибка: ${e.message}`);} }
function renderWarehouse(list){ const b=document.getElementById('warehouseTbody'); if(!list.length){empty(b,3);return;} b.innerHTML=list.map(w=>`<tr><td><span class="cell-badge">${w.cellId??'—'}</span></td><td>—</td><td>${esc(w.product)}</td></tr>`).join(''); }
addSearch('warehouseSearch',renderWarehouse,()=>warehouseData);
document.getElementById('refreshWarehouse').addEventListener('click',loadWarehouse);
document.getElementById('openWarehouseModal').addEventListener('click',()=>{ document.getElementById('warehouseForm').reset(); openModal('warehouseModal'); });
document.getElementById('warehouseForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; try{ await api('/products/create-warehousecell',{method:'POST',body:JSON.stringify({cellNumber:f.cellNumber.value.trim(),quantity:Number(f.quantity.value||0)})}); showToast('Ячейка создана'); closeModal('warehouseModal'); loadWarehouse(); }catch(err){showToast(err.message,'error');} });

// ── SUPPLIERS ────────────────────────────────────────────────
let suppliersData=[];
async function loadSuppliers(){ const b=document.getElementById('suppliersTbody'); loading(b,7); try{ suppliersData=await api('/suppliers')||[]; renderSuppliers(suppliersData); }catch(e){empty(b,7,`Ошибка: ${e.message}`);} }
function renderSuppliers(list){ const b=document.getElementById('suppliersTbody'); if(!list.length){empty(b,7);return;} b.innerHTML=list.map(s=>`<tr><td><span class="id-badge">${s.id}</span></td><td><strong>${esc(s.name)}</strong></td><td>${esc(s.country)}</td><td><span class="badge ${s.isActive?'badge-ok':'badge-err'}">${s.isActive?'Активен':'Неактивен'}</span></td><td class="muted-cell">${esc(s.countryInfo||'—')}</td><td class="muted-cell">${fmtDate(s.createdAt)}</td><td><div class="row-actions"><button class="btn-icon" onclick="editSupplier(${s.id})">✏</button><button class="btn-icon danger" onclick="deleteSupplier(${s.id})">✕</button></div></td></tr>`).join(''); }
addSearch('suppliersSearch',renderSuppliers,()=>suppliersData);
document.getElementById('refreshSuppliers').addEventListener('click',loadSuppliers);
document.getElementById('openSupplierModal').addEventListener('click',()=>{ document.getElementById('supplierModalTitle').textContent='Новый поставщик'; document.getElementById('supplierForm').reset(); document.getElementById('supplierId').value=''; document.querySelector('#supplierForm [name=isActive]').checked=true; openModal('supplierModal'); });
document.getElementById('openAssignModal').addEventListener('click',()=>{ document.getElementById('assignForm').reset(); openModal('assignModal'); });
document.getElementById('supplierForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; const id=f.id.value; const dto={name:f.name.value.trim(),country:f.country.value.trim(),isActive:f.isActive.checked,countryInfo:f.countryInfo.value.trim()||null}; try{ if(id){await api(`/suppliers/${id}`,{method:'PUT',body:JSON.stringify({id:Number(id),...dto})}); showToast('Поставщик обновлён');}else{await api('/suppliers',{method:'POST',body:JSON.stringify(dto)}); showToast('Поставщик создан');} closeModal('supplierModal'); loadSuppliers(); }catch(err){showToast(err.message,'error');} });
async function editSupplier(id){ const s=suppliersData.find(x=>x.id===id); if(!s)return; const f=document.getElementById('supplierForm'); document.getElementById('supplierModalTitle').textContent='Редактировать поставщика'; f.id.value=s.id; f.name.value=s.name; f.country.value=s.country; f.isActive.checked=s.isActive; f.countryInfo.value=s.countryInfo||''; openModal('supplierModal'); }
async function deleteSupplier(id){ if(!confirm('Удалить поставщика?'))return; try{await api(`/suppliers/${id}`,{method:'DELETE'}); showToast('Поставщик удалён'); loadSuppliers();}catch(err){showToast(err.message,'error');} }
document.getElementById('assignForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; const sid=Number(f.supplierId.value); const pid=Number(f.productId.value); const s=suppliersData.find(x=>x.id===sid); try{ await api('/suppliers/assign-product',{method:'POST',body:JSON.stringify({id:sid,productId:pid,isActive:f.isActive.checked,name:s?s.name:'',country:s?s.country:'',countryInfo:s?(s.countryInfo||''):''})}); showToast('Товар привязан'); closeModal('assignModal'); loadSuppliers(); }catch(err){showToast(err.message,'error');} });

// ── CUSTOMERS ────────────────────────────────────────────────
let customersData=[];
async function loadCustomers() {
    const b = document.getElementById('customersTbody');
    loading(b, 6); 
    try {
        const res = await api('/user');
        customersData = Array.isArray(res) ? res : [];
        renderCustomers(customersData);
    } catch (e) {
        empty(b, 6, `Ошибка: ${e.message}`);
    }
}
function renderCustomers(list) {
    const b = document.getElementById('customersTbody'); 
    if (!list.length) {
        empty(b, 6); 
        return;
    } 
    b.innerHTML = list.map(c => `<tr>
        <td><span class="id-badge">${c.id || c.Id}</span></td>
        <td><strong>${esc(c.firstName || c.FirstName)} ${esc(c.lastName || c.LastName)}</strong></td>
        <td>${esc(c.email || c.Email)}</td>
        <td class="muted-cell">${esc(c.phoneNumber || c.PhoneNumber || '—')}</td>
        <td class="muted-cell">${c.createdAt ? fmtDate(c.createdAt) : '—'}</td>
        <td>
            <div class="row-actions">
                <button class="btn-icon" onclick="editCustomer(${c.id || c.Id})">✏</button>
                <button class="btn-icon danger" onclick="deleteCustomer(${c.id || c.Id})">✕</button>
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
    const f = e.target; 
    
    // В форме у вас инпуты обычно называются id, firstName, lastName, email, phone (или phoneNumber)
    const id = f.elements['id'] ? f.elements['id'].value : (f.elements['Id'] ? f.elements['Id'].value : ''); 
    
    const dto = {
        firstName: f.elements['firstName'] ? f.elements['firstName'].value.trim() : '', 
        lastName: f.elements['lastName'] ? f.elements['lastName'].value.trim() : '', 
        email: f.elements['email'] ? f.elements['email'].value.trim() : '',
        // Зависит от того, как вы назвали инпут телефона (phone или phoneNumber) 
        phoneNumber: f.elements['phone'] ? f.elements['phone'].value.trim() : (f.elements['phoneNumber'] ? f.elements['phoneNumber'].value.trim() : null)
    }; 
    
    try { 
        if (id) { 
            await api(`/user/${id}`, { method: 'PUT', body: JSON.stringify({ id: Number(id), ...dto }) }); 
            showToast('Покупатель обновлён'); 
        } else { 
            await api('/user', { method: 'POST', body: JSON.stringify(dto) }); 
            showToast('Покупатель добавлен'); 
        } 
        closeModal('customerModal'); 
        loadCustomers(); 
    } catch (err) { 
        showToast(err.message, 'error'); 
    }
});

async function editCustomer(id) {
    const c = customersData.find(x => x.id === id || x.Id === id); 
    if (!c) return; 
    
    const f = document.getElementById('customerForm');
    document.getElementById('customerModalTitle').textContent = 'Редактировать покупателя';
    
    if (f.elements['id']) f.elements['id'].value = c.id || c.Id || ''; 
    else if (f.elements['Id']) f.elements['Id'].value = c.id || c.Id || '';
    
    if (f.elements['firstName']) f.elements['firstName'].value = c.firstName || c.FirstName || ''; 
    if (f.elements['lastName']) f.elements['lastName'].value = c.lastName || c.LastName || '';
    if (f.elements['email']) f.elements['email'].value = c.email || c.Email || ''; 
    
    if (f.elements['phone']) f.elements['phone'].value = c.phoneNumber || c.PhoneNumber || ''; 
    else if (f.elements['phoneNumber']) f.elements['phoneNumber'].value = c.phoneNumber || c.PhoneNumber || ''; 
    
    openModal('customerModal');
}

async function deleteCustomer(id) {
    if (!confirm('Удалить покупателя?')) return; 
    try {
        await api(`/user/${id}`, { method: 'DELETE' }); 
        showToast('Покупатель удалён'); 
        loadCustomers();
    } catch (err) { 
        showToast(err.message, 'error'); 
    }
}

// ── SALES ────────────────────────────────────────────────────
let salesData=[];
async function loadSales(){ const b=document.getElementById('salesTbody'); loading(b,8); try{ salesData=await api('/sales')||[]; renderSales(salesData); }catch(e){empty(b,8,`Ошибка: ${e.message}`);} }
function renderSales(list){ const b=document.getElementById('salesTbody'); if(!list.length){empty(b,8);return;} b.innerHTML=list.map(s=>`<tr><td><span class="id-badge">${s.id}</span></td><td>${s.customerId??'—'}</td><td>${s.cashRegisterId??'—'}</td><td>${esc(s.paymentMethod||'—')}</td><td><strong>${fmtMoney(s.totalAmount)}</strong></td><td>${s.items?s.items.length:'—'}</td><td class="muted-cell">${fmtDate(s.createdAt)}</td><td><div class="row-actions"><button class="btn-icon" onclick="viewSale(${s.id})">👁</button><button class="btn-icon danger" onclick="deleteSale(${s.id})">✕</button></div></td></tr>`).join(''); }
addSearch('salesSearch',renderSales,()=>salesData);
document.getElementById('refreshSales').addEventListener('click',loadSales);
document.getElementById('openSaleModal').addEventListener('click',()=>{ document.getElementById('saleForm').reset(); document.getElementById('saleItems').innerHTML=''; addSaleItemRow(); openModal('saleModal'); });
document.getElementById('openTransactionModal').addEventListener('click',()=>{ document.getElementById('transactionForm').reset(); openModal('transactionModal'); });
document.getElementById('addSaleItem').addEventListener('click',addSaleItemRow);
function addSaleItemRow(){ const c=document.getElementById('saleItems'); const r=document.createElement('div'); r.className='item-row'; r.innerHTML=`<div class="item-row-fields"><label>Товар ID<input name="productId" type="number" min="1" required placeholder="1"></label><label>Поставщик ID<input name="supplierId" type="number" min="1" required placeholder="1"></label><label>Кол-во<input name="quantity" type="number" min="1" value="1" required></label><label>Цена<input name="unitPrice" type="number" min="0" step="0.01" required placeholder="0.00"></label><label>Себест.<input name="unitCost" type="number" min="0" step="0.01" required placeholder="0.00"></label></div><button type="button" class="btn-icon danger remove-row">✕</button>`; r.querySelector('.remove-row').addEventListener('click',()=>r.remove()); c.appendChild(r); }
document.getElementById('saleForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; try{ await api('/sales',{method:'POST',body:JSON.stringify({customerId:Number(f.customerId.value),cashRegisterId:Number(f.cashRegisterId.value),paymentMethod:f.paymentMethod.value,items:collectItemRows('saleItems',['productId','supplierId','quantity','unitPrice','unitCost'])})}); showToast('Продажа создана'); closeModal('saleModal'); loadSales(); }catch(err){showToast(err.message,'error');} });
document.getElementById('transactionForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; const sid=Number(f.saleId.value); try{ await api(`/sales/${sid}/transactions`,{method:'POST',body:JSON.stringify({cashRegisterId:Number(f.cashRegisterId.value),amount:Number(f.amount.value),type:f.type.value,note:f.note.value.trim()||null})}); showToast('Транзакция добавлена'); closeModal('transactionModal'); loadSales(); }catch(err){showToast(err.message,'error');} });
async function viewSale(id){ try{ const s=await api(`/sales/${id}`); const txns=await api(`/sales/${id}/transactions`).catch(()=>[]); document.getElementById('saleDetailTitle').textContent=`Продажа #${id}`; document.getElementById('saleDetailBody').innerHTML=`<div class="detail-grid"><div class="detail-item"><span>ID</span><strong>${s.id}</strong></div><div class="detail-item"><span>Покупатель</span><strong>${s.customerId??'—'}</strong></div><div class="detail-item"><span>Касса</span><strong>${s.cashRegisterId??'—'}</strong></div><div class="detail-item"><span>Оплата</span><strong>${esc(s.paymentMethod||'—')}</strong></div><div class="detail-item"><span>Сумма</span><strong>${fmtMoney(s.totalAmount)}</strong></div><div class="detail-item"><span>Дата</span><strong>${fmtDate(s.createdAt)}</strong></div></div><h4>Позиции</h4><table class="data-table"><thead><tr><th>Товар</th><th>Поставщик</th><th>Кол-во</th><th>Цена</th><th>Себест.</th></tr></thead><tbody>${(s.items||[]).map(i=>`<tr><td>${i.productId}</td><td>${i.supplierId}</td><td>${i.quantity}</td><td>${fmtMoney(i.unitPrice)}</td><td>${fmtMoney(i.unitCost)}</td></tr>`).join('')||'<tr><td colspan="5" class="empty-row">Нет позиций</td></tr>'}</tbody></table><h4>Транзакции</h4><table class="data-table"><thead><tr><th>ID</th><th>Касса</th><th>Сумма</th><th>Тип</th><th>Комментарий</th></tr></thead><tbody>${(Array.isArray(txns)?txns:[]).map(t=>`<tr><td>${t.id}</td><td>${t.cashRegisterId}</td><td>${fmtMoney(t.amount)}</td><td>${t.type}</td><td>${esc(t.note||'—')}</td></tr>`).join('')||'<tr><td colspan="5" class="empty-row">Нет транзакций</td></tr>'}</tbody></table>`; openModal('saleDetailModal'); }catch(err){showToast(err.message,'error');} }
async function deleteSale(id){ if(!confirm('Удалить продажу?'))return; try{await api(`/sales/${id}`,{method:'DELETE'}); showToast('Продажа удалена'); loadSales();}catch(err){showToast(err.message,'error');} }

// ── ORDERS ───────────────────────────────────────────────────
let ordersData=[];
async function loadOrders(){ const b=document.getElementById('ordersTbody'); loading(b,8); try{ ordersData=await api('/orders')||[]; renderOrders(ordersData); }catch(e){empty(b,8,`Ошибка: ${e.message}`);} }
function renderOrders(list){ const b=document.getElementById('ordersTbody'); if(!list.length){empty(b,8);return;} b.innerHTML=list.map(o=>`<tr><td><span class="id-badge">${o.id}</span></td><td>${o.supplierId??'—'}</td><td>${o.managerId??'—'}</td><td><span class="badge ${orderStatusClass(o.status)}">${orderStatusLabel(o.status)}</span></td><td><strong>${fmtMoney(o.totalAmount)}</strong></td><td>${o.items?o.items.length:'—'}</td><td class="muted-cell">${fmtDate(o.createdAt)}</td><td><div class="row-actions"><button class="btn-icon" onclick="viewOrder(${o.id})">👁</button><button class="btn-icon danger" onclick="deleteOrder(${o.id})">✕</button></div></td></tr>`).join(''); }
addSearch('ordersSearch',renderOrders,()=>ordersData);
document.getElementById('refreshOrders').addEventListener('click',loadOrders);
document.getElementById('openOrderModal').addEventListener('click',()=>{ document.getElementById('orderForm').reset(); document.getElementById('orderItems').innerHTML=''; addOrderItemRow(); openModal('orderModal'); });
document.getElementById('addOrderItem').addEventListener('click',addOrderItemRow);
function addOrderItemRow(){ const c=document.getElementById('orderItems'); const r=document.createElement('div'); r.className='item-row'; r.innerHTML=`<div class="item-row-fields"><label>Товар ID<input name="productId" type="number" min="1" required placeholder="1"></label><label>Кол-во<input name="quantity" type="number" min="1" value="1" required></label><label>Цена<input name="unitPrice" type="number" min="0" step="0.01" required placeholder="0.00"></label></div><button type="button" class="btn-icon danger remove-row">✕</button>`; r.querySelector('.remove-row').addEventListener('click',()=>r.remove()); c.appendChild(r); }
document.getElementById('orderForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; try{ await api('/orders',{method:'POST',body:JSON.stringify({supplierId:Number(f.supplierId.value),managerId:Number(f.managerId.value),items:collectItemRows('orderItems',['productId','quantity','unitPrice'])})}); showToast('Заказ создан'); closeModal('orderModal'); loadOrders(); }catch(err){showToast(err.message,'error');} });
async function viewOrder(id){ try{ const o=await api(`/orders/${id}`); document.getElementById('orderDetailTitle').textContent=`Заказ #${id}`; document.getElementById('orderDetailBody').innerHTML=`<div class="detail-grid"><div class="detail-item"><span>ID</span><strong>${o.id}</strong></div><div class="detail-item"><span>Поставщик</span><strong>${o.supplierId??'—'}</strong></div><div class="detail-item"><span>Менеджер</span><strong>${o.managerId??'—'}</strong></div><div class="detail-item"><span>Статус</span><span class="badge ${orderStatusClass(o.status)}">${orderStatusLabel(o.status)}</span></div><div class="detail-item"><span>Сумма</span><strong>${fmtMoney(o.totalAmount)}</strong></div><div class="detail-item"><span>Создан</span><strong>${fmtDate(o.createdAt)}</strong></div></div><h4>Позиции</h4><table class="data-table"><thead><tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead><tbody>${(o.items||[]).map(i=>`<tr><td>${i.productId}</td><td>${i.quantity}</td><td>${fmtMoney(i.unitPrice)}</td><td>${fmtMoney((i.quantity||0)*(i.unitPrice||0))}</td></tr>`).join('')||'<tr><td colspan="4" class="empty-row">Нет позиций</td></tr>'}</tbody></table>`; openModal('orderDetailModal'); }catch(err){showToast(err.message,'error');} }
async function deleteOrder(id){ if(!confirm('Удалить заказ?'))return; try{await api(`/orders/${id}`,{method:'DELETE'}); showToast('Заказ удалён'); loadOrders();}catch(err){showToast(err.message,'error');} }

// ── PROMOTIONS ───────────────────────────────────────────────
let promotionsData=[];
async function loadPromotions(){ const b=document.getElementById('promotionsTbody'); loading(b,8); try{ promotionsData=await api('/promotions')||[]; renderPromotions(promotionsData); }catch(e){empty(b,8,`Ошибка: ${e.message}`);} }
function renderPromotions(list){ const b=document.getElementById('promotionsTbody'); if(!list.length){empty(b,8);return;} b.innerHTML=list.map(p=>`<tr><td><span class="id-badge">${p.id}</span></td><td><strong>${esc(p.name)}</strong></td><td>${promoTypeLabel(p.promotionType)}</td><td><span class="discount-badge">${p.discountPercent??'—'}%</span></td><td>${p.productId??'—'}</td><td class="muted-cell">${fmtDate(p.startAt)}</td><td class="muted-cell">${fmtDate(p.endAt)}</td><td><div class="row-actions"><button class="btn-icon danger" onclick="deletePromotion(${p.id})">✕</button></div></td></tr>`).join(''); }
addSearch('promotionsSearch',renderPromotions,()=>promotionsData);
document.getElementById('refreshPromotions').addEventListener('click',loadPromotions);
function openPromoModal(type){ const f=document.getElementById('promotionForm'); f.reset(); document.getElementById('promoTypeHidden').value=type; const labels={generic:'Новая акция','happy-hour':'Happy Hour','product-of-day':'Товар дня'}; document.getElementById('promotionModalTitle').textContent=labels[type]||'Новая акция'; const s=f.querySelector('[name=promotionType]'); s.value=type==='happy-hour'?'1':type==='product-of-day'?'2':'0'; openModal('promotionModal'); }
document.getElementById('openPromotionModal').addEventListener('click',()=>openPromoModal('generic'));
document.getElementById('openHappyHourModal').addEventListener('click',()=>openPromoModal('happy-hour'));
document.getElementById('openProductOfDayModal').addEventListener('click',()=>openPromoModal('product-of-day'));
document.getElementById('promotionForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; const pt=document.getElementById('promoTypeHidden').value; const dto={name:f.name.value.trim(),promotionType:Number(f.promotionType.value),productId:Number(f.productId.value),discountPercent:Number(f.discountPercent.value),startAt:f.startAt.value?new Date(f.startAt.value).toISOString():null,endAt:f.endAt.value?new Date(f.endAt.value).toISOString():null}; const ep=pt==='happy-hour'?'/promotions/happy-hour':pt==='product-of-day'?'/promotions/product-of-day':'/promotions'; try{ await api(ep,{method:'POST',body:JSON.stringify(dto)}); showToast('Акция создана'); closeModal('promotionModal'); loadPromotions(); }catch(err){showToast(err.message,'error');} });
async function deletePromotion(id){ if(!confirm('Удалить акцию?'))return; try{await api(`/promotions/${id}`,{method:'DELETE'}); showToast('Акция удалена'); loadPromotions();}catch(err){showToast(err.message,'error');} }

// ── CASH ─────────────────────────────────────────────────────
let cashData=[];
async function loadCash(){ const b=document.getElementById('cashTbody'); loading(b,4); try{ cashData=await api('/cash-registers')||[]; renderCash(cashData); }catch(e){empty(b,4,`Ошибка: ${e.message}`);} }
function renderCash(list){ const b=document.getElementById('cashTbody'); if(!list.length){empty(b,4);return;} b.innerHTML=list.map(c=>`<tr><td><span class="id-badge">${c.id}</span></td><td><strong>${esc(c.name)}</strong></td><td>${esc(c.location)}</td><td><div class="row-actions"><button class="btn-icon" onclick="editCash(${c.id})">✏</button><button class="btn-icon danger" onclick="deleteCash(${c.id})">✕</button></div></td></tr>`).join(''); }
addSearch('cashSearch',renderCash,()=>cashData);
document.getElementById('refreshCash').addEventListener('click',loadCash);
document.getElementById('openCashModal').addEventListener('click',()=>{ document.getElementById('cashModalTitle').textContent='Новая касса'; document.getElementById('cashForm').reset(); document.getElementById('cashId').value=''; openModal('cashModal'); });
document.getElementById('cashForm').addEventListener('submit',async e=>{ e.preventDefault(); const f=e.target; const id=f.id.value; const dto={name:f.name.value.trim(),location:f.location.value.trim()}; try{ if(id){await api(`/cash-registers/${id}`,{method:'PUT',body:JSON.stringify({id:Number(id),...dto})}); showToast('Касса обновлена');}else{await api('/cash-registers',{method:'POST',body:JSON.stringify(dto)}); showToast('Касса создана');} closeModal('cashModal'); loadCash(); }catch(err){showToast(err.message,'error');} });
async function editCash(id){ const c=cashData.find(x=>x.id===id); if(!c)return; const f=document.getElementById('cashForm'); document.getElementById('cashModalTitle').textContent='Редактировать кассу'; f.id.value=c.id; f.name.value=c.name; f.location.value=c.location; openModal('cashModal'); }
async function deleteCash(id){ if(!confirm('Удалить кассу?'))return; try{await api(`/cash-registers/${id}`,{method:'DELETE'}); showToast('Касса удалена'); loadCash();}catch(err){showToast(err.message,'error');} }

// ── INIT ─────────────────────────────────────────────────────
function initApp() {
    fetch(`${getBase()}/products`).then(()=>setConnectionStatus(true)).catch(()=>setConnectionStatus(false));
    loadDashboard();
}

if (isLoggedIn()) {
    showApp();
} else {
    showLogin();
}
