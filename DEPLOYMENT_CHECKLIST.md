# PIVIT Fishing E-Commerce - Deployment Checklist & Runbook

**Last Updated:** 2026-10-06  
**Status:** Production Ready

---

## 📋 Pre-Deployment Checklist

### Code Readiness
- [ ] All changes committed to `main` branch
- [ ] `git log --oneline -5` shows clean, descriptive commit messages
- [ ] No uncommitted changes: `git status` is clean
- [ ] All tests pass (if applicable): `npm test`
- [ ] TypeScript compilation succeeds: `npm run build` in both `backend/` and `frontend/`
- [ ] No ESLint errors (if linting configured)

### Configuration Readiness
- [ ] **Backend (.env or Render environment variables):**
  - [ ] `DATABASE_HOST` or `DATABASE_URL` is set correctly
  - [ ] `DATABASE_PASSWORD` contains special characters? If so, use Option A (individual parameters)
  - [ ] `JWT_SECRET` is set and >= 32 characters
  - [ ] `SESSION_SECRET` is set and >= 32 characters
  - [ ] `STRIPE_SECRET_KEY` is set
  - [ ] `STRIPE_PUBLISHABLE_KEY` is set
  - [ ] `STRIPE_WEBHOOK_SECRET` is set
  - [ ] `FRONTEND_URL` matches your Vercel deployment URL
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001` (or your desired port)
  - [ ] `REDIS_URL` is configured (recommended for production)

- [ ] **Frontend (.env.local or Vercel environment variables):**
  - [ ] `VITE_API_URL` points to your Render backend URL
  - [ ] No hardcoded localhost URLs

### Dependencies
- [ ] Backend dependencies are up to date: `cd backend && npm install`
- [ ] Frontend dependencies are up to date: `cd frontend && npm install`
- [ ] No critical security vulnerabilities: `npm audit`
- [ ] Lock files are committed (`package-lock.json`)

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend to Render

#### 1a. Verify Render Configuration
1. Go to https://render.com/dashboard
2. Select your "pivit-ecommerce-api" service
3. Go to **Settings** and verify:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`
   - **Environment:** Node
   - **Region:** US East (or your preference)

#### 1b. Set Environment Variables in Render
1. In service settings, go to **Environment**
2. Click **Add Environment Variable** for each:
   ```
   DATABASE_HOST = pivit-ecommerce.cgb8aegcyaun.us-east-1.rds.amazonaws.com
   DATABASE_PORT = 5432
   DATABASE_NAME = pivit_ecommerce
   DATABASE_USER = postgres
   DATABASE_PASSWORD = AwsRDS2024!Fishing#Secure9
   JWT_SECRET = <generate: openssl rand -hex 32>
   SESSION_SECRET = <generate: openssl rand -hex 32>
   STRIPE_SECRET_KEY = sk_live_... (from Stripe dashboard)
   STRIPE_PUBLISHABLE_KEY = pk_live_... (from Stripe dashboard)
   FRONTEND_URL = https://your-vercel-deployment.vercel.app
   NODE_ENV = production
   PORT = 3001
   ```

3. **Critical Configuration:**
   - `JWT_SECRET` & `SESSION_SECRET` must be 32+ random hex characters (generate with `openssl rand -hex 32`)
   - `STRIPE_SECRET_KEY` starts with `sk_live_` or `sk_test_` (from https://dashboard.stripe.com/apikeys)
   - `STRIPE_PUBLISHABLE_KEY` starts with `pk_live_` or `pk_test_` (from same Stripe page)
   - `FRONTEND_URL` must match your Vercel deployment URL exactly (for CORS)
   - **DO NOT use DATABASE_URL with special characters** - use individual parameters instead

4. **After setting all variables, Save and wait for auto-redeploy (2-3 minutes)**
   - Check logs for: ✅ "Environment configuration validated successfully"

#### 1c. Deploy Backend
```bash
# Option A: Via Git Push
git push render main

# Option B: Via Render Dashboard
# Go to Deployments → Click "Deploy latest commit"
```

#### 1d. Monitor Backend Deployment
1. Watch logs in Render dashboard
2. Look for: "✅ Environment configuration validated successfully"
3. Look for: "✓ Database: PostgreSQL..." (indicates successful DB connection)
4. If errors appear, check `.env` configuration first

#### 1e. Test Backend Health Check
```bash
curl https://your-render-url.render.com/api/health
# Should return detailed JSON with status: "healthy"

curl https://your-render-url.render.com/api/health/ready
# Should return {"status":"ready"}
```

---

### Step 2: Deploy Frontend to Vercel

#### 2a. Configure Vercel Deployment
1. Go to https://vercel.com/dashboard
2. Select your "pivit-ecommerce-frontend" project
3. Go to **Settings → Environment Variables**
4. Add:
   ```
   VITE_API_URL = https://your-render-url.render.com
   ```
   - Make sure visibility is set to "All Environments"

#### 2b. Deploy Frontend
```bash
# Option A: Automatic via Git
# Push to main branch - Vercel auto-deploys

# Option B: Manual Deploy
git push origin main
# Check Vercel dashboard for deployment status
```

#### 2c: Monitor Frontend Deployment
1. Watch deployment logs in Vercel dashboard
2. Look for successful build completion
3. Verify build output includes `/dist` directory

#### 2d: Test Frontend
1. Visit your Vercel deployment URL
2. Navigate to login page
3. Check browser console for errors (F12)
4. Verify API calls go to Render backend (Network tab)

---

### Step 3: Post-Deployment Verification

#### 3a: API Endpoints
```bash
# Health check endpoint
curl https://your-render-url/api/health | jq .

# Should show:
# {
#   "status": "healthy",
#   "checks": {
#     "api": { "status": "healthy", "latency": 1 },
#     "database": { "status": "healthy", "latency": 245 },
#     "redis": { "status": "healthy" OR "configured" }
#   }
# }
```

#### 3b: Frontend Functionality
- [ ] Can load homepage
- [ ] Can navigate to login page
- [ ] Can see Stripe payment fields (if they render)
- [ ] Can inspect Network tab and see API calls to backend
- [ ] No CORS errors in console

#### 3c: Database Connectivity
Test via backend API:
```bash
curl -X GET https://your-render-url/api/health | jq '.checks.database'
# Should show: { "status": "healthy", "latency": <number> }
```

#### 3d: Authentication Flow
```bash
# Test registration
curl -X POST https://your-render-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'

# Test login
curl -X POST https://your-render-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456"}'
```

---

## 🐛 Common Deployment Issues & Fixes

### Issue 1: "❌ DATABASE_URL format invalid"
**Cause:** DATABASE_URL missing `postgresql://` prefix or contains unencoded special characters  
**Fix:** Use Option A (individual DATABASE_* variables) instead of DATABASE_URL  
**Prevention:** Keep passwords simple or use URL encoding in DATABASE_URL

### Issue 2: "Redis Client Error ECONNREFUSED"
**Cause:** REDIS_URL set but Redis server not accessible  
**Fix:** Either:
- Remove REDIS_URL - app will use in-memory sessions
- Ensure Redis is running and accessible
- Check network connectivity to Redis host
**Prevention:** Make REDIS_URL optional; app should gracefully degrade without it

### Issue 3: "tsc: command not found"
**Cause:** TypeScript devDependencies not installed in build environment  
**Fix:** Ensure `prebuild` script runs before build (in root package.json)  
**Prevention:** Always include `prebuild` hook to install devDependencies

### Issue 4: CORS errors in frontend
**Cause:** FRONTEND_URL doesn't match Vercel deployment URL  
**Fix:** Update FRONTEND_URL in Render environment to exact Vercel URL (including https://)  
**Prevention:** Test CORS after any domain/URL changes

### Issue 5: "Cannot find module" errors at startup
**Cause:** Compiled JavaScript (dist/) out of sync with TypeScript source  
**Fix:** Clear dist/ and rebuild:
```bash
cd backend
rm -rf dist/
npm run build
```

---

## 📊 Monitoring Post-Deployment

### Health Checks
**Configure monitoring to call regularly:**
```
GET /api/health/live       # Every 10 seconds (liveness)
GET /api/health/ready      # Every 30 seconds (readiness)
GET /api/health            # Every 5 minutes (comprehensive)
```

### Logs to Monitor
- **Render Logs:** https://render.com/dashboard (select service → Logs)
- **Vercel Logs:** https://vercel.com/dashboard (select project → Deployments → Logs)
- Look for errors containing "ERROR", "FAIL", or "Exception"

### Key Metrics
- **Response Times:** API latency should be < 500ms
- **Database Latency:** Should be < 300ms from Render
- **Error Rate:** Should be < 1% of requests
- **Uptime:** Should be 99.9%+

---

## 🔄 Rollback Procedure

### If deployment fails:

**Render Backend:**
1. Go to Render dashboard → Select service → Deployments
2. Find last successful deployment
3. Click "Rollback" button
4. Wait for rollback to complete
5. Verify health check passes

**Vercel Frontend:**
1. Go to Vercel dashboard → Select project → Deployments
2. Find last successful deployment
3. Click three dots → Promote to Production
4. Verify site loads and API calls work

---

## 🔐 Production Security Checklist

- [ ] All secrets stored in environment variables (not in code)
- [ ] HTTPS enabled (automatic with Render/Vercel)
- [ ] Security headers configured (HSTS, CSP, X-Frame-Options)
- [ ] JWT secrets are strong and random (32+ characters)
- [ ] Database password doesn't appear in logs or error messages
- [ ] CORS limited to specific frontend URL (not wildcard)
- [ ] Database backups configured (AWS RDS automatic backups)
- [ ] Monitoring/alerting configured for downtime
- [ ] Rate limiting implemented on sensitive endpoints (optional)
- [ ] API keys rotated periodically (Stripe, ERP, etc.)

---

## 📞 Support & Debugging

### Get Render Backend URL
```bash
# From Render dashboard → Service → Settings
# URL format: https://your-service-name.render.com
```

### Get Vercel Frontend URL
```bash
# From Vercel dashboard → Project → Deployments
# URL format: https://your-project-name.vercel.app
```

### View Backend Logs
```bash
# Real-time:
# Render dashboard → Service name → Logs (stream)

# Or via terminal (if Render CLI installed):
render logs --follow
```

### View Frontend Logs
```bash
# Vercel dashboard → Project → Deployments → Select deployment → Logs
```

### Quick Diagnostics
```bash
# Check if backend is running
curl https://your-render-url/api/health

# Check if frontend is serving
curl https://your-vercel-url

# Test database connection from backend
curl https://your-render-url/api/health | jq '.checks.database'

# Test CORS configuration
curl -H "Origin: https://your-vercel-url" https://your-render-url/api/health -v
```

---

## 📝 Deployment Record

Keep track of deployments:

| Date | Backend Commit | Frontend Commit | Status | Notes |
|------|---|---|---|---|
| 2026-10-06 | 227e279 | 52f1646 | ✅ Complete | Environment validation implemented |
| | | | | Redis optional, security headers added |

---

## Next Steps

1. **Before each deployment:**
   - Review this checklist
   - Run tests locally
   - Verify environment variables

2. **After each deployment:**
   - Test health endpoints
   - Verify auth flow works
   - Check logs for errors
   - Monitor for 1 hour

3. **Regular maintenance:**
   - Review logs weekly for errors
   - Update dependencies monthly
   - Rotate secrets quarterly
   - Review security settings quarterly
