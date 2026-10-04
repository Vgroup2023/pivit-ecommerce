# PIVIT Fishing E-Commerce Platform - Quick Start

Get the platform running in 10 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download) or use Docker)
- Redis 6+ ([Download](https://redis.io/download) or use Docker)

## 1. Clone & Setup (2 min)

```bash
# Clone the repository
git clone https://github.com/pivitfishing/ecommerce.git
cd pivit-ecommerce

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 2. Database Setup (3 min)

### Option A: Local PostgreSQL (Recommended for Development)

```bash
# Create database
createdb pivit_ecommerce

# Run migrations
psql pivit_ecommerce < backend/src/migrations/001_init.sql
```

### Option B: Supabase (Recommended for Quick Demo)

1. Go to https://supabase.com and create a free project
2. Get your connection string from project settings
3. Copy to backend/.env as DATABASE_URL

### Option C: Docker

```bash
# Start PostgreSQL in Docker
docker run -d \
  --name postgres \
  -e POSTGRES_DB=pivit_ecommerce \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine

# Run migrations
docker exec postgres psql -U postgres -d pivit_ecommerce < backend/src/migrations/001_init.sql

# Start Redis
docker run -d -p 6379:6379 redis:7-alpine
```

## 3. Environment Configuration (2 min)

### Backend
```bash
cd backend
cp .env.example .env

# Edit .env with your database URL
# Minimum required:
# DATABASE_URL=postgresql://user:password@localhost:5432/pivit_ecommerce
# REDIS_URL=redis://localhost:6379
# SESSION_SECRET=your-secret-here
```

### Frontend
```bash
cd ../frontend
cp .env.example .env

# Edit .env (defaults work for local development)
# VITE_API_URL=http://localhost:3001
```

## 4. Start the Platform (2 min)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# API running on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App running on http://localhost:3000
```

## 5. Create Test Data (1 min)

### Create Your First Tenant
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pivitfishing.com",
    "password": "TestPassword123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Create Sample Product
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your-session-cookie" \
  -d '{
    "tenantId": "your-tenant-id",
    "name": "Pro Fishing Rod",
    "price": 129.99,
    "description": "High-quality fishing rod for professionals",
    "sku": "ROD-001",
    "stockQuantity": 50
  }'
```

## Visit the App

- **Storefront**: http://localhost:3000
- **API Docs**: http://localhost:3001/api
- **Admin Dashboard**: http://localhost:3000/admin

## Default Test Credentials

- Email: `admin@pivitfishing.com`
- Password: `TestPassword123`

## Next Steps

### 📚 Learn More
- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [ERP Integration](docs/ERP-INTEGRATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

### 🔧 Development
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`
- Type checking: `npm run type-check`
- Linting: `npm run lint`

### 📦 Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### 🚀 Deploy
See [Deployment Guide](docs/DEPLOYMENT.md) for:
- Vercel (Frontend)
- AWS EC2 (Full Stack)
- Docker (Containerized)

## Features

✅ **Multi-tenant SaaS** - Support multiple stores on one platform
✅ **Progressive Web App** - Install directly on phones and tablets
✅ **Secure Admin Portal** - Manage orders, inventory, and payments
✅ **Real-time ERP Sync** - Bi-directional integration with GloblexAI
✅ **Payment Processing** - Stripe integration (ready for implementation)
✅ **Order Management** - Full order lifecycle management
✅ **Inventory Tracking** - Real-time stock updates
✅ **Customer Management** - Order history and preferences
✅ **Responsive Design** - Works on all devices

## Project Structure

```
pivit-ecommerce/
├── backend/             # Node.js + Express API
│   ├── src/
│   │   ├── config/      # Database, Redis, etc.
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── middleware/  # Auth, error handling
│   │   └── migrations/  # Database schemas
│   └── package.json
├── frontend/            # React 18 + Vite PWA
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── api/         # API client
│   │   ├── store/       # State management
│   │   └── index.css    # Global styles
│   └── package.json
├── docs/                # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── ERP-INTEGRATION.md
└── README.md
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d pivit_ecommerce

# Check DATABASE_URL in .env
echo $DATABASE_URL
```

### Redis Connection Error
```bash
# Test Redis
redis-cli ping

# Should return: PONG
```

### API Not Responding
```bash
# Check backend is running
curl http://localhost:3001/api/health

# View backend logs
cd backend && npm run dev
```

## Support & Documentation

- 📖 Full docs in `/docs` directory
- 🐛 Issues on GitHub
- 💬 Community discussions

## License

MIT License - See LICENSE file

---

**Happy fishing! 🎣**

Built for PIVIT Fishing with ❤️
