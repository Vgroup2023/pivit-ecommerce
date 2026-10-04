# PIVIT Fishing E-Commerce Platform - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        User Devices                          │
│  (Browser, Mobile App, Tablet, Desktop)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼────────┐
                    │  React PWA    │
                    │  (Frontend)   │
                    └──────┬────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
        ┌──▼──┐     ┌──────▼──────┐  ┌────▼─────┐
        │ API │────▶│  Express    │  │ Service  │
        │Calls│     │  Backend    │  │ Worker   │
        └─────┘     └──────┬──────┘  └──────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
        ┌──▼──┐     ┌──────▼──────┐  ┌────▼─────┐
        │Redis│     │PostgreSQL   │  │   Stripe │
        │Cache│     │  Database   │  │ (Future) │
        └─────┘     └──────┬──────┘  └──────────┘
                           │
                    ┌──────▼────────┐
                    │   GloblexAI   │
                    │  ERP Copilot  │
                    └───────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **PWA**: Service Workers, Web Manifest
- **Deployment**: Static hosting

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase MVP)
- **Cache**: Redis (session + optimization)
- **Payment**: Stripe integration
- **ERP**: Real-time sync with GloblexAI

### Infrastructure
- **Database**: PostgreSQL 14+
- **Cache**: Redis 6+
- **Hosting**: Cloud (AWS, Azure, GCP) or self-hosted
- **CI/CD**: GitHub Actions (planned)

## Multi-Tenant Architecture

### Tenant Isolation
```
┌──────────────────────────────────────┐
│        PIVIT Fishing Store           │
│  ┌────────────────────────────────┐  │
│  │ Products (tenant-scoped)       │  │
│  │ Orders (tenant-scoped)         │  │
│  │ Customers (tenant-scoped)      │  │
│  │ Admin Users (tenant-scoped)    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│       Future Store #2                │
│  ┌────────────────────────────────┐  │
│  │ Products (tenant-scoped)       │  │
│  │ Orders (tenant-scoped)         │  │
│  │ Customers (tenant-scoped)      │  │
│  │ Admin Users (tenant-scoped)    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Data Isolation:**
- All tables have `tenant_id` column
- Queries filtered by `tenant_id`
- Row-level security at database level (future)

## Database Schema

### Core Tables

#### Tenants
Represents different store instances on the platform.

#### Users
Account information for all users (customers + admins).

#### Admin Users
Tenant-specific admin role assignments with granular permissions:
- `admin` - Full control
- `fulfillment` - Order and inventory management
- `finance` - Payment and accounting
- `viewer` - Read-only access

#### Products
Product catalog per tenant with inventory tracking.

#### Customers
Customer records per tenant for order history and preferences.

#### Orders
Order transactions with status tracking and fulfillment info.

#### Order Items
Line items for each order (junction table).

#### Payments
Payment transaction records with Stripe integration.

#### ERP Sync Logs
Audit trail for all ERP synchronization events.

## API Layer Architecture

### Request Flow
```
Client Request
    ↓
CORS Middleware
    ↓
Session/Auth Middleware
    ↓
Route Handler
    ↓
Validation (express-validator)
    ↓
Service Layer
    ↓
Database Query
    ↓
Response/Error Handler
```

### Service Modules

#### Auth Service
- Password hashing (bcrypt)
- Session management
- Admin role assignment

#### Product Service
- CRUD operations
- Inventory management
- Stock updates

#### Order Service
- Order creation
- Status tracking
- Customer order history

#### Stripe Service
- Payment intent creation
- Webhook handling
- Refund processing

#### ERP Service
- Bi-directional sync
- Real-time updates
- Error logging

## Frontend Architecture

### Component Hierarchy
```
App
├── Header
├── Router
│   ├── Home
│   ├── Products
│   │   └── ProductDetail
│   ├── Cart
│   ├── Checkout
│   ├── Auth
│   │   ├── Login
│   │   └── Register
│   └── Admin
│       ├── Dashboard
│       └── Orders
└── Footer
```

### State Management

#### Auth Store (Zustand)
- Current user
- Authentication status
- Role-based access control

#### Cart Store (Zustand + Persistence)
- Shopping cart items
- Cart totals
- Local storage persistence

## PWA Architecture

### Service Worker Strategy
```
┌──────────────────────────────┐
│      Service Worker          │
├──────────────────────────────┤
│ Cache-First Strategy         │
│ └─ Static Assets             │
│                              │
│ Network-First Strategy       │
│ └─ API Calls                 │
│                              │
│ Background Sync              │
│ └─ Pending Orders            │
└──────────────────────────────┘
```

### Caching Layers
1. **Static Assets** - Cache on install, update on background
2. **API Responses** - Network first, fallback to cache
3. **HTML Pages** - Network first, fallback to offline page
4. **Local Storage** - Cart persistence across sessions

## ERP Integration

### Real-Time Sync Flow
```
E-Commerce Event
    ↓
Trigger Sync Worker
    ↓
Format Data for ERP
    ↓
POST to GloblexAI API
    ↓
Log Sync Event
    ↓
Handle Errors/Retry
```

### Sync Types
- **Orders** - New orders, status updates
- **Inventory** - Stock updates
- **Customers** - Customer information
- **Products** - Product catalog

## Security Architecture

### Authentication
- Session-based with HTTP-only cookies
- CSRF protection via SameSite cookies
- Password hashing with bcrypt (10 rounds)

### Authorization
- Role-based access control (RBAC)
- Tenant isolation at request level
- API endpoint protection

### Data Protection
- HTTPS only in production
- Password minimum 8 characters
- Email validation
- Input validation and sanitization

### Deployment Security
- Environment variables for secrets
- Database credentials in .env
- API keys rotated regularly
- Rate limiting (future)

## Performance Optimization

### Frontend
- Code splitting via Vite
- Service worker caching
- Lazy loading routes
- Image optimization
- Minification and compression

### Backend
- Database indexes on foreign keys
- Redis caching for sessions
- Connection pooling
- Query optimization
- Pagination for list endpoints

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Shared session storage (Redis)
- Load balancing for API servers
- Database replication

### Vertical Scaling
- Database query optimization
- Caching strategies
- Index tuning
- Connection pooling

## Development Workflow

```
Local Development
├── Frontend (Vite)
├── Backend (ts-node)
└── Database (Local PostgreSQL)
    ↓
Git Commit
    ↓
GitHub Push
    ↓
CI/CD Pipeline (Planned)
├── Run Tests
├── Build
└── Deploy to Staging
    ↓
Staging Environment
├── Full Integration Tests
├── ERP Sync Testing
└── Manual QA
    ↓
Production Deployment
├── Database Migrations
├── API Deployment
└── Frontend Deployment
```

## Monitoring & Logging

### Planned Monitoring
- API response times
- Error rates
- Database performance
- ERP sync failures
- User session tracking

### Logging Strategy
- Application logs (console + file)
- Error tracking (Sentry planned)
- Sync event logging
- Request/response logging

## Disaster Recovery

### Backup Strategy
- Daily database backups
- Version control for code
- Asset backups to cloud storage
- ERP sync audit trail

### Recovery Procedures
- Database restore from backup
- Code rollback via git
- Service worker cache clear
- Session invalidation
