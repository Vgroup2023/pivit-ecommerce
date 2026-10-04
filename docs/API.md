# PIVIT Fishing E-Commerce API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All endpoints (except `/auth/*` and `/health`) require an active session. Sessions are managed via HTTP-only cookies.

### Session Cookie
The server sets a session cookie on successful login:
```
Set-Cookie: connect.sid=<session_id>; HttpOnly; Secure; SameSite=Strict
```

## Endpoints

### Health Check
```
GET /health
```

Returns server and database status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "checks": {
    "database": "ok",
    "api": "ok"
  }
}
```

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "tenantId": "optional-tenant-uuid"
}
```

#### Logout
```
POST /auth/logout
```

#### Get Current User
```
GET /auth/me
```

### Products

#### List Products
```
GET /products?tenantId=<tenant-id>&limit=50&offset=0
```

**Response:**
```json
{
  "products": [
    {
      "id": "uuid",
      "tenant_id": "uuid",
      "name": "Fishing Rod",
      "description": "High-quality fishing rod",
      "price": 129.99,
      "cost": 50.00,
      "sku": "ROD-001",
      "stock_quantity": 10,
      "images": ["url1", "url2"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "limit": 50,
  "offset": 0
}
```

#### Get Product by ID
```
GET /products/:id?tenantId=<tenant-id>
```

#### Create Product (Admin Only)
```
POST /products
Content-Type: application/json
Authorization: Session (Admin role)

{
  "tenantId": "uuid",
  "name": "Fishing Rod",
  "price": 129.99,
  "description": "Optional description",
  "sku": "ROD-001",
  "cost": 50.00,
  "stockQuantity": 10,
  "images": ["url1", "url2"]
}
```

#### Update Product (Admin Only)
```
PUT /products/:id?tenantId=<tenant-id>
Content-Type: application/json
Authorization: Session (Admin role)

{
  "name": "Updated name",
  "price": 149.99,
  "stock_quantity": 15
}
```

### Orders

#### List Orders (Admin Only)
```
GET /orders?tenantId=<tenant-id>&limit=50&offset=0
Authorization: Session (Admin role)
```

#### Get Order by ID
```
GET /orders/:id?tenantId=<tenant-id>
```

#### Create Order
```
POST /orders
Content-Type: application/json

{
  "tenantId": "uuid",
  "customerId": "optional-customer-uuid",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 2,
      "unit_price": 129.99,
      "total_price": 259.98
    }
  ],
  "subtotal": 259.98,
  "tax": 25.99,
  "shipping": 10.00,
  "total": 295.97,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "postal_code": "62701",
    "country": "US"
  },
  "billingAddress": { ... }
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "order_number": "ORD-1704110400000",
    "status": "pending",
    "total": 295.97,
    "created_at": "2024-01-01T12:00:00Z"
  },
  "orderNumber": "ORD-1704110400000"
}
```

#### Update Order Status (Admin Only)
```
PATCH /orders/:id/status?tenantId=<tenant-id>
Content-Type: application/json
Authorization: Session (Admin role)

{
  "status": "shipped",
  "trackingNumber": "TRACK123456"
}
```

**Valid Statuses:**
- `pending` - Initial state
- `paid` - Payment processed
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Completed
- `cancelled` - Cancelled
- `refunded` - Refund processed

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

#### 401 Unauthorized
```json
{
  "error": "Unauthorized - Please log in"
}
```

#### 403 Forbidden
```json
{
  "error": "Forbidden - Admin access required"
}
```

#### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Rate Limiting

No rate limiting implemented in MVP. Will be added for production deployment.

## CORS

Frontend URL must be configured in `FRONTEND_URL` environment variable.

## Pagination

List endpoints support:
- `limit` - Number of results (default: 50, max: 100)
- `offset` - Number of results to skip (default: 0)

## Multi-Tenant

All data-related endpoints require `tenantId` query parameter to ensure data isolation.

## Stripe Integration (Planned)

Payment processing will be added with:
- `POST /payments/create-intent` - Create payment intent
- `POST /webhook/stripe` - Webhook handler for payment events

## ERP Integration Endpoints (Planned)

Real-time synchronization with GloblexAI Office ERP Copilot:
- `POST /erp/sync/orders` - Sync orders to ERP
- `POST /erp/sync/inventory` - Sync inventory to ERP
- `GET /erp/inventory/:tenantId` - Fetch inventory from ERP
