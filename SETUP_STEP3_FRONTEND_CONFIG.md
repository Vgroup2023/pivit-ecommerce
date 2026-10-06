# STEP 3: UPDATE FRONTEND & DEPLOY
## Complete, Detailed Instructions

**PREREQUISITE:** You must have completed STEP 2 and have your **Backend URL** saved.

---

## PART A: Update Frontend Configuration (3 minutes)

### A1. Go to Frontend Project in Vercel
1. Open browser and go to: **https://vercel.com/dashboard**
2. You should see multiple projects
3. Click on: **`pivit-ecommerce`** (this is the frontend - should say "shop.pivitfishing.com")

### A2. Open Settings
1. Click **"Settings"** (top navigation)
2. Click **"Environment Variables"** (left menu)

### A3. Add or Update API URL
1. Look for a variable named: **`VITE_API_URL`**

**If it exists:**
- Click the **edit (pencil) icon**
- Change the value to your backend URL from STEP 2
- Example: `https://pivit-ecommerce-xyz123.vercel.app`
- Click **"Save"**

**If it doesn't exist:**
- Click **"Add Environment Variable"**
- Name: `VITE_API_URL`
- Value: [YOUR BACKEND URL FROM STEP 2]
- Environment: Select **"Production"**
- Click **"Save"**

---

## PART B: Redeploy Frontend (3 minutes)

### B1. Go to Deployments
1. Click **"Deployments"** tab
2. You'll see recent deployments

### B2. Redeploy
1. Find the most recent deployment
2. Click the **"..."** (three dots)
3. Select **"Redeploy"**

### B3. Wait for Completion
1. You'll see "Building..." 
2. Wait for green checkmark ✅
3. Takes 2-3 minutes

### B4. Note the Frontend URL
Your frontend URL is the default shown:
```
https://shop.pivitfishing.com
```

---

## PART C: Test the Frontend (1 minute)

### C1. Open Frontend in Browser
1. Go to: **https://shop.pivitfishing.com**
2. You should see the home page loading
3. **If you see an error page**, don't worry - that might be caching
4. Try:
   - Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
   - Or wait 30 seconds and refresh again

### C2. Check Admin Page
1. Try to visit: **https://shop.pivitfishing.com/admin**
2. You should now see a **Login Page** instead of 404! ✅
3. If you see a login form, the routing is working!

---

## ✅ STEP 3 COMPLETE CHECKLIST

- [ ] Found frontend project in Vercel
- [ ] Updated or created VITE_API_URL variable
- [ ] Set it to your backend URL
- [ ] Redeployed frontend successfully
- [ ] Frontend loads without 404 errors
- [ ] Login page is accessible

---

## 🎉 NEXT STEP

You're almost there! Now you need to:
**STEP 4: Initialize Database with Admin User**

This final step creates your admin account so you can login.

Ask me to help with STEP 4 when ready!
