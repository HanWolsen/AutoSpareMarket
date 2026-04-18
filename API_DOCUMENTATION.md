# AutoSpareMarket — API Documentation

Base URL: `/api/v1`

All endpoints return a JSON envelope:
```json
{ "isSuccess": true, "data": <payload>, "message": "..." }
```

Authentication uses JWT Bearer tokens. Protected endpoints require the header:
```
Authorization: Bearer <accessToken>
```

---

## Authentication — `/api/v1/user`

### POST `/api/v1/user/login`
Authenticate and obtain JWT tokens.

**Auth required:** No

**Request body:**
```json
{ "userName": "admin", "password": "secret" }
```

**Response:**
```json
{
  "isSuccess": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "abc123..."
  }
}
```

---

### POST `/api/v1/user/register`
Register a new user. Only accessible by authenticated admins.

**Auth required:** Yes

**Request body:**
```json
{
  "userName": "manager1",
  "email": "manager@shop.ru",
  "password": "Pa$$w0rd",
  "role": "Manager"
}
```

---

### POST `/api/v1/user/update-token`
Refresh the access token using a refresh token.

**Auth required:** Yes

**Request body:**
```json
{ "accessToken": "eyJ...", "refreshToken": "abc123..." }
```

---

### POST `/api/v1/user/revork-refresh-token`
Revoke a specific user's refresh token.

**Auth required:** Yes

**Query param:** `username=<string>`

---

### POST `/api/v1/user/revork-all-refresh-token`
Revoke all active refresh tokens.

**Auth required:** Yes

---

### GET `/api/v1/user`
Get all users.

**Auth required:** Yes

---

### GET `/api/v1/user/{id}`
Get user by ID.

**Auth required:** Yes

---

### PUT `/api/v1/user/{id}`
Update user.

**Auth required:** Yes

**Request body:** `UserDto`

---

### DELETE `/api/v1/user/{id}`
Delete user.

**Auth required:** Yes

---

### GET `/api/v1/user/get-admins-email`
Returns the admin's email address.

**Auth required:** Yes

---

### POST `/api/v1/user/update-email`
Update admin email.

**Auth required:** Yes

**Request body:** `"new@email.ru"` (plain string)

---

### POST `/api/v1/user/update-phone-number`
Update admin phone number.

**Auth required:** Yes

**Request body:** `"+79001234567"` (plain string)

---

### POST `/api/v1/user/update-user-name`
Update admin username.

**Auth required:** Yes

**Request body:** `"newusername"` (plain string)

---

## Products — `/api/v1/products`

### GET `/api/v1/products`
Get all products.

**Auth required:** Yes

**Response data:** Array of `ProductDto`
```json
[
  {
    "id": 1,
    "name": "Тормозные колодки",
    "description": "Передние тормозные колодки для BMW",
    "warehouseCellId": 3,
    "dateAdd": "2025-01-15T10:30:00Z"
  }
]
```

---

### GET `/api/v1/products/{id}`
Get product by ID.

**Auth required:** Yes

---

### POST `/api/v1/products`
Create a new product.

**Auth required:** Yes

**Request body:**
```json
{
  "name": "Тормозные колодки",
  "description": "Передние тормозные колодки для BMW",
  "warehouseCellId": 3
}
```

---

### PUT `/api/v1/products/{id}`
Update a product.

**Auth required:** Yes

**Request body:** `ProductUpdateDto`

---

### DELETE `/api/v1/products/{id}`
Delete a product.

**Auth required:** Yes

---

### POST `/api/v1/products/{id}/create-warehousecell`
Create and assign a warehouse cell to a product.

**Auth required:** Yes

**Request body:** `WarehouseCellCreateDto`

---

### GET `/api/v1/products/{id}/supplier-details`
Get supplier details for a specific product.

**Auth required:** Yes

---

## Suppliers — `/api/v1/suppliers`

### GET `/api/v1/suppliers`
Get all suppliers.

**Auth required:** Yes

**Response data:** Array of `SupplierDto`
```json
[
  {
    "id": 1,
    "name": "АвтоДеталь ООО",
    "contactInfo": "Иванов Сергей",
    "email": "supplier@example.ru",
    "phone": "+79001234567"
  }
]
```

---

### GET `/api/v1/suppliers/{id}`
Get supplier by ID.

**Auth required:** Yes

---

### POST `/api/v1/suppliers`
Create a new supplier.

**Auth required:** Yes

**Request body:**
```json
{
  "name": "АвтоДеталь ООО",
  "contactInfo": "Иванов Сергей",
  "email": "supplier@example.ru",
  "phone": "+79001234567"
}
```

---

### PUT `/api/v1/suppliers/{id}`
Update supplier.

**Auth required:** Yes

---

### DELETE `/api/v1/suppliers/{id}`
Delete supplier.

**Auth required:** Yes

---

### POST `/api/v1/suppliers/{supplierId}/assign-product/{productId}`
Assign a product to a supplier.

**Auth required:** Yes

---

### GET `/api/v1/suppliers/by-product/{productId}`
Get suppliers for a specific product.

**Auth required:** Yes

---

## Customers — `/api/v1/customers`

### GET `/api/v1/customers`
Get all customers.

**Auth required:** Yes

---

### GET `/api/v1/customers/{id}`
Get customer by ID.

**Auth required:** Yes

---

### POST `/api/v1/customers`
Create a new customer (used during checkout).

**Auth required:** No (public)

**Request body:**
```json
{
  "firstName": "Иван",
  "lastName": "Петров",
  "email": "ivan@mail.ru",
  "phone": "+79001234567"
}
```

**Response data:**
```json
{ "id": 42, "firstName": "Иван", "lastName": "Петров", "email": "ivan@mail.ru" }
```

---

### PUT `/api/v1/customers/{id}`
Update customer.

**Auth required:** Yes

---

### DELETE `/api/v1/customers/{id}`
Delete customer.

**Auth required:** Yes

---

### GET `/api/v1/customers/by-product/{productId}`
Get customers who purchased a specific product.

**Auth required:** Yes

---

## Sales — `/api/v1/sales`

### GET `/api/v1/sales`
Get all sales.

**Auth required:** Yes

---

### GET `/api/v1/sales/{id}`
Get sale by ID.

**Auth required:** Yes

---

### POST `/api/v1/sales`
Create a new sale (used for order checkout from storefront).

**Auth required:** Yes (or public depending on policy)

**Request body:**
```json
{
  "customerId": 42,
  "cashRegisterId": 1,
  "paymentMethod": "Card",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 5, "quantity": 1 }
  ]
}
```

---

### PUT `/api/v1/sales/{id}`
Update a sale.

**Auth required:** Yes

---

### DELETE `/api/v1/sales/{id}`
Delete a sale.

**Auth required:** Yes

---

### POST `/api/v1/sales/{id}/add-items`
Add items to an existing sale.

**Auth required:** Yes

**Request body:** Array of `SaleItemCreateDto`

---

### GET `/api/v1/sales/{id}/transactions`
Get transactions for a sale.

**Auth required:** Yes

---

## Orders — `/api/v1/orders`

Orders represent purchase orders from suppliers (inventory restocking), distinct from customer sales.

### GET `/api/v1/orders`
Get all orders.

**Auth required:** Yes

---

### GET `/api/v1/orders/{id}`
Get order by ID.

**Auth required:** Yes

---

### POST `/api/v1/orders`
Create a new supplier order.

**Auth required:** Yes

**Request body:**
```json
{
  "supplierId": 1,
  "managerId": 1,
  "items": [
    { "productId": 3, "quantity": 10 }
  ]
}
```

---

### PUT `/api/v1/orders/{id}`
Update an order.

**Auth required:** Yes

---

### DELETE `/api/v1/orders/{id}`
Delete an order.

**Auth required:** Yes

---

### PATCH `/api/v1/orders/{id}/status`
Update order status.

**Auth required:** Yes

**Request body:** `"Completed"` (plain string — OrderStatus enum value)

Possible values: `Pending`, `Processing`, `Completed`, `Cancelled`

---

### POST `/api/v1/orders/{id}/receive-items`
Mark order items as received (updates inventory).

**Auth required:** Yes

---

## Promotions — `/api/v1/promotions`

### GET `/api/v1/promotions`
Get all active promotions.

**Auth required:** Yes

**Response data:** Array of `PromotionDto`
```json
[
  {
    "id": 1,
    "name": "Летняя акция",
    "description": "Скидки на летние шины",
    "discountPercent": 15,
    "promotionType": "Seasonal",
    "startDate": "2025-06-01T00:00:00Z",
    "endDate": "2025-08-31T23:59:59Z"
  }
]
```

---

### GET `/api/v1/promotions/{id}`
Get promotion by ID.

**Auth required:** Yes

---

### POST `/api/v1/promotions`
Create a promotion.

**Auth required:** Yes

**Request body:**
```json
{
  "name": "Летняя акция",
  "description": "Скидки на летние шины",
  "discountPercent": 15,
  "promotionType": "Seasonal",
  "startDate": "2025-06-01T00:00:00Z",
  "endDate": "2025-08-31T23:59:59Z"
}
```

---

### PUT `/api/v1/promotions/{id}`
Update a promotion.

**Auth required:** Yes

---

### DELETE `/api/v1/promotions/{id}`
Delete a promotion.

**Auth required:** Yes

---

### GET `/api/v1/promotions/happy-hour`
Get current happy-hour promotions.

**Auth required:** Yes

---

### GET `/api/v1/promotions/product-of-day`
Get the product of the day promotion.

**Auth required:** Yes

---

## Cash Registers — `/api/v1/cash-registers`

### GET `/api/v1/cash-registers`
Get all cash registers.

**Auth required:** Yes

---

### GET `/api/v1/cash-registers/{id}`
Get cash register by ID.

**Auth required:** Yes

---

### POST `/api/v1/cash-registers`
Create a cash register.

**Auth required:** Yes

**Request body:**
```json
{ "name": "Касса №1", "location": "Главный зал" }
```

---

### PUT `/api/v1/cash-registers/{id}`
Update cash register.

**Auth required:** Yes

---

### DELETE `/api/v1/cash-registers/{id}`
Delete cash register.

**Auth required:** Yes

---

### GET `/api/v1/cash-registers/{id}/report`
Get cash register sales report.

**Auth required:** Yes

---

## Analytics — `/api/v1/analytics`

All analytics endpoints require authentication.

### GET `/api/v1/analytics/sales-ranking`
Top selling products ranked by sales volume.

**Response data:** Array of `SalesRankingItemDto`

---

### GET `/api/v1/analytics/supplier-rating`
Supplier performance rating.

**Response data:** Array of `SupplierRatingItemDto`

---

### GET `/api/v1/analytics/supplier-share`
Market share breakdown by supplier.

**Response data:** Array of `SupplierShareDto`

---

## Support Requests — Edge Function

### POST `<SUPABASE_URL>/functions/v1/support-email`

Public endpoint for customer support form submissions. Stores the request in the database and optionally sends an email notification to the admin.

**Auth required:** No

**Request body:**
```json
{
  "category": "product",
  "subject": "Вопрос по тормозным колодкам",
  "message": "Подскажите, подойдут ли эти колодки для BMW E46?",
  "email": "customer@mail.ru"
}
```

**Response:**
```json
{ "success": true, "message": "Support request received" }
```

**Category values:** `order`, `product`, `delivery`, `other`

---

## Error Responses

| HTTP Status | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request — invalid input |
| 401 | Unauthorized — missing or invalid JWT |
| 404 | Not Found |
| 500 | Internal Server Error |

Error body example:
```json
{ "isSuccess": false, "message": "Invalid credentials" }
```

---

## Frontend Integration Notes

- The storefront (`index.html`) calls `GET /api/v1/products` and `GET /api/v1/promotions` to render the catalog.
- Product detail page (`product.html`) calls `GET /api/v1/products/{id}` and `GET /api/v1/suppliers/by-product/{id}`.
- Checkout flow (`cart.html`) calls `POST /api/v1/customers` then `POST /api/v1/sales`.
- Admin panel (`admin.html`) requires a valid JWT obtained via `POST /api/v1/user/login`.
- Cart state is persisted in `localStorage` under the key `asm_cart`.
- Admin token is stored in `localStorage` under the key `asm_admin_token`.
