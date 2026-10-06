# 🚀 AWS RDS DEPLOYMENT - COMPLETE GUIDE

Full deployment using AWS RDS free tier instead of Supabase.

---

## 📋 DEPLOYMENT PROCESS OVERVIEW

### 🔵 PART A: AWS RDS Setup (20 minutes)
1. Create AWS account (if needed)
2. Create RDS PostgreSQL instance
3. Get connection string
4. Run database migrations
5. Verify all 9 tables created

### 🔵 PART B: Vercel Backend Deployment (10 minutes)
1. Deploy backend to Vercel
2. Add AWS RDS connection string as environment variable
3. Deploy backend server
4. Test health endpoint

### 🔵 PART C: Frontend Configuration (5 minutes)
1. Update VITE_API_URL with backend URL
2. Redeploy frontend

### 🔵 PART D: Database Initialization (5 minutes)
1. Run admin user initialization script
2. Create first admin account
3. Test login

---

## ⏰ TIMELINE

| Phase | Task | Time |
|-------|------|------|
| A | AWS RDS Setup | 20 min |
| B | Backend Deployment | 10 min |
| C | Frontend Config | 5 min |
| D | Database Init | 5 min |
| **TOTAL** | **Complete System** | **40 min** |

---

## 🎯 DETAILED WORKFLOW

### PART A: AWS RDS SETUP

**File:** `AWS_RDS_SETUP_STEP1.md`

#### Step 1: Create AWS Account
- Go to https://aws.amazon.com
- Create account (free tier)
- Verify email
- Set up payment method

#### Step 2: Create RDS Instance
- Sign into AWS Console
- Navigate to RDS service
- Click "Create database"
- Select PostgreSQL
- Select "Free tier" template
- Set instance name: `pivit-ecommerce`
- Set master password (save it!)
- Enable public accessibility: YES
- Create

#### Step 3: Wait for Database
- Status changes from "Creating" to "Available"
- Takes 3-5 minutes
- ✅ Database is ready

#### Step 4: Get Connection String
- Open RDS database details
- Find endpoint (example: `pivit-ecommerce.c1234567890.us-east-1.rds.amazonaws.com`)
- Build connection string:
```
postgresql://postgres:PASSWORD@ENDPOINT:5432/pivit_ecommerce
```

**SAVE THIS CONNECTION STRING - YOU NEED IT FOR VERCEL**

---

**File:** `AWS_RDS_SETUP_STEP2.md`

#### Step 5: Run Database Migrations
- Open terminal
- Navigate to: `backend/` folder
- Run migration command or copy-paste SQL
- Wait for completion

#### Step 6: Verify Tables
- Connect to database with psql
- Run: `\dt`
- Verify all 9 tables exist
- Exit psql

✅ **AWS RDS is ready!**

---

### PART B: BACKEND DEPLOYMENT

**File:** `SETUP_STEP2_VERCEL_BACKEND.md` (same as before)

**IMPORTANT DIFFERENCE:** Use your AWS RDS connection string instead of Supabase!

#### Step 1: Create Vercel Backend Project
- Go to https://vercel.com/dashboard
- Click "Add New" → "Project"
- Select `pivit-ecommerce` repository
- **Set root directory to: `backend`** ⚠️ CRITICAL

#### Step 2: Add Environment Variables
- Go to Settings → Environment Variables
- Add these 15 variables:

```
DATABASE_URL = [YOUR AWS RDS CONNECTION STRING FROM PART A]
NODE_ENV = production
PORT = 3001
FRONTEND_URL = https://shop.pivitfishing.com
STRIPE_SECRET_KEY = sk_test_51234567890
STRIPE_PUBLIC_KEY = pk_test_01234567890
STRIPE_WEBHOOK_SECRET = whsec_test_01234567890
SESSION_SECRET = [generate random string: 32+ chars]
JWT_SECRET = [generate random string: 32+ chars]
ADMIN_EMAIL = simplicioviegaz@gmail.com
ADMIN_FIRST_NAME = Mario
ADMIN_LAST_NAME = Viegas
TENANT_NAME = PIVIT Fishing
TENANT_SLUG = pivit-fishing
BUSINESS_NAME = PIVIT Fishing
BUSINESS_EMAIL = info@pivitfishing.com
```

#### Step 3: Deploy Backend
- Click "Deploy"
- Wait for deployment to complete (takes 2-3 min)
- Should show green checkmark ✅

#### Step 4: Get Backend URL
- After successful deployment, note the URL
- Example: `https://pivit-ecommerce-xyz123.vercel.app`
- Test: Visit `[URL]/api/health`
- Should return JSON with status

**SAVE THIS BACKEND URL - YOU NEED IT FOR FRONTEND**

---

### PART C: FRONTEND CONFIGURATION

**File:** `SETUP_STEP3_FRONTEND_CONFIG.md` (same as before)

#### Step 1: Update Frontend Environment
- In Vercel dashboard, select frontend project
- Go to Settings → Environment Variables
- Find or create: `VITE_API_URL`
- Set value to your backend URL from Part B

#### Step 2: Redeploy Frontend
- Go to Deployments
- Click "Redeploy" on latest deployment
- Wait for green checkmark ✅

#### Step 3: Verify
- Visit https://shop.pivitfishing.com/admin
- Should see login page (not 404)

---

### PART D: DATABASE INITIALIZATION

**File:** `SETUP_STEP4_INIT_DATABASE.md` (same as before)

#### Step 1: Prepare Backend
```bash
cd backend
npm install
npm run build
```

#### Step 2: Create Init Script
```bash
cat > .env.init << 'EOF'
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/pivit_ecommerce
EOF
```

#### Step 3: Run Initialization
```bash
node init-admin.js
```

You should see:
```
✅ DATABASE INITIALIZED SUCCESSFULLY!

📋 LOGIN CREDENTIALS:
   Email: simplicioviegaz@gmail.com
   Password: TemporaryPassword123!
```

#### Step 4: Login & Change Password
- Visit https://shop.pivitfishing.com/admin
- Login with credentials above
- Immediately change password

---

## 📊 CHECKLIST - FOLLOW IN ORDER

### AWS RDS Setup (Part A)
- [ ] AWS account created
- [ ] RDS instance created
- [ ] Public accessibility enabled
- [ ] Connection string saved
- [ ] Database migrations executed
- [ ] All 9 tables verified

### Vercel Backend (Part B)
- [ ] Vercel backend project created
- [ ] Root directory set to "backend"
- [ ] All 15 environment variables added
- [ ] Backend deployed successfully
- [ ] Health endpoint working
- [ ] Backend URL saved

### Frontend Configuration (Part C)
- [ ] VITE_API_URL set to backend URL
- [ ] Frontend redeployed
- [ ] Login page loads without 404

### Database Initialization (Part D)
- [ ] Backend built locally
- [ ] .env.init file created
- [ ] init-admin.js executed
- [ ] "INITIALIZED SUCCESSFULLY" message seen
- [ ] Admin user created
- [ ] Successfully logged in
- [ ] Password changed

---

## 🎯 KEY DIFFERENCES FROM SUPABASE

**AWS RDS vs Supabase:**

| Step | Supabase | AWS RDS |
|------|----------|---------|
| Database Setup | GUI (5 min) | CLI + GUI (20 min) |
| Migrations | GUI SQL Editor | CLI or psql |
| Connection | Copy from dashboard | Build from parts |
| Verification | Visual in table editor | Use psql commands |
| Cost | Free | Free (first 12 mo) |

---

## ⚠️ AWS RDS IMPORTANT NOTES

1. **Public Accessibility:** MUST be "Yes" for Vercel to connect
2. **Security Group:** Allows all traffic by default in free tier
3. **Backup:** Automatic 7-day retention
4. **Monthly:** No charge during 12-month free tier
5. **After 12 months:** About $10-15/month for db.t3.micro

---

## 🚀 NEXT STEPS

1. **Start with:** `AWS_RDS_SETUP_STEP1.md`
2. **Then:** `AWS_RDS_SETUP_STEP2.md`
3. **Then:** `SETUP_STEP2_VERCEL_BACKEND.md` (use AWS RDS connection string)
4. **Then:** `SETUP_STEP3_FRONTEND_CONFIG.md`
5. **Finally:** `SETUP_STEP4_INIT_DATABASE.md`

---

## 📞 NEED HELP?

Each step guide has:
- ✅ Detailed instructions
- ✅ Expected outputs
- ✅ Troubleshooting section
- ✅ Success indicators

If you get stuck:
1. Check the troubleshooting section in that step
2. Take a screenshot of the error
3. Tell me which step and what error you're seeing
4. I'll help you fix it!

---

## 💡 WHY AWS RDS?

- ✅ Free for 12 months
- ✅ 20 GB storage (vs Supabase 500 MB)
- ✅ Production-ready
- ✅ Easy to upgrade
- ✅ AWS ecosystem integration
- ✅ Industry standard

---

## 🎉 READY TO START?

**Open:** `AWS_RDS_SETUP_STEP1.md`

Follow every step exactly and you'll have your admin portal live in 40 minutes!

