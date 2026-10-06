# Supabase Setup for PIVIT Fishing Backend

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign in or create account
3. Click "New Project"
4. **Name:** `pivit-ecommerce`
5. **Database Password:** Create a strong password and save it
6. **Region:** `us-east-1` (or your preferred region)
7. Click "Create new project" (wait 2-3 minutes for setup)

### 2. Get Connection String
1. In Supabase dashboard, go to **Settings → Database → Connection Strings**
2. Copy the **PostgreSQL** connection string (looks like: `postgresql://postgres:password@host:5432/postgres`)
3. Replace `[YOUR-PASSWORD]` with your database password from step 1

### 3. Run Database Migration
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `backend/src/migrations/001_init.sql`
4. Paste into the SQL Editor
5. Click **Run** (blue button)
6. You should see: "Finished successfully"

### 4. Verify Tables Created
1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - `tenants`
   - `users`
   - `admin_users`
   - `products`
   - `customers`
   - `orders`
   - `order_items`
   - `payments`
   - `erp_sync_logs`

## Connection String Format
```
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

Example:
```
postgresql://postgres:MySecurePass123@db.xxxxxxxx.supabase.co:5432/postgres
```

Keep this safe - you'll need it for the .env file!
