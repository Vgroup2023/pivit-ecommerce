# AWS RDS SETUP - STEP 2: DATABASE MIGRATIONS
## Complete, Detailed Instructions

**PREREQUISITE:** You must have completed STEP 1 and have your connection string.

---

## PART A: Prepare Your System (3 minutes)

### A1. Make Sure You Have psql
Run in terminal:
```bash
psql --version
```

You should see: `psql (PostgreSQL) 15.0` or similar

If not, install PostgreSQL from: https://www.postgresql.org/download/

### A2. Navigate to Backend Folder
```bash
cd /home/claude/pivit-ecommerce/backend
```

### A3. Read the Migration File
Open this file: `src/migrations/001_init.sql`

You'll see all the SQL commands to create the database tables.

---

## PART B: Run Database Migration (5 minutes)

### B1: Option 1 - Using psql Command (Recommended)

Create a temporary file with your connection string:

```bash
cat > .pgpass << 'EOF'
pivit-ecommerce.c1234567890.us-east-1.rds.amazonaws.com:5432:pivit_ecommerce:postgres:YOUR_PASSWORD
EOF
```

Replace `YOUR_PASSWORD` with your RDS master password from STEP 1.

Make it readable only by you:
```bash
chmod 600 .pgpass
```

Now run the migration:
```bash
psql -h pivit-ecommerce.c1234567890.us-east-1.rds.amazonaws.com \
     -U postgres \
     -d pivit_ecommerce \
     -f src/migrations/001_init.sql
```

Replace the hostname with YOUR RDS endpoint from STEP 1.

### B2: Option 2 - Copy/Paste SQL (If Option 1 fails)

1. Connect to database:
```bash
psql postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/pivit_ecommerce
```

2. Once connected, you should see:
```
pivit_ecommerce=>
```

3. Copy the entire contents of `src/migrations/001_init.sql`

4. Paste it into the psql terminal

5. Press Enter

6. You should see messages like:
```
CREATE EXTENSION
CREATE TABLE tenants
CREATE TABLE users
CREATE TABLE admin_users
...
```

7. Type `\q` to exit

---

## PART C: Verify Tables Were Created (2 minutes)

### C1: Connect to Database
```bash
psql postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/pivit_ecommerce
```

### C2: List Tables
Type this command:
```bash
\dt
```

You should see:
```
         List of relations
 Schema |       Name       | Type  | Owner
--------+------------------+-------+----------
 public | admin_users      | table | postgres
 public | customers        | table | postgres
 public | erp_sync_logs    | table | postgres
 public | order_items      | table | postgres
 public | orders           | table | postgres
 public | payments         | table | postgres
 public | products         | table | postgres
 public | tenants          | table | postgres
 public | users            | table | postgres
(9 rows)
```

**Verify you see all 9 tables:**
- [ ] tenants
- [ ] users
- [ ] admin_users
- [ ] products
- [ ] customers
- [ ] orders
- [ ] order_items
- [ ] payments
- [ ] erp_sync_logs

### C3: Exit psql
Type:
```bash
\q
```

---

## PART D: Verify Column Structure (Optional but Recommended)

### D1: Check a Table Structure
Connect again:
```bash
psql postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/pivit_ecommerce
```

Check the products table:
```bash
\d products
```

You should see columns like:
```
                          Table "public.products"
    Column     |           Type           | Collation | Nullable | Default
---------------+--------------------------+-----------+----------+----------
 id            | uuid                     |           | not null | uuid_generate_v4()
 tenant_id     | uuid                     |           | not null |
 name          | character varying(255)   |           | not null |
 description   | text                     |           |          |
 price         | numeric(10,2)            |           | not null |
 cost          | numeric(10,2)            |           |          |
 sku           | character varying(100)   |           |          |
 category      | character varying(100)   |           |          |
 stock_quantity| integer                  |           |          | 0
 images        | text[]                   |           |          |
 is_active     | boolean                  |           |          | true
 created_at    | timestamp with time zone |           |          | CURRENT_TIMESTAMP
 updated_at    | timestamp with time zone |           |          | CURRENT_TIMESTAMP
```

This confirms the table structure is correct!

### D2: Exit psql
```bash
\q
```

---

## ✅ STEP 2 COMPLETE CHECKLIST

- [ ] psql installed and working
- [ ] Connection string created
- [ ] Migration file executed successfully
- [ ] All 9 tables created
- [ ] Table structures verified (optional)
- [ ] Successfully exited psql

---

## 🔐 SAVE YOUR CONNECTION INFO

You now have a working PostgreSQL database on AWS RDS!

```
DATABASE READY
==============
Connection String:
postgresql://postgres:[PASSWORD]@[ENDPOINT]:5432/pivit_ecommerce

Status: ✅ READY FOR BACKEND DEPLOYMENT
```

---

## ⚠️ Troubleshooting

**Problem: "psql: could not connect to server"**
- RDS instance might still be creating
- Check in AWS Console that status is "Available"
- Wait 1-2 minutes and try again

**Problem: "password authentication failed"**
- Password is incorrect
- Go back to AWS RDS console
- Modify database and reset password

**Problem: "permission denied for schema public"**
- User doesn't have permission
- This shouldn't happen with master user "postgres"
- Try resetting the password in AWS

**Problem: "CREATE TABLE failed"**
- Tables might already exist from previous run
- That's OK - you can continue
- Or type `DROP SCHEMA public CASCADE;` then re-run migration
- ⚠️ This deletes all data!

**Problem: "column 'xyz' does not exist"**
- Migration didn't run fully
- Run migration again completely
- Make sure all SQL executed

---

## 🎉 NEXT STEP

Your AWS RDS database is ready! Now you're ready for:
**Back to Vercel deployment with AWS RDS connection string**

Go to: `SETUP_STEP2_VERCEL_BACKEND.md`
But use your AWS RDS connection string instead of Supabase!

Ask me to help with the next step when ready!
