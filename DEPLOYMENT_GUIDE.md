# PIVIT Fishing Ecommerce - Full Deployment Guide

## Overview
This guide covers deploying the complete PIVIT Fishing ecommerce platform:
- **Frontend:** React app deployed to Vercel (shop.pivitfishing.com)
- **Backend:** Node.js API deployed to Vercel (api.shop.pivitfishing.com)
- **Database:** PostgreSQL on Supabase

## Phase 1: Database Setup (Supabase) - 10 minutes

### Step 1.1: Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name:** `pivit-ecommerce`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** `us-east-1` (or nearest region)
4. Click "Create new project" and wait 2-3 minutes

### Step 1.2: Get Connection String
1. After project is created, go to **Settings → Database → Connection Strings**
2. Copy the **PostgreSQL** connection string
3. It looks like: `postgresql://postgres:PASSWORD@host.supabase.co:5432/postgres`

### Step 1.3: Run Database Migrations
1. In Supabase, go to **SQL Editor → New Query**
2. Open `backend/src/migrations/001_init.sql` in this repo
3. Copy ALL contents and paste into SQL Editor
4. Click **Run** (the blue play button)
5. You should see "Finished successfully"

### Step 1.4: Verify Tables
Go to **Table Editor** and confirm these tables exist:
- `tenants`
- `users`
- `admin_users`
- `products`
- `customers`
- `orders`
- `order_items`
- `payments`
- `erp_sync_logs`

✅ **Database is ready!**

---

## Phase 2: Backend Deployment to Vercel - 15 minutes

### Step 2.1: Push Code to GitHub
```bash
cd /home/claude/pivit-ecommerce
git add -A
git commit -m "Add backend deployment configuration and environment files"
git push origin main
```

### Step 2.2: Create Vercel Project for Backend
1. Go to https://vercel.com/dashboard
2. Click **"Add New..." → "Project"**
3. Select the **pivit-ecommerce** repository from GitHub
4. In the configure step:
   - **Root Directory:** Select `backend` from dropdown
   - **Framework:** Select `Other`
   - Click **Deploy**
5. Wait for initial deployment (will fail - that's OK, we need to add env vars)

### Step 2.3: Add Environment Variables to Vercel
After deployment completes:

1. Go to **Project Settings → Environment Variables**
2. Add these variables (click **Add Environment Variable** each time):

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
NODE_ENV = production
STRIPE_SECRET_KEY = sk_test_51234567890
STRIPE_PUBLIC_KEY = pk_test_01234567890
STRIPE_WEBHOOK_SECRET = whsec_test_01234567890
FRONTEND_URL = https://shop.pivitfishing.com
API_URL = https://api-backend.vercel.app
SESSION_SECRET = (generate a random string, 32+ chars)
JWT_SECRET = (generate a random string, 32+ chars)
ADMIN_EMAIL = simplicioviegaz@gmail.com
ADMIN_FIRST_NAME = Mario
ADMIN_LAST_NAME = Viegas
TENANT_NAME = PIVIT Fishing
TENANT_SLUG = pivit-fishing
BUSINESS_NAME = PIVIT Fishing
BUSINESS_EMAIL = info@pivitfishing.com
```

### Step 2.4: Redeploy
1. Click **Deployments → Redeploy Latest**
2. Wait for deployment to complete
3. You'll see a URL like `https://your-backend.vercel.app`
4. **Copy this URL** - you'll need it for frontend

✅ **Backend is deployed!**

---

## Phase 3: Initialize Database with Admin User - 5 minutes

### Step 3.1: SSH into Vercel/Create Init Script
Since Vercel doesn't allow SSH, we'll need to create an initialization endpoint. For now, you can use a simple curl command:

```bash
# First, update the API_URL in your backend environment to point to your Vercel deployment
# Then create the admin user via a curl request (once we add the init endpoint)

# Run this locally first to create the admin user:
cd backend
npm run build
DATABASE_URL="postgresql://postgres:PASSWORD@host.supabase.co:5432/postgres" node -e "
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  try {
    // Create tenant
    const tenantRes = await pool.query(
      \`INSERT INTO tenants (name, slug, is_active) VALUES (\$1, \$2, true) RETURNING id\`,
      ['PIVIT Fishing', 'pivit-fishing']
    );
    const tenantId = tenantRes.rows[0].id;
    console.log('✓ Tenant created:', tenantId);

    // Create admin user
    const passwordHash = await bcrypt.hash('TemporaryPassword123!', 10);
    const userRes = await pool.query(
      \`INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
       VALUES (\$1, \$2, \$3, \$4, true) RETURNING id\`,
      ['simplicioviegaz@gmail.com', passwordHash, 'Mario', 'Viegas']
    );
    const userId = userRes.rows[0].id;
    console.log('✓ Admin user created:', userId);

    // Add admin role to tenant
    await pool.query(
      \`INSERT INTO admin_users (tenant_id, user_id, role, is_active)
       VALUES (\$1, \$2, 'admin', true)\`,
      [tenantId, userId]
    );
    console.log('✓ Admin role assigned');

    console.log('\\n✅ Database initialized!');
    console.log('Login credentials:');
    console.log('  Email: simplicioviegaz@gmail.com');
    console.log('  Temporary Password: TemporaryPassword123!');
    console.log('\\n⚠️  Change this password after first login!');

  } catch (error) {
    console.error('❌ Initialization failed:', error);
  } finally {
    await pool.end();
  }
}

init();
"
```

### Step 3.2: Update Frontend API URL
1. Go to Vercel dashboard
2. Select the **frontend** project (shop.pivitfishing.com)
3. Go to **Settings → Environment Variables**
4. Find or create `VITE_API_URL`
5. Set value to your backend URL (e.g., `https://your-backend.vercel.app`)
6. Redeploy frontend

---

## Phase 4: Test the Deployment

### Step 4.1: Test Login
1. Go to https://shop.pivitfishing.com/login
2. Enter:
   - **Email:** `simplicioviegaz@gmail.com`
   - **Password:** `TemporaryPassword123!`
3. You should see the admin dashboard
4. **Immediately change your password!**

### Step 4.2: Test Product Management
1. Click **Products** or navigate to `/admin/products`
2. Test adding a product
3. Test editing a product
4. Verify inventory management works

### Step 4.3: Test Orders
1. Navigate to `/admin/orders`
2. You should see orders list (empty if no test orders)
3. Create a test order if you want
4. Test order status updates

---

## Phase 5: Custom Domain Setup (Optional but Recommended)

### Step 5.1: Frontend Custom Domain
1. Vercel Dashboard → Frontend Project → Settings → Domains
2. Add domain: `shop.pivitfishing.com`
3. Follow DNS instructions for your domain registrar

### Step 5.2: Backend Custom Domain
1. Vercel Dashboard → Backend Project → Settings → Domains
2. Add domain: `api.shop.pivitfishing.com`
3. Follow DNS instructions for your domain registrar

---

## Troubleshooting

### Backend won't deploy
- Check that `backend` is set as root directory in Vercel
- Verify all environment variables are set
- Check build logs in Vercel dashboard

### Login fails with "API Error"
- Verify `VITE_API_URL` is set correctly in frontend
- Check that backend URL is accessible (test in browser)
- Verify database connection in backend logs

### Products won't load
- Same as login - check API URL configuration
- Verify database has `products` table

### Database connection fails
- Double-check `DATABASE_URL` - format must be exactly: `postgresql://postgres:PASSWORD@HOST:5432/postgres`
- Verify Supabase project is active
- Test connection locally first

---

## Security Checklist

- [ ] Change initial admin password
- [ ] Set strong `SESSION_SECRET` and `JWT_SECRET` in production
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Set up proper CORS in backend for production domain
- [ ] Use Stripe production keys (not test) when ready
- [ ] Enable database backups in Supabase
- [ ] Review and restrict API endpoints by role

---

## Next Steps

1. **Test everything thoroughly** before going live
2. **Set up monitoring** for backend errors
3. **Enable Supabase backups** for data protection
4. **Create team members** and assign roles
5. **Configure payment** with real Stripe keys
6. **Set up email** for order notifications

