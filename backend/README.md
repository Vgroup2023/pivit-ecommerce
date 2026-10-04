# PIVIT Fishing E-Commerce Backend API

Node.js + Express + TypeScript backend for the PIVIT Fishing e-commerce platform.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

#### Using Supabase (Recommended for MVP):
1. Create a Supabase project at https://supabase.com
2. Run the migration SQL in `src/migrations/001_init.sql`
3. Update `DATABASE_URL` in `.env`

#### Local PostgreSQL:
```bash
createdb pivit_ecommerce
psql pivit_ecommerce < src/migrations/001_init.sql
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products?tenantId=xxx` - List all products
- `GET /api/products/:id?tenantId=xxx` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id?tenantId=xxx` - Update product (admin only)

### Orders
- `GET /api/orders?tenantId=xxx` - List all orders (admin only)
- `GET /api/orders/:id?tenantId=xxx` - Get order by ID
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status?tenantId=xxx` - Update order status (admin only)

### Health
- `GET /api/health` - Health check

## Architecture

- **Database**: PostgreSQL with multi-tenant support
- **Authentication**: Session-based with bcrypt password hashing
- **Authorization**: Role-based access control (admin, fulfillment, finance, viewer)
- **Payments**: Stripe integration
- **ERP Sync**: Real-time synchronization with GloblexAI Office ERP Copilot

## Key Features

✓ Multi-tenant SaaS architecture
✓ Secure session-based authentication
✓ Role-based access control
✓ Order management system
✓ Inventory management
✓ Payment processing (Stripe)
✓ ERP integration framework
✓ TypeScript for type safety
✓ Express middleware stack

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Production Start
```bash
npm start
```

## Database Schema

### Core Tables
- `tenants` - Multi-tenant workspace
- `users` - User accounts
- `admin_users` - Admin role assignments per tenant
- `products` - Product catalog
- `customers` - Customer records
- `orders` - Order records
- `order_items` - Order line items
- `payments` - Payment transactions
- `erp_sync_logs` - ERP sync audit trail

See `src/migrations/001_init.sql` for full schema details.
