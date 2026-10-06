# STEP 2: DEPLOY BACKEND TO VERCEL
## Complete, Detailed Instructions

**PREREQUISITE:** You must have completed STEP 1 and have your Supabase connection string saved.

---

## PART A: Create Vercel Backend Project (5 minutes)

### A1. Sign In to Vercel
1. Open browser and go to: **https://vercel.com**
2. Click **"Sign In"** (top right)
3. If you don't have an account, click **"Sign Up"** and use GitHub
4. Once logged in, you'll see the dashboard

### A2. Create New Project
1. Click **"Add New..."** button (top area)
2. From dropdown, select **"Project"**
3. You'll see a list of repositories
4. Find and click **"pivit-ecommerce"** repository

### A3. Configure the Project
You'll see a configuration screen. **IMPORTANT SETTINGS:**

**Project Name:**
- Leave as default: `pivit-ecommerce`

**Root Directory:** 
- Click the dropdown that says "Frontend" or "."
- **SELECT: `backend`** ⚠️ THIS IS CRITICAL
- It should show: `pivit-ecommerce/backend`

**Framework Preset:**
- Select: **"Other"** (since it's a Node.js Express app)

**Build Command:**
- Should be: `npm run build`

**Output Directory:**
- Should be: `dist`

**Environment Variables:**
- Leave blank for now (we'll add them next)

### A4. Deploy
1. Click the **blue "Deploy"** button
2. Wait for deployment to complete
3. You'll see a progress bar
4. The page will show deployment status
5. **Note:** First deployment might fail - that's OK, we'll fix it by adding env vars

---

## PART B: Add Environment Variables (5 minutes)

### B1. Go to Project Settings
1. After deployment, go to **Settings** (top navigation)
2. Click **"Environment Variables"** on the left menu

### B2. Add Environment Variables
For each variable below:
1. Click **"Add Environment Variable"** button
2. Enter the **Name** and **Value**
3. For **Environment**, select: **Production**
4. Click **"Save"**

**Repeat for each of these variables:**

```
NAME: DATABASE_URL
VALUE: [PASTE YOUR SUPABASE CONNECTION STRING HERE]
Example: postgresql://postgres:YourPassword@abc123.supabase.co:5432/postgres
```

```
NAME: NODE_ENV
VALUE: production
```

```
NAME: PORT
VALUE: 3001
```

```
NAME: FRONTEND_URL
VALUE: https://shop.pivitfishing.com
```

```
NAME: STRIPE_SECRET_KEY
VALUE: sk_test_51234567890
(This is a test key - it's safe to use for development)
```

```
NAME: STRIPE_PUBLIC_KEY
VALUE: pk_test_01234567890
```

```
NAME: STRIPE_WEBHOOK_SECRET
VALUE: whsec_test_01234567890
```

```
NAME: SESSION_SECRET
VALUE: [GENERATE A RANDOM STRING]

To generate, run in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Then copy the output and paste it here
```

```
NAME: JWT_SECRET
VALUE: [GENERATE ANOTHER RANDOM STRING]

Use the same command as above to generate a new one
```

```
NAME: ADMIN_EMAIL
VALUE: simplicioviegaz@gmail.com
```

```
NAME: ADMIN_FIRST_NAME
VALUE: Mario
```

```
NAME: ADMIN_LAST_NAME
VALUE: Viegas
```

```
NAME: TENANT_NAME
VALUE: PIVIT Fishing
```

```
NAME: TENANT_SLUG
VALUE: pivit-fishing
```

```
NAME: BUSINESS_NAME
VALUE: PIVIT Fishing
```

```
NAME: BUSINESS_EMAIL
VALUE: info@pivitfishing.com
```

### B3. Verify All Variables Added
Your environment variables list should show approximately 15 variables. Count them to make sure.

---

## PART C: Redeploy with Environment Variables (3 minutes)

### C1. Go to Deployments
1. Click **"Deployments"** tab (top navigation)
2. You'll see your recent deployment

### C2. Redeploy
1. Find the most recent deployment
2. Click on the **"..."** (three dots) menu
3. Select **"Redeploy"**
4. Wait for the new deployment

### C3. Wait for Success
1. You should see a new deployment starting
2. It will show "Building..." then progress
3. Wait for green checkmark ✅
4. Should take 2-3 minutes

### C4. Get Your Backend URL
1. Once deployment succeeds, you'll see your deployment URL
2. It will look like: `https://pivit-ecommerce-xyz123.vercel.app`
3. **COPY AND SAVE THIS URL** - You need it for the next step

---

## PART D: Verify Backend is Working (2 minutes)

### D1. Test the Health Endpoint
1. Take your backend URL from Part C4 (example: `https://backend-xyz.vercel.app`)
2. Open a new browser tab
3. Visit: `[YOUR_BACKEND_URL]/api/health`
4. Replace `[YOUR_BACKEND_URL]` with your actual URL

Example:
```
https://pivit-ecommerce-xyz123.vercel.app/api/health
```

### D2. Expected Response
You should see something like:
```json
{
  "status": "healthy",
  "timestamp": "2026-10-04T23:00:00Z"
}
```

If you see this, your backend is working! ✅

---

## ✅ STEP 2 COMPLETE CHECKLIST

- [ ] Vercel account created
- [ ] Backend project created with `pivit-ecommerce` repo
- [ ] Root Directory set to `backend`
- [ ] All 15 environment variables added
- [ ] Project redeployed successfully
- [ ] Backend URL obtained and saved
- [ ] Health check endpoint returns status

---

## 🔐 SAVE YOUR BACKEND URL

```
VERCEL BACKEND DEPLOYMENT
==========================
Project: pivit-ecommerce (backend)
Backend URL: https://[YOUR-URL]

KEEP THIS - YOU NEED IT FOR STEP 3!
```

---

## ⚠️ Troubleshooting

**Problem: "Deployment failed"**
- Check Vercel deployment logs (red X)
- Look for error messages
- Usually it's a missing or incorrect environment variable
- Double-check DATABASE_URL format

**Problem: "Health check returns error"**
- Verify DATABASE_URL is correct in environment variables
- Check that Supabase project is active
- Try waiting another minute and refreshing

**Problem: "Can't find my repository"**
- Make sure GitHub is connected to Vercel
- The repository must be public or you must have access
- Try going to https://vercel.com/new and reconnecting

---

## 🎉 NEXT STEP

Once you have your **BACKEND URL**, you're ready for:
**STEP 3: Configure Frontend to Use Backend**

Ask me to help with STEP 3 when ready!
