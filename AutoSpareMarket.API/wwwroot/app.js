const apiBaseInput = document.getElementById("apiBase");
const connectionStatus = document.getElementById("connectionStatus");

const outputs = {
    products: document.getElementById("productsOutput"),
    suppliers: document.getElementById("suppliersOutput"),
    orders: document.getElementById("ordersOutput"),
    sales: document.getElementById("salesOutput"),
};

const defaultBase = `${window.location.origin}/api/v1`;

apiBaseInput.value = localStorage.getItem("apiBase") || defaultBase;
setStatus(`Текущий адрес API: ${apiBaseInput.value}`);

document.getElementById("saveApiBase").addEventListener("click", () => {
    const value = apiBaseInput.value.trim().replace(/\/$/, "");
    if (!value) return;
    localStorage.setItem("apiBase", value);
    setStatus(`Сохранено: ${value}`);
});

document.getElementById("pingApi").addEventListener("click", () => {
    handleAction(() => api("/products"), outputs.products, "Подключение успешно. Текущие товары:");
});

document.getElementById("loadProducts").addEventListener("click", () => {
    handleAction(() => api("/products"), outputs.products, "Товары загружены:");
});

document.getElementById("loadSuppliers").addEventListener("click", () => {
    handleAction(() => api("/suppliers"), outputs.suppliers, "Поставщики загружены:");
});

document.getElementById("loadOrders").addEventListener("click", () => {
    handleAction(() => api("/orders"), outputs.orders, "Заказы загружены:");
});

document.getElementById("loadSales").addEventListener("click", () => {
    handleAction(() => api("/sales"), outputs.sales, "Продажи загружены:");
});

document.getElementById("loadCashRegisters").addEventListener("click", () => {
    handleAction(() => api("/cash-registers"), outputs.sales, "Кассы загружены:");
});

document.getElementById("warehouseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const dto = {
        cellNumber: form.cellNumber.value.trim(),
        quantity: Number(form.quantity.value || 0),
    };
    handleAction(() => api("/products/create-warehousecell", {
        method: "POST",
        body: JSON.stringify(dto),
    }), outputs.products, "Ячейка создана:");
});

document.getElementById("productForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const dto = {
        warehouseCellId: Number(form.warehouseCellId.value),
        name: form.name.value.trim(),
        description: form.description.value.trim(),
    };
    handleAction(() => api("/products", {
        method: "POST",
        body: JSON.stringify(dto),
    }), outputs.products, "Товар создан:");
});

document.getElementById("supplierForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const dto = {
        name: form.name.value.trim(),
        country: form.country.value.trim(),
        isActive: form.isActive.checked,
        countryInfo: form.countryInfo.value.trim(),
    };
    handleAction(() => api("/suppliers", {
        method: "POST",
        body: JSON.stringify(dto),
    }), outputs.suppliers, "Поставщик создан:");
});

document.getElementById("supplierProductForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const supplierId = Number(form.supplierId.value);
    const productId = Number(form.productId.value);
    const isActive = form.isActive.checked;

    handleAction(() => api("/suppliers/assign-product", {
        method: "POST",
        body: JSON.stringify({
            id: supplierId,
            productId,
            name: "",
            country: "",
            isActive,
            countryInfo: "",
        }),
    }), outputs.suppliers, "Товар привязан к поставщику:");
});

const orderItems = document.getElementById("orderItems");
document.getElementById("addOrderItem").addEventListener("click", () => addOrderItemRow());
addOrderItemRow();

document.getElementById("orderForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const dto = {
        supplierId: Number(form.supplierId.value),
        managerId: Number(form.managerId.value),
        items: collectItems(orderItems, ["productId", "quantity", "unitPrice"], "productId"),
    };
    handleAction(() => api("/orders", {
        method: "POST",
        body: JSON.stringify(dto),
    }), outputs.orders, "Заказ создан:");
});

const saleItems = document.getElementById("saleItems");
document.getElementById("addSaleItem").addEventListener("click", () => addSaleItemRow());
addSaleItemRow();

document.getElementById("saleForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const dto = {
        customerId: Number(form.customerId.value),
        cashRegisterId: Number(form.cashRegisterId.value),
        paymentMethod: form.paymentMethod.value.trim(),
        items: collectItems(saleItems, ["productId", "supplierId", "quantity", "unitPrice", "unitCost"], "productId"),
    };
    handleAction(() => api("/sales", {
        method: "POST",
        body: JSON.stringify(dto),
    }), outputs.sales, "Продажа создана:");
});

document.getElementById("transactionForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const saleId = Number(form.saleId.value);
    const dto = {
        cashRegisterId: Number(form.cashRegisterId.value),
        amount: Number(form.amount.value),
        type: form.type.value,
        note: form.note.value.trim(),
    };
    handleAction(() => api(`/sales/${saleId}/transactions`, {
        method: "POST",
        body: JSON.stringify(dto),
    }), outputs.sales, "Транзакция добавлена:");
});

function api(path, options = {}) {
    const base = (apiBaseInput.value || defaultBase).replace(/\/$/, "");
    const headers = Object.assign({ "Content-Type": "application/json" }, options.headers || {});

    return fetch(`${base}${path}`, { ...options, headers })
        .then(async (res) => {
            const text = await res.text();
            let data;
            try { data = text ? JSON.parse(text) : text; } catch { data = text || null; }
            if (!res.ok) {
                const message = data && data.message ? data.message : res.statusText;
                throw new Error(`${res.status}: ${message}`);
            }
            return unwrapResponse(data) ?? "Готово";
        });
}

function handleAction(action, outputEl, successLabel) {
    outputEl.textContent = "Выполняется запрос...";
    action()
        .then((data) => {
            const text = successLabel ? `${successLabel}\n` : "";
            outputEl.textContent = text + format(data);
        })
        .catch((err) => {
            outputEl.textContent = `Ошибка: ${err.message || err}`;
        });
}

function format(data) {
    if (data === null || data === undefined) return "Нет данных";
    if (typeof data === "string") return data;
    return JSON.stringify(data, null, 2);
}

function setStatus(text) {
    connectionStatus.textContent = text;
}

function addOrderItemRow() {
    const row = document.createElement("div");
    row.className = "stack tight card";
    row.innerHTML = `
        <label>ProductId <input name="productId" type="number" min="1" required></label>
        <label>Количество <input name="quantity" type="number" min="1" value="1" required></label>
        <label>Цена за единицу <input name="unitPrice" type="number" min="0" step="0.01" required></label>
    `;
    orderItems.appendChild(row);
}

function addSaleItemRow() {
    const row = document.createElement("div");
    row.className = "stack tight card";
    row.innerHTML = `
        <label>ProductId <input name="productId" type="number" min="1" required></label>
        <label>SupplierId <input name="supplierId" type="number" min="1" required></label>
        <label>Количество <input name="quantity" type="number" min="1" value="1" required></label>
        <label>Цена продажи <input name="unitPrice" type="number" min="0" step="0.01" required></label>
        <label>Себестоимость <input name="unitCost" type="number" min="0" step="0.01" required></label>
    `;
    saleItems.appendChild(row);
}

function collectItems(container, fields, requiredField = fields[0]) {
    return Array.from(container.children)
        .map((row) => {
            const entry = {};
            fields.forEach((field) => {
                const input = row.querySelector(`[name='${field}']`);
                const raw = input ? input.value.trim() : "";
                if (raw === "") {
                    entry[field] = null;
                } else {
                    const numeric = Number(raw);
                    entry[field] = Number.isFinite(numeric) ? numeric : raw;
                }
            });
            return entry;
        })
        .filter((item) => item[requiredField] !== null && item[requiredField] !== "");
}

function unwrapResponse(payload) {
    if (payload && typeof payload === "object" && payload.hasOwnProperty && payload.hasOwnProperty("data")) {
        return payload.data;
    }
    return payload;
}
