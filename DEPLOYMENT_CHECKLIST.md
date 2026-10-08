# PIVIT Fishing - Phase 2 Deployment Checklist

**Started:** 2026-10-07  
**Status:** In Progress  
**Owner:** Mario Viegas

---

## ✅ Phase 1: Foundation (COMPLETE)

- [x] TypeScript compilation fixed (type casting for session properties)
- [x] Backend builds successfully: `npm run build`
- [x] Auth middleware updated with proper type safety
- [x] Environment variables configured

---

## 🔧 Phase 2: Database & Deployment (IN PROGRESS)

### Step 1: Verify RDS Password Reset
- [ ] **AWS Console → RDS → pivit-ecommerce**
  - [ ] Click "Modify"
  - [ ] Update Master password to: `PivitFishing2026!Secure`
  - [ ] Check "Apply immediately"
  - [ ] Wait for instance to reboot (status: "Available")
  
- [ ] **Test connection locally:**
  ```bash
  cd backend
  node test-db.js
  ```
  - Expected: ✅ Connection Successful!

### Step 2: Update Render Environment Variables
- [ ] **Render Dashboard → Select API Service → Environment**
  - [ ] DATABASE_HOST, PORT, NAME, USER, PASSWORD (as in .env)
  - [ ] JWT_SECRET, STRIPE_SECRET_KEY, NODE_ENV

- [ ] **Render Dashboard → Re-deploy**
  - [ ] Click "Deploy"
  - [ ] Wait for deployment (5-10 minutes)

### Step 3: Verify Backend Health
- [ ] Test: `curl https://api-pivit.onrender.com/health`

---

## 🌐 Phase 3: DNS Configuration

### Step 4: Add CNAME Records in Registrar

| Name | Type | Value |
|------|------|-------|
| www | CNAME | cname.lovable.app |
| store | CNAME | cname.vercel.com |
| api | CNAME | api-pivit.onrender.com |

### Step 5: Verify DNS (5-15 minutes)
```bash
nslookup www.pivitfishing.com
nslookup store.pivitfishing.com
nslookup api.pivitfishing.com
```

---

## 🚀 Phase 4: Frontend Deployment

### Step 6: Vercel Setup
- [ ] Add domain: `store.pivitfishing.com`
- [ ] Set `VITE_API_URL=https://api.pivitfishing.com`
- [ ] Deploy

### Step 7: Lovable Setup
- [ ] Add custom domain: `www.pivitfishing.com`

---

## ✨ Phase 5: Final Testing

- [ ] https://www.pivitfishing.com (Landing)
- [ ] https://store.pivitfishing.com (Store)
- [ ] https://api.pivitfishing.com/health (API)
- [ ] Test login/register flow
- [ ] Test products endpoint

---

**Last Updated:** 2026-10-07
