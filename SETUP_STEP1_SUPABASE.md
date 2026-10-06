# STEP 1: SUPABASE DATABASE SETUP
## Complete, Detailed Instructions

Follow EXACTLY as written. Do not skip any steps.

---

## PART A: Create Supabase Account & Project (3 minutes)

### A1. Sign In to Supabase
1. Open browser and go to: **https://supabase.com**
2. Click **"Sign In"** (top right)
3. If you don't have an account, click **"Create an account"** and follow prompts
4. Once logged in, you'll see the dashboard

### A2. Create New Project
1. Click the **green "New project"** button
2. You'll see a form with these fields:

**Organization:** Should be auto-filled (your name or org name)

**Name:** 
```
pivit-ecommerce
```
(Copy this exactly)

**Database Password:** 
```
[CREATE A STRONG PASSWORD AND SAVE IT BELOW]
Example: Sup@base2024!FishingPLATFORM#7

Your password: _________________________________
```

**Region:** 
- Select **`us-east-1`** (or select the region closest to you)

**Pricing Plan:** 
- Select **Free** (for now)

### A3. Review and Create
1. Review all fields are correct
2. Click the **blue "Create new project"** button
3. **IMPORTANT:** Supabase will create your database - this takes 2-3 minutes
4. You'll see a loading page with a progress indicator
5. **DO NOT CLOSE THIS PAGE** - wait for it to complete

### A4. Wait for Completion
You'll see: **"Your project is ready"** message

**SAVE THIS INFORMATION:**
```
Project Name: pivit-ecommerce
Region: [your selected region]
Database Password: [the password you created]
```

---

## PART B: Get Your Connection String (2 minutes)

### B1. Navigate to Connection Settings
1. You should be on your project dashboard
2. Look for the left sidebar menu
3. Click **"Settings"** (gear icon at bottom)
4. In the settings page, click **"Database"** on the left menu
5. You'll see several connection string options

### B2. Copy PostgreSQL Connection String
1. Find the section labeled **"Connection Strings"**
2. Look for **"PostgreSQL"** tab/option
3. You'll see a string that looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@[abc123].supabase.co:5432/postgres
```

4. **IMPORTANT:** Click the **copy icon** (or select all and copy)
5. Paste it somewhere safe - **YOU NEED THIS STRING FOR VERCEL**

**YOUR CONNECTION STRING:**
```
[PASTE IT HERE FOR REFERENCE]

_________________________________________________________________

_________________________________________________________________
```

---

## PART C: Create Database Tables (3 minutes)

### C1. Open SQL Editor
1. In Supabase dashboard, look for left menu
2. Click **"SQL Editor"** (looks like `<>` icon)
3. Click the **blue "+ New Query"** button

### C2. Copy the Migration SQL
1. In your terminal or file explorer, open:
   ```
   backend/src/migrations/001_init.sql
   ```
2. Select ALL the contents (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### C3. Paste into SQL Editor
1. Back in Supabase SQL Editor, click in the text area
2. Paste the SQL code (Ctrl+V or Cmd+V)
3. You should see a bunch of SQL commands

### C4. Run the Migration
1. Click the **blue "Run"** button (top right of the SQL editor)
2. **WAIT** - this will execute the SQL
3. You should see messages like:
   ```
   CREATE EXTENSION
   CREATE TABLE tenants
   CREATE TABLE users
   CREATE TABLE admin_users
   ...
   ```
4. At the bottom you should see: **"Finished successfully"** ✅

---

## PART D: Verify Tables Were Created (1 minute)

### D1. Check Tables Exist
1. In Supabase left menu, click **"Table Editor"**
2. You should see a list of tables on the left:
   - [ ] tenants
   - [ ] users
   - [ ] admin_users
   - [ ] products
   - [ ] customers
   - [ ] orders
   - [ ] order_items
   - [ ] payments
   - [ ] erp_sync_logs

If you see all these tables, you're done! ✅

---

## ✅ STEP 1 COMPLETE CHECKLIST

Make sure you have:

- [ ] Supabase account created
- [ ] Project "pivit-ecommerce" created
- [ ] Database password saved
- [ ] Connection string copied and saved
- [ ] SQL migration executed successfully
- [ ] All 9 tables visible in Table Editor

---

## 🔐 IMPORTANT - Save This Information

```
SUPABASE CREDENTIALS
====================
Project: pivit-ecommerce
Region: [select one]
Database Password: [your password]
Connection String: [your connection string]

KEEP THIS SAFE - YOU NEED IT FOR VERCEL!
```

---

## ⚠️ If Something Goes Wrong

**Problem: "Failed to create project"**
- Try again with a different region
- Make sure you're not creating duplicate project names

**Problem: "SQL migration failed"**
- The SQL might have been partially pasted
- Try copying the entire 001_init.sql file again
- Paste it carefully into the SQL editor
- Click Run again

**Problem: "Tables don't appear"**
- Refresh the page (Cmd+R or Ctrl+R)
- Then go back to Table Editor
- They should appear

---

## 🎉 NEXT STEP

Once you have your **CONNECTION STRING**, you're ready for:
**STEP 2: Deploy Backend to Vercel**

Ask me to help with STEP 2 when ready!
