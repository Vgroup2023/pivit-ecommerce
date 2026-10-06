# PIVIT Fishing E-Commerce Platform

**Project Type:** Multi-tenant SaaS e-commerce backend + frontend  
**Status:** Deploying to production  
**Owner:** Mario Viegas / Globlexus Group  
**Last Updated:** 2026-10-06

---

## 🎯 Quick Context

PIVIT Fishing is a white-label multi-tenant e-commerce SaaS platform built with Node.js/TypeScript + React. Each tenant (fishing guides/outfitters) gets their own storefront, inventory, and order management.

**Current Status:**
- ✅ Backend: Deployed on Render (Node.js/Express API)
- ✅ Database: AWS RDS PostgreSQL (publicly accessible, t3.micro)
- ⏳ Frontend: Ready to deploy to Vercel (React + Vite)
- ⏳ Database Init: Needs admin user setup script
- ⏳ Integration: Frontend needs backend API URL

---

## 📁 Project Structure

```
pivit-ecommerce/
├── backend/                    # Express.js TypeScript API
│   ├── src/
│   │   ├── index.ts           # Main entry point, server startup
│   │   ├── config/
│   │   │   ├── database.ts    # PostgreSQL connection (pg pool)
│   │   │   └── stripe.ts      # Stripe integration
│   │   ├── middleware/        # Auth, error handling
│   │   ├── routes/            # API endpoints (auth, products, orders)
│   │   ├── services/          # Business logic (productService, orderService)
│   │   ├── types/             # TypeScript interfaces
│   │   └── migrations/        # Database schema
│   ├── dist/                  # Compiled JavaScript (generated)
│   ├── package.json           # Dependencies, build scripts
│   ├── tsconfig.json          # TypeScript config (node16 module resolution)
│   ├── .npmrc                 # NPM settings
│   └── .env.example           # Environment variables template
│
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page routes
│   │   └── App.tsx            # Root component
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md (to be created)
```

---

## 🚀 Deployment Architecture

### Backend (Render)
- **Service:** Node.js web service
- **Root Directory:** `backend/`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `node dist/index.js`
- **Environment Variables (use Option A for cleaner setup):**
  
  **Option A: Individual Parameters (Recommended)**
  - `DATABASE_HOST` → RDS hostname
  - `DATABASE_PORT` → `5432`
  - `DATABASE_NAME` → `pivit_ecommerce`
  - `DATABASE_USER` → `postgres`
  - `DATABASE_PASSWORD` → RDS password (no encoding needed!)
  - `JWT_SECRET` → Secret key for token signing
  - `STRIPE_SECRET_KEY` → Stripe API key
  - `NODE_ENV` → `production`
  
  **Option B: Single URL (if preferred)**
  - `DATABASE_URL` → `postgresql://user:password%ENCODED@host:5432/db`
  - Note: Special characters must be URL-encoded
  
  - `JWT_SECRET` → Secret key for token signing
  - `STRIPE_SECRET_KEY` → Stripe API key
  - `NODE_ENV` → `production`

### Database (AWS RDS)
- **Type:** PostgreSQL 15
- **Instance:** db.t3.micro
- **Storage:** 20GB
- **Public:** Yes (Publicly accessible: ON)
- **Endpoint:** `pivit-ecommerce.cgb8aegcyaun.us-east-1.rds.amazonaws.com:5432`
- **Database:** `pivit_ecommerce`
- **Credentials:** postgres / AwsRDS2024!Fishing#Secure9

**Connection String:**
```
postgresql://postgres:AwsRDS2024!Fishing#Secure9@pivit-ecommerce.cgb8aegcyaun.us-east-1.rds.amazonaws.com:5432/pivit_ecommerce?sslmode=require
```

### Frontend (Vercel - Ready)
- **Build:** `npm run build` (outputs to `dist/`)
- **Framework:** Vite (React)
- **Environment Variables Needed:**
  - `VITE_API_URL` → Backend Render URL (e.g., `https://api.yourapp.com`)

---

## 📋 API Endpoints

### Health Check
- `GET /health` → Server status

### Authentication
- `POST /auth/register` → Create account
- `POST /auth/login` → Login (JWT token)
- `POST /auth/logout` → Logout

### Products
- `GET /products` → List tenant products
- `GET /products/:id` → Get product details
- `POST /products` → Create product (admin)
- `PUT /products/:id` → Update product
- `DELETE /products/:id` → Delete product

### Orders
- `POST /orders` → Create order
- `GET /orders` → List orders
- `GET /orders/:id` → Order details
- `PUT /orders/:id/status` → Update status

---

## 🔧 Key Technologies

| Layer | Technology |
|-------|-----------|
| API | Node.js + Express.js |
| Language | TypeScript (5.9.3) |
| Database | PostgreSQL + pg (node driver) |
| Auth | JWT (jsonwebtoken) |
| Payments | Stripe API |
| Session | express-session + Redis |
| Validation | joi + express-validator |
| Deployment | Render (backend), Vercel (frontend) |

---

## 📦 Environment Variables

### Backend (.env)

**Option A: Individual Environment Variables (✅ Recommended)**
```bash
# Database (individual parameters — no special character issues)
DATABASE_HOST=your-host.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=pivit_ecommerce
DATABASE_USER=postgres
DATABASE_PASSWORD=AwsRDS2024!Fishing#Secure9

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Auth
JWT_SECRET=your-secret-key-here

# Server
PORT=3000
NODE_ENV=production
```

**Option B: DATABASE_URL (URL-encoded)**
```bash
# If using DATABASE_URL, special characters MUST be URL-encoded:
# ! → %21  |  # → %23  |  : → %3A  |  @ → %40
DATABASE_URL=postgresql://postgres:AwsRDS2024%21Fishing%23Secure9@your-host.rds.amazonaws.com:5432/pivit_ecommerce

STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

**Use Option A for Render/Vercel** — simpler, no URL encoding headaches.

### Frontend (.env.local)
```bash
VITE_API_URL=https://your-backend-url.render.com
```

---

## 🛠️ Build & Deploy

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev              # Start dev server (ts-node)
npm run build           # Compile TypeScript
npm run type-check      # Type checking only
npm run lint            # ESLint
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev             # Start Vite dev server
npm run build           # Build for production
```

### Production Deployment

**Render Backend:**
1. Connect GitHub repo (already done)
2. Set Root Directory: `backend`
3. Set Environment Variables (DATABASE_URL, STRIPE_SECRET_KEY, JWT_SECRET)
4. Deploy via Render dashboard or git push

**Vercel Frontend:**
1. Import project from GitHub
2. Set Framework: Vite
3. Set Build Command: `npm run build`
4. Set Environment Variables (VITE_API_URL)
5. Deploy

---

## ✅ Remaining Tasks (Step 4 & 5)

### Step 4: Frontend Configuration
- [ ] Get Backend API URL from Render deployment
- [ ] Create `frontend/.env.local` with `VITE_API_URL`
- [ ] Deploy frontend to Vercel
- [ ] Test login/registration

### Step 5: Database Initialization
- [ ] Run `backend/src/migrations/init-admin.js` to create admin user
- [ ] Seed initial data (products, categories)
- [ ] Test complete flow: Login → Browse → Order → Checkout

---

## 🐛 Recent Fixes (Oct 5-6, 2026)

1. **Stripe API Version Error** (Fixed)
   - Changed `apiVersion: '2023-10-16'` → `'2023-08-16'`
   - Location: `backend/src/services/stripeService.ts`

2. **Vercel Monorepo Conflict** (Fixed)
   - Deleted root `vercel.json` (was building frontend instead of backend)
   - Reason: Vercel detected monorepo and prioritized Vite config

3. **TypeScript Compilation** (Fixed)
   - Updated `tsconfig.json`: `moduleResolution: "node"` → `"node16"`
   - Removed duplicate compiler options (noUnusedLocals/Parameters)
   - Added `prebuild` script to ensure @types packages installed

4. **devDependencies Not Installing** (Fixed)
   - Added `prebuild` script: `npm install --include=dev`
   - Prevents TypeScript declaration errors in production builds

5. **DATABASE_URL Special Character Handling** (✅ Fixed)
   - Root cause: Passwords with `!` and `#` broke URL parsing (# marks URL fragments)
   - Solution: Complete refactor of `backend/src/config/database.ts`
   - Now supports: Individual env vars (recommended) OR URL-encoded DATABASE_URL
   - Uses `decodeURIComponent()` for proper special character handling
   - Eliminates all URL truncation issues going forward
   - Commit: `6210f61`

---

## 🔗 Important Links

- **GitHub:** https://github.com/Vgroup2023/pivit-ecommerce
- **Render Backend:** https://render.com/dashboard (check deployments)
- **AWS RDS:** AWS Console → RDS → pivit-ecommerce
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Frontend Repo:** Same GitHub repo (`frontend/` directory)

---

## 📞 Support

**Current Blocker:** DATABASE_URL environment variable in Render not persisting correctly with special characters.

**Fix in Progress:**
- Commit `5b9469a`: Added enhanced error logging to show exact DATABASE_URL value
- Next: Re-deploy and check logs to see what value Render is receiving

**If You Need to Resume:**
1. Check Render logs for DATABASE_URL value
2. Verify it's set correctly in Render Environment settings
3. Redeploy with latest commit
4. Once backend is live, configure frontend with VITE_API_URL
5. Run database initialization script

---

## 🎓 For Next Claude Sessions

- Check git log for recent commits and their fixes
- Review deployment logs if backend fails to start
- DATABASE_URL special characters (!, #, :, ?, @) may need URL encoding
- Frontend needs VITE_API_URL to talk to backend
- Database schema should be created by migrations on first connection

