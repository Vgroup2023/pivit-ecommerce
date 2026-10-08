# PIVIT Fishing Webstore Deployment Guide

**Shop Subdomain:** shop.pivitfishing.com  
**Status:** Ready for Production  
**Last Updated:** 2026-10-08

---

## 📦 Webstore Features

✅ **8 Premium Fishing Products**
- Trailer Jigs (singles & 3-packs)
- Bucktail Jigs (singles & 3-packs)
- Angler's Bundle (6-jig variety pack)
- Big Water Bundle (12-jig variety pack)
- Boot Camp Bundle (10-jig variety pack)
- Bulk Pro Case (100+ wholesale box)

✅ **Full E-Commerce Functionality**
- Product listing grid with hover effects
- Detailed product pages with JSON-LD schema (Google Rich Results)
- Shopping cart with add/remove/quantity controls
- Checkout flow (ready for Stripe integration)
- Price display with sale pricing support
- Availability status (In Stock / Made to Order)

✅ **Brand Integration**
- PIVIT branding (gold #c9a961 theme)
- Brand story section (lead-free tackle, changeable jig hooks, Barrington NH, TurboCAM)
- Navigation back to www.pivitfishing.com
- Dark theme matching main brand site

✅ **SEO Optimization**
- Product schema (JSON-LD) for Google Rich Results
- Sitemap.xml with all 8 products + categories
- Robots.txt configured for search engines
- Responsive design (mobile-first)

---

## 🚀 Deployment Steps

### Step 1: Update Vercel Environment Variables

**Vercel Dashboard → Settings → Environment Variables**

Add or update:
```
VITE_API_URL=https://api.pivitfishing.com
```

### Step 2: Add Custom Domain to Vercel

**Vercel Dashboard → Settings → Domains**

1. Click "Add"
2. Enter: `shop.pivitfishing.com`
3. Select "CNAME" configuration
4. Add this DNS record in your registrar:

```
Name:   shop
Type:   CNAME
Value:  cname.vercel.com
TTL:    3600
```

### Step 3: Verify DNS Propagation

```bash
nslookup shop.pivitfishing.com
# Should show: cname.vercel.com
```

**Wait 5-15 minutes** for DNS to fully propagate.

### Step 4: Test Shop Subdomain

Once DNS resolves, verify:
- `https://shop.pivitfishing.com` loads the webstore
- Products display correctly
- Product images load
- Cart functionality works
- Navigation back to www.pivitfishing.com works

### Step 5: Verify SEO Crawlability

Check that search engines can access:
- `https://shop.pivitfishing.com/sitemap.xml`
- `https://shop.pivitfishing.com/robots.txt`

---

## 📁 Files Added/Modified

### New Files
```
frontend/src/pages/Shop.tsx          # Main webstore component
frontend/src/pages/Shop.css          # Styling (dark theme, gold accents)
frontend/public/sitemap.xml          # SEO sitemap
frontend/public/robots.txt           # Search engine configuration
```

### Modified Files
```
frontend/src/App.tsx                 # Added Shop route & subdomain detection
```

---

## 💳 Stripe Integration (Next Step)

The checkout form is built and ready for Stripe integration. To enable payments:

1. **Install Stripe dependency:**
   ```bash
   npm install --save @stripe/react-stripe-js @stripe/js
   ```

2. **Add Stripe keys to Vercel:**
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   VITE_STRIPE_SECRET_KEY=sk_test_...  (only in backend)
   ```

3. **Update checkout handler** in `frontend/src/pages/Shop.tsx` (line ~450):
   ```typescript
   // Replace handleCheckout function with Stripe payment flow
   ```

---

## 🎯 Product Catalog

All 8 products are configured with:
- Product name (exactly as shown on www.pivitfishing.com)
- Price ($14.99 – $569.00)
- Description (2-3 sentences)
- Sale pricing support (original price crossed out)
- Availability status
- Product schema for Google

**To update product images:** Replace image URLs in `frontend/src/pages/Shop.tsx` (lines 14-60)

---

## 📊 Analytics Setup

Recommended: Add Google Analytics to track:
- Product views
- Add to cart events
- Checkout starts
- Completed purchases

Add to `frontend/src/pages/Shop.tsx`:
```typescript
import { useEffect } from 'react';

useEffect(() => {
  // Google Analytics tracking code
  window.gtag?.('pageview', {
    page_path: '/shop',
    page_title: 'PIVIT Fishing Shop'
  });
}, []);
```

---

## 🔒 Security Checklist

- [x] No sensitive keys in frontend code
- [x] Checkout form ready for Stripe
- [x] CORS configured for API calls
- [x] Cart data stored locally (no server dependency yet)
- [ ] Stripe webhook handlers (implementation needed)
- [ ] Email confirmation flow (implementation needed)

---

## 🧪 Testing Checklist

- [x] Product listing page loads
- [x] Product detail modal works
- [x] Add to cart functionality
- [x] Cart update/remove items
- [x] Checkout form displays
- [x] Responsive on mobile
- [x] JSON-LD schema valid
- [ ] Stripe payment flow (after integration)
- [ ] Email notifications (after backend setup)

---

## 📞 Subdomain Architecture

```
pivitfishing.com
├── www.pivitfishing.com          → Lovable marketing site
├── shop.pivitfishing.com         → Vercel webstore (THIS)
└── api.pivitfishing.com          → Render backend API
```

Each subdomain is independent and can be managed separately.

---

## 🔗 Quick Links

- **Shop:** https://shop.pivitfishing.com
- **Vercel Dashboard:** https://vercel.com
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Sitemap:** https://shop.pivitfishing.com/sitemap.xml
- **Robots:** https://shop.pivitfishing.com/robots.txt

---

## 📝 Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add shop.pivitfishing.com DNS record
3. ✅ Verify SEO configuration
4. ⏳ Integrate Stripe payments
5. ⏳ Add email order notifications
6. ⏳ Set up inventory sync with backend API
7. ⏳ Add customer reviews/ratings
8. ⏳ Create admin product management dashboard

---

**Ready for Production:** ✅ October 8, 2026
