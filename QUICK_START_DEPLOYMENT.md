# 🚀 Quick Start: Deploy PIVIT Ecommerce in 30 Minutes

## Your Action Items (Complete in Order)

### ✅ STEP 1: Set Up Supabase Database (10 min)
**Go to:** https://supabase.com

1. **Create new project**
   - Name: `pivit-ecommerce`
   - Save the password it generates
   - Wait for "Your project is ready"

2. **Copy connection string**
   - Settings → Database → Connection Strings → PostgreSQL
   - Copy the full string (save it for later)

3. **Create tables**
   - SQL Editor → New Query
   - Open the file: `backend/src/migrations/001_init.sql` from this repo
   - Copy ALL contents into Supabase SQL Editor
   - Click Run (blue button)
   - You'll see "Finished successfully"

### ✅ STEP 2: Deploy Backend to Vercel (10 min)
**Go to:** https://vercel.com

1. **Create backend project**
   - Click "Add New" → "Project"
   - Select: `pivit-ecommerce` repository
   - Root Directory: **Select `backend`** ⚠️ IMPORTANT
   - Framework: **Select "Other"**
   - Click Deploy

2. **Add environment variables** (in Vercel project settings)
   - Go to Settings → Environment Variables
   - Add each of these:

```
DATABASE_URL = [PASTE YOUR SUPABASE CONNECTION STRING HERE]
NODE_ENV = production
STRIPE_SECRET_KEY = sk_test_51234567890
STRIPE_PUBLIC_KEY = pk_test_01234567890
STRIPE_WEBHOOK_SECRET = whsec_test_01234567890
FRONTEND_URL = https://shop.pivitfishing.com
SESSION_SECRET = [GENERATE A RANDOM STRING - 32+ CHARACTERS]
JWT_SECRET = [GENERATE A RANDOM STRING - 32+ CHARACTERS]
ADMIN_EMAIL = simplicioviegaz@gmail.com
ADMIN_FIRST_NAME = Mario
ADMIN_LAST_NAME = Viegas
TENANT_NAME = PIVIT Fishing
TENANT_SLUG = pivit-fishing
```

3. **Redeploy**
   - Click "Deployments" → "Redeploy"
   - Wait for green checkmark
   - Copy your backend URL (you'll need this next)

### ✅ STEP 3: Update Frontend Configuration (5 min)
**Go to:** https://vercel.com

1. **Select frontend project** (shop.pivitfishing.com)
2. **Settings → Environment Variables**
3. **Find or create** `VITE_API_URL`
4. **Set value to:** Your backend URL from Step 2 (e.g., `https://backend-abc123.vercel.app`)
5. **Redeploy**

### ✅ STEP 4: Initialize Database User (5 min)
Run this command locally (in your terminal):

```bash
cd backend
npm install
npm run build

# Then run the init command:
DATABASE_URL="postgresql://postgres:PASSWORD@HOST:5432/postgres" node -e "
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function init() {
  try {
    const tenantRes = await pool.query(
      'INSERT INTO tenants (name, slug, is_active) VALUES (\$1, \$2, true) RETURNING id',
      ['PIVIT Fishing', 'pivit-fishing']
    );
    const tenantId = tenantRes.rows[0].id;
    
    const passwordHash = await bcrypt.hash('TemporaryPassword123!', 10);
    const userRes = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name, is_admin) VALUES (\$1, \$2, \$3, \$4, true) RETURNING id',
      ['simplicioviegaz@gmail.com', passwordHash, 'Mario', 'Viegas']
    );
    const userId = userRes.rows[0].id;
    
    await pool.query(
      'INSERT INTO admin_users (tenant_id, user_id, role, is_active) VALUES (\$1, \$2, \$3, true)',
      [tenantId, userId, 'admin']
    );
    
    console.log('✅ Database initialized!');
    console.log('Login Email: simplicioviegaz@gmail.com');
    console.log('Temporary Password: TemporaryPassword123!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

init();
"
```

Replace `PASSWORD@HOST` with your actual Supabase credentials.

---

## 🎉 You're Done! Test It:

1. **Visit:** https://shop.pivitfishing.com
2. **Click:** Refresh a few times (may take 30 seconds first time)
3. **Login with:**
   - Email: `simplicioviegaz@gmail.com`
   - Password: `TemporaryPassword123!`
4. **You should see:** Admin Dashboard

---

## 🚨 If Something Doesn't Work:

### **Login page shows "API Error"**
- Frontend can't reach backend
- Check `VITE_API_URL` in frontend Vercel settings
- Make sure backend URL in that variable is correct
- Redeploy frontend again

### **Products/Orders won't load**
- Same issue as above
- Verify backend URL is accessible in browser
- Check Vercel deployment logs

### **Can't connect to database**
- Verify `DATABASE_URL` format: `postgresql://postgres:PASSWORD@HOST:5432/postgres`
- Make sure password is correct
- Test Supabase is actually running

---

## 📝 Important Notes

- ⚠️ **Change admin password** immediately after first login
- ⚠️ **Use test Stripe keys** (sk_test_*) until you're ready for live payments
- ✅ Keep `.env.production` files secure - never commit to GitHub
- ✅ Enable Supabase backups for data safety

---

## 📞 Need Help?

Check these files for detailed info:
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `SUPABASE_SETUP.md` - Database setup details
- `backend/.env.production` - All environment variables explained

