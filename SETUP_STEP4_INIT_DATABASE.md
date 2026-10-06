# STEP 4: INITIALIZE DATABASE WITH ADMIN USER
## Complete, Detailed Instructions

**PREREQUISITE:** Steps 1-3 must be completed.

---

## PART A: Prepare Your System (2 minutes)

### A1. Make Sure You Have Node.js
In your terminal, run:
```bash
node --version
```

You should see something like: `v18.16.0` or higher

If you get "command not found", download Node.js from https://nodejs.org

### A2. Navigate to Backend Folder
```bash
cd /home/claude/pivit-ecommerce/backend
```

### A3. Install Dependencies
```bash
npm install
```

(This might take 1-2 minutes)

### A4. Build the Backend
```bash
npm run build
```

(This compiles TypeScript to JavaScript)

---

## PART B: Create the Admin User (3 minutes)

### B1. Create Environment File
In the terminal, create a temporary .env file:

```bash
cat > .env.init << 'EOF'
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
EOF
```

**IMPORTANT:** Replace:
- `YOUR_PASSWORD` with your Supabase database password
- `YOUR_HOST` with your Supabase host (from connection string)

Example:
```bash
cat > .env.init << 'EOF'
DATABASE_URL=postgresql://postgres:MyPassword123!@abc123xyz.supabase.co:5432/postgres
EOF
```

### B2. Download and Run the Initialization Script
I've created a script for you. Download it:

```bash
# Create the init script
cat > init-admin.js << 'EOF'
require('dotenv').config({ path: '.env.init' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...\n');

    // 1. Create tenant
    console.log('📦 Creating tenant...');
    const tenantRes = await pool.query(
      `INSERT INTO tenants (name, slug, is_active) 
       VALUES ($1, $2, true) 
       RETURNING id`,
      ['PIVIT Fishing', 'pivit-fishing']
    );
    const tenantId = tenantRes.rows[0].id;
    console.log(`✅ Tenant created: ${tenantId}\n`);

    // 2. Create admin user
    console.log('👤 Creating admin user...');
    const passwordHash = await bcrypt.hash('TemporaryPassword123!', 10);
    const userRes = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
       VALUES ($1, $2, $3, $4, true) 
       RETURNING id`,
      ['simplicioviegaz@gmail.com', passwordHash, 'Mario', 'Viegas']
    );
    const userId = userRes.rows[0].id;
    console.log(`✅ Admin user created: ${userId}\n`);

    // 3. Assign admin role
    console.log('🔑 Assigning admin role...');
    await pool.query(
      `INSERT INTO admin_users (tenant_id, user_id, role, is_active)
       VALUES ($1, $2, $3, true)`,
      [tenantId, userId, 'admin']
    );
    console.log('✅ Admin role assigned\n');

    // 4. Summary
    console.log('═══════════════════════════════════════');
    console.log('✅ DATABASE INITIALIZED SUCCESSFULLY!\n');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('   Email: simplicioviegaz@gmail.com');
    console.log('   Password: TemporaryPassword123!\n');
    console.log('⚠️  IMPORTANT:');
    console.log('   Change your password after first login!\n');
    console.log('═══════════════════════════════════════');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check DATABASE_URL is correct');
    console.error('2. Verify Supabase project is running');
    console.error('3. Make sure database migration (STEP 1) was successful');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
EOF
```

### B3: Run the Initialization Script
```bash
node init-admin.js
```

### B4: Expected Output
You should see something like:

```
🚀 Initializing database...

📦 Creating tenant...
✅ Tenant created: [UUID]

👤 Creating admin user...
✅ Admin user created: [UUID]

🔑 Assigning admin role...
✅ Admin role assigned

═══════════════════════════════════════
✅ DATABASE INITIALIZED SUCCESSFULLY!

📋 LOGIN CREDENTIALS:
   Email: simplicioviegaz@gmail.com
   Password: TemporaryPassword123!

⚠️  IMPORTANT:
   Change your password after first login!

═══════════════════════════════════════
```

---

## PART C: Verify Everything Works (2 minutes)

### C1: Log In to Admin Portal
1. Open browser: **https://shop.pivitfishing.com**
2. You might see the home page (that's OK)
3. Go to: **https://shop.pivitfishing.com/admin**
4. You should see a **Login Page**

### C2: Enter Credentials
- **Email:** `simplicioviegaz@gmail.com`
- **Password:** `TemporaryPassword123!`
- Click **Login**

### C3: Expected Result
You should see:
- ✅ Admin Dashboard loads
- ✅ You see the sidebar menu
- ✅ You can see "Products" and "Orders" options
- ✅ No error messages

---

## PART D: Change Your Password (1 minute)

### D1: First Priority
1. **Before doing anything else, change your password!**
2. Look for a user menu (top right)
3. Click your email or user icon
4. Look for "Settings" or "Change Password"
5. Enter a new, strong password
6. Confirm and save

---

## ✅ STEP 4 COMPLETE CHECKLIST

- [ ] Node.js installed
- [ ] Backend dependencies installed
- [ ] Backend built successfully
- [ ] Environment file (.env.init) created with connection string
- [ ] Admin initialization script created
- [ ] Script ran successfully with "INITIALIZED SUCCESSFULLY" message
- [ ] Admin user created with email: simplicioviegaz@gmail.com
- [ ] Logged into admin portal successfully
- [ ] Changed password to something secure

---

## 🎉 YOU'RE DONE!

Your complete ecommerce admin portal is now live at:
**https://shop.pivitfishing.com/admin**

---

## ⚠️ Troubleshooting

**Problem: "Error: connect ENOTFOUND"**
- Database URL is wrong
- Check it matches your Supabase connection string exactly
- Verify password and hostname are correct

**Problem: "relation 'tenants' does not exist"**
- Database migration (STEP 1) didn't complete
- Go back to Supabase and verify all tables are created

**Problem: "duplicate key value violates unique constraint"**
- Admin user already exists
- That's OK! You can just log in with the email and password

**Problem: "Login fails with API Error"**
- Backend might not be fully deployed
- Check that VITE_API_URL is set correctly in frontend
- Verify backend is healthy at: `[BACKEND_URL]/api/health`

---

## 📞 Getting Help

If you're stuck on any step:
1. Take a screenshot of the error
2. Tell me which step is failing
3. I can help you fix it!

