# AWS RDS SETUP - STEP 1: CREATE RDS INSTANCE
## Complete, Detailed Instructions

This replaces Supabase and uses AWS RDS PostgreSQL free tier.

---

## PART A: AWS Account Setup (5 minutes)

### A1. Create AWS Account (Skip if you already have one)
1. Go to: **https://aws.amazon.com**
2. Click **"Create an AWS Account"** (top right)
3. Follow prompts:
   - Enter email
   - Enter password
   - Verify email
   - Enter payment method (required but won't charge for free tier)
   - Complete verification

### A2. Sign In to AWS Console
1. Go to: **https://console.aws.amazon.com**
2. Sign in with your credentials
3. You'll see the AWS Management Console dashboard

### A3. Select Region
1. Look for region dropdown (top right, next to your name)
2. Select: **`us-east-1`** (N. Virginia) - this has the most free tier resources
3. Your selected region will show in the top right

---

## PART B: Create RDS Instance (10 minutes)

### B1. Navigate to RDS Service
1. In AWS Console, click the **search bar** at the top
2. Type: `RDS`
3. Click **"RDS"** from the dropdown
4. You'll see the RDS dashboard

### B2. Create Database
1. Click **"Create database"** (orange button)
2. You'll see database configuration options

### B3: Choose Engine
1. Under **"Engine options"**, make sure **"PostgreSQL"** is selected
2. Version should be: **"PostgreSQL 15.3"** or latest available
3. Click **"Free tier"** under "Templates" (left side) ⚠️ IMPORTANT
   - This ensures you stay in free tier limits

### B4: Database Credentials
**DB Instance Identifier:**
```
pivit-ecommerce
```
(This is the name of your database instance)

**Master username:**
```
postgres
```
(Default postgres user)

**Master password:**
```
[CREATE A STRONG PASSWORD AND SAVE IT]
Example: AwsRDS2024!Fishing#Secure7

Your password: _________________________________
```

**Confirm password:**
```
[Paste the same password again]
```

---

## PART C: Network & Security Settings (5 minutes)

### C1: Storage Configuration
- **Storage type:** Keep as **"General Purpose (SSD)"`**
- **Allocated storage:** Keep as **20 GB** (free tier limit)
- **Storage autoscaling:** **Uncheck** (to stay in free tier)

### C2: Connectivity
1. Under **"Connectivity"** section:

**Public accessibility:**
- Select: **"Yes"** ✅ (Need this to connect from Vercel)

**VPC Security group:**
- Select: **"Create new"**
- Name: `pivit-ecommerce-sg`

### C3: Database Authentication
- Keep **"Password authentication"** selected
- **"Enable IAM database authentication":** Leave unchecked

### C4: Database Name
Under **"Database options"**:
- **Initial database name:** 
```
pivit_ecommerce
```

### C5: Backup Settings
- **Backup retention period:** Set to **7 days** (free tier default)
- **Enable automatic backups:** **Checked** ✅

### C6: Monitoring
- **Enable Enhanced monitoring:** **Unchecked** (to save on costs)

---

## PART D: Review and Create (2 minutes)

### D1: Review Configuration
Scroll down and verify:
- [ ] Engine: PostgreSQL
- [ ] Instance class: db.t3.micro (or db.t2.micro)
- [ ] DB instance identifier: pivit-ecommerce
- [ ] Master username: postgres
- [ ] Allocated storage: 20 GB
- [ ] Public accessibility: Yes
- [ ] Database name: pivit_ecommerce

### D2: Create Database
1. Click the **orange "Create database"** button
2. You'll see: "Database being created..."
3. **This takes 3-5 minutes** ⏳

**DO NOT CLOSE THIS PAGE** - wait for completion

---

## PART E: Wait for Database to Be Ready (5 minutes)

### E1: Monitor Creation
1. You should see a blue notification at top
2. It will show database creation progress
3. Status will change from **"Creating"** to **"Available"**

### E2: Database Created
When you see **"Available"** status:
✅ Your database is ready!

---

## PART F: Get Connection Details (3 minutes)

### F1: Find Your Database
1. In RDS dashboard, click **"Databases"** (left menu)
2. You should see: **"pivit-ecommerce"** in the list
3. Click on it to open details

### F2: Get Connection String
Look for **"Connectivity & security"** section:
- **Endpoint:** Shows something like: `pivit-ecommerce.c1234567890.us-east-1.rds.amazonaws.com`
- **Port:** Should be `5432`
- **DB name:** `pivit_ecommerce`

### F3: Build Your Connection String
Combine the information like this:

```
postgresql://postgres:[YOUR_PASSWORD]@pivit-ecommerce.c1234567890.us-east-1.rds.amazonaws.com:5432/pivit_ecommerce
```

Replace `[YOUR_PASSWORD]` with the password you created in Part B

**EXAMPLE:**
```
postgresql://postgres:AwsRDS2024!Fishing#Secure7@pivit-ecommerce.c1234567890.us-east-1.rds.amazonaws.com:5432/pivit_ecommerce
```

**YOUR CONNECTION STRING:**
```
[PASTE IT HERE FOR REFERENCE]

_________________________________________________________________

_________________________________________________________________
```

---

## PART G: Test Connection (2 minutes)

### G1: Download PostgreSQL Client (if needed)
You need `psql` to test connection. 

**On Windows:**
1. Download: https://www.postgresql.org/download/windows/
2. Install (select just "Command Line Tools")

**On Mac:**
```bash
brew install postgresql
```

**On Linux:**
```bash
sudo apt-get install postgresql-client
```

### G2: Test Connection
Run this command in your terminal:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@YOUR_ENDPOINT:5432/pivit_ecommerce"
```

Replace:
- `YOUR_PASSWORD` with your database password
- `YOUR_ENDPOINT` with your RDS endpoint (from Part F2)

### G3: Expected Output
You should see:
```
psql (15.0)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES128-GCM-SHA256, bits: 128, compression: off)
Type "help" for help.

pivit_ecommerce=>
```

If you see this, your connection works! ✅

Type `\q` to exit

---

## ✅ STEP 1 COMPLETE CHECKLIST

- [ ] AWS account created (if needed)
- [ ] Signed into AWS Console
- [ ] Selected us-east-1 region
- [ ] Created RDS instance named "pivit-ecommerce"
- [ ] Set master password
- [ ] Set public accessibility to "Yes"
- [ ] Set initial database name to "pivit_ecommerce"
- [ ] Database status shows "Available"
- [ ] Got connection string
- [ ] Tested connection successfully

---

## 🔐 SAVE THIS INFORMATION

```
AWS RDS CREDENTIALS
====================
Instance: pivit-ecommerce
Master User: postgres
Master Password: [your password]
Database: pivit_ecommerce
Endpoint: [your endpoint]
Port: 5432
Region: us-east-1

Connection String:
postgresql://postgres:[PASSWORD]@[ENDPOINT]:5432/pivit_ecommerce

KEEP THIS SAFE - YOU NEED IT FOR VERCEL!
```

---

## ⚠️ Troubleshooting

**Problem: "Connection refused"**
- Database might still be creating (takes up to 5 minutes)
- Check status shows "Available" in RDS dashboard
- Try again in 1-2 minutes

**Problem: "psql: command not found"**
- PostgreSQL client not installed
- Install from https://www.postgresql.org/download/

**Problem: "password authentication failed"**
- Password was entered wrong
- Go to RDS → Modify → change password
- Use new password in connection string

**Problem: "host name resolution failed"**
- Endpoint address is incorrect
- Go back to RDS database details
- Copy endpoint exactly as shown

---

## 🎉 NEXT STEP

Once you have your **CONNECTION STRING**, you're ready for:
**AWS RDS SETUP - STEP 2: Database Migrations**

Ask me to help with STEP 2 when ready!
