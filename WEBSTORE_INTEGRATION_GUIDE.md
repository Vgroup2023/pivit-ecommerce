# PIVIT Fishing Webstore Integration Guide
## Complete Payment & Refund Processing Setup

**Date:** October 8, 2026  
**Status:** Ready for Production  
**Architecture:** Three-Subdomain Multi-Tenant SaaS

---

## 🎯 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PIVIT FISHING ECOSYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  www.pivitfishing.com      shop.pivitfishing.com            │
│  (Lovable Marketing)       (Vercel Webstore)                │
│  ├─ Home                   ├─ Product Grid                   │
│  ├─ Features               ├─ Product Details                │
│  ├─ About/Brand            ├─ Shopping Cart                  │
│  ├─ Shop Button ──────┐    ├─ Checkout                       │
│  └─ Blog              │    └─ Order Confirmation             │
│                       │                                       │
│                       └──────────────────┐                    │
│                                          │                    │
│                     api.pivitfishing.com │                    │
│                     (Render Backend)     │                    │
│                     ├─ Payment Processing │                  │
│                     ├─ Order Management   │                  │
│                     ├─ Refund System      │                  │
│                     └─ Webhooks ◄─────────┘                  │
│                                                              │
│  AWS RDS PostgreSQL  │  Stripe  │  SendGrid (Email)          │
│  ├─ Orders          │          │  ├─ Order Confirmation    │
│  ├─ Customers       │          │  ├─ Shipping Updates      │
│  ├─ Products        │          │  └─ Refund Notices        │
│  ├─ Refunds         │          │                            │
│  └─ Notifications   │          │                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Checklist

### ✅ Already Completed
- [x] Webstore component built (Shop.tsx, Shop.css)
- [x] 8 products with images, pricing, descriptions
- [x] Shopping cart with quantity controls
- [x] Checkout form with shipping address
- [x] JSON-LD product schema for Google Rich Results
- [x] Sitemap.xml and robots.txt for SEO
- [x] Backend Stripe integration (stripeService.ts)
- [x] Refund processing system (refundService.ts)
- [x] Order management with status tracking
- [x] Payment processing routes (/api/payments)
- [x] Webhook handling for payment events
- [x] Frontend/Backend compiled and tested

### ⏳ Next Steps (This Session)
1. [ ] Configure environment variables (Stripe API keys)
2. [ ] Deploy backend updates to Render
3. [ ] Create Shop page integration on www.pivitfishing.com (Lovable)
4. [ ] Update frontend environment variables
5. [ ] Deploy frontend to Vercel
6. [ ] Test end-to-end payment flow
7. [ ] Configure Stripe webhook in dashboard
8. [ ] Test refund processing

### 📦 Future Phases
- Email notifications (SendGrid)
- Shipping rate calculation (EasyPost)
- Inventory management dashboard
- Admin refund processing UI
- Order analytics dashboard

---

## 🔧 Environment Configuration

### Backend Environment Variables (Render)

Add these to Render's Environment Variables:

```bash
# Database (Use Option A - Individual Parameters)
DATABASE_HOST=pivit-ecommerce.cgb8aegcyaun.us-east-1.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=pivit_ecommerce
DATABASE_USER=postgres
DATABASE_PASSWORD=AwsRDS2024!Fishing#Secure9

# Authentication
JWT_SECRET=<generate with: openssl rand -hex 32>
SESSION_SECRET=<generate with: openssl rand -hex 32>

# Stripe (from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_PUBLISHABLE_KEY=pk_live_... (or pk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_... (configure after webhook setup)

# Frontend Configuration
FRONTEND_URL=https://shop.pivitfishing.com
NODE_ENV=production
PORT=3000
```

### Frontend Environment Variables

**File:** `frontend/.env.production`

```bash
VITE_API_URL=https://api.your-render-url.onrender.com
```

**File:** `frontend/.env.development` (local testing)

```bash
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Deployment Steps

### Step 1: Backend Deployment (Render)

1. **Render Dashboard** → Select your backend service
2. **Environment** → Add/update environment variables above
3. **Redeploy** → Click "Redeploy" to apply changes
4. **Verify** → Check logs for successful startup:
   ```
   ✓ Environment configuration validated successfully
   ✓ Database connection established
   ✓ API running on http://localhost:3000
   ```

### Step 2: Frontend Deployment (Vercel)

1. **Git Commit & Push:**
   ```bash
   cd /home/claude/pivit-ecommerce
   git add -A
   git commit -m "feat: Add Stripe payment processing integration"
   git push origin main
   ```

2. **Vercel Dashboard** → Your frontend project
3. **Deployments** → Automatic deployment from main branch
4. **Environment** → Add `VITE_API_URL` pointing to Render backend
5. **Verify** → Shop loads at https://shop.pivitfishing.com

### Step 3: Lovable Integration (www.pivitfishing.com)

**Create/Update Shop Page in Lovable:**

```html
<!-- Shop Integration Page -->
<section class="shop-integration">
  <h1>PIVIT Fishing Shop</h1>
  <p>Browse our complete catalog of hand-crafted, lead-free fishing tackle.</p>
  
  <!-- Option A: Redirect Button (Recommended) -->
  <a href="https://shop.pivitfishing.com" class="cta-button">
    Shop Now → Visit PIVIT Fishing Store
  </a>
  
  <!-- Option B: Featured Products Preview (Links to Shop) -->
  <div class="featured-products">
    <div class="product-card">
      <img src="[product image]" alt="Trailer Jig">
      <h3>Trailer Jig – Chartreuse Craw</h3>
      <p>$14.99 - $39.99</p>
      <a href="https://shop.pivitfishing.com">View in Shop →</a>
    </div>
    <!-- Repeat for other featured products -->
  </div>
  
  <!-- Info Section -->
  <div class="shop-info">
    <h2>Why Shop PIVIT?</h2>
    <ul>
      <li>✓ Lead-free construction</li>
      <li>✓ Changeable jig hooks (TurboCAM)</li>
      <li>✓ Hand-tied quality</li>
      <li>✓ Made in Barrington, NH</li>
      <li>✓ Secure Stripe payments</li>
      <li>✓ Easy returns & refunds</li>
    </ul>
  </div>
</section>
```

---

## 💳 Stripe Payment Flow

### Customer Journey

```
1. Browse Webstore
   └─ User adds items to cart

2. Checkout
   └─ User enters shipping address & email

3. Create Order (Backend)
   └─ POST /api/orders → Creates order in database

4. Payment Intent (Stripe)
   └─ POST /api/payments/create-intent
   └─ Receives clientSecret for Stripe.js

5. Confirm Payment (Stripe)
   └─ Frontend confirms with clientSecret
   └─ User completes payment via Stripe

6. Update Order
   └─ POST /api/payments/confirm
   └─ Backend marks order as "paid"

7. Confirmation
   └─ User sees order confirmation
   └─ Email sent to customer

8. Webhook (Async)
   └─ Stripe sends payment_intent.succeeded
   └─ Backend updates order status
```

### API Endpoints

**Create Payment Intent:**
```
POST /api/payments/create-intent
Content-Type: application/json

{
  "orderId": "ORD-1696776000000",
  "amount": 199.99,
  "email": "customer@example.com"
}

Response:
{
  "clientSecret": "pi_..._secret_...",
  "paymentIntentId": "pi_...",
  "amount": 19999,
  "currency": "usd"
}
```

**Confirm Payment:**
```
POST /api/payments/confirm
Content-Type: application/json

{
  "paymentIntentId": "pi_...",
  "orderId": "ORD-1696776000000"
}

Response:
{
  "success": true,
  "message": "Payment confirmed and order updated",
  "paymentIntentId": "pi_..."
}
```

**Webhook Endpoint:**
```
POST /api/payments/webhook
Stripe-Signature: t=1234567890,v1=...

Handles:
- payment_intent.succeeded
- payment_intent.payment_failed
- charge.refunded
```

---

## 🔄 Refund Processing Flow

### Customer Request Refund

```
1. Customer submits refund request
   └─ POST /api/refunds
   └─ Reason: "Item damaged in shipment"
   └─ Refund amount: $79.99

2. System creates refund request
   └─ Status: "pending"
   └─ Awaiting admin approval

3. Admin reviews and approves
   └─ PATCH /api/refunds/:id/approve
   └─ Status: "approved"

4. Admin processes refund
   └─ POST /api/refunds/:id/process
   └─ Passes Stripe payment_intent_id
   └─ Charges customer's card (reversal)

5. Refund completed
   └─ Status: "processed"
   └─ Stripe refund_id recorded
   └─ Email confirmation sent
```

### Refund Endpoints

**Create Refund Request (Customer):**
```
POST /api/refunds
Authorization: Bearer [token]
Content-Type: application/json

{
  "orderId": 123,
  "reason": "damaged",
  "description": "Jigs arrived damaged in packaging",
  "refundAmount": 79.99
}

Response:
{
  "message": "Refund request created",
  "refund_request": {
    "id": 1,
    "order_id": 123,
    "status": "pending",
    "refund_amount": 79.99,
    "requested_at": "2026-10-08T14:23:00Z"
  }
}
```

**Admin Process Refund:**
```
POST /api/refunds/1/process
Authorization: Bearer [admin_token]
Content-Type: application/json

{
  "paymentIntentId": "pi_..."
}

Response:
{
  "message": "Refund processed successfully",
  "refund_request": {
    "id": 1,
    "status": "processed",
    "stripe_refund_id": "re_...",
    "resolved_at": "2026-10-08T14:25:00Z"
  }
}
```

---

## 🧪 Testing Checklist

### Pre-Launch Testing (Staging)

- [ ] **Order Creation**
  - Add items to cart
  - Submit checkout form
  - Verify order created in database

- [ ] **Payment Processing**
  - Use Stripe test card: `4242 4242 4242 4242`
  - Complete payment flow
  - Verify order status changes to "paid"
  - Check webhook execution in Stripe logs

- [ ] **Error Handling**
  - Test failed payment: `4000 0000 0000 0002`
  - Test declined card: `4000 0000 0000 0069`
  - Verify error messages displayed to user
  - Verify order status marked as "payment_failed"

- [ ] **Refund Processing**
  - Submit refund request for test order
  - Approve refund (admin)
  - Process refund to Stripe
  - Verify refund appears in Stripe dashboard

- [ ] **SEO & Performance**
  - Verify sitemap.xml loads
  - Verify robots.txt loads
  - Check Google Rich Results preview (JSON-LD)
  - Performance: Page load < 3 seconds

### Post-Launch Monitoring

- Monitor Stripe dashboard for transaction success rate
- Check Render logs for errors
- Monitor RDS database performance
- Set up Stripe alerts for payment failures
- Test refund flow monthly
- Review customer feedback on checkout flow

---

## 🔐 Security Checklist

- [x] HTTPS enabled (Vercel, Render)
- [x] CORS configured for shop.pivitfishing.com
- [x] Stripe API keys stored in environment (not hardcoded)
- [x] Database password in environment (not hardcoded)
- [x] Session secrets generated (32+ characters)
- [x] JWT secrets generated (32+ characters)
- [x] Input validation on all endpoints
- [x] SQL injection prevention
- [x] XSS protection headers
- [x] Webhook signature verification
- [ ] WAF enabled (optional - Cloudflare)
- [ ] Rate limiting configured (TODO)
- [ ] PCI DSS compliance (Stripe handles card data)
- [ ] GDPR compliance documented (TODO)

---

## 📞 Stripe Webhook Setup

### 1. Get Webhook Signing Secret

**Stripe Dashboard:**
1. Developers → Webhooks
2. "Add endpoint"
3. Endpoint URL: `https://api.your-render-url.onrender.com/api/payments/webhook`
4. Events: Select `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
5. Copy "Signing secret" → Add to Render `STRIPE_WEBHOOK_SECRET`

### 2. Test Webhook

```bash
# In Stripe Dashboard → Webhook → "Send test event"
# Select: payment_intent.succeeded
# Verify: Webhook executed successfully (green checkmark)
```

### 3. Monitor Webhook Deliveries

**Stripe Dashboard → Webhooks:**
- View all webhook events
- Check delivery status (200 OK = success)
- Review retry logs if delivery failed
- Re-send failed events

---

## 🆘 Troubleshooting

### Payment not processing
1. Verify `STRIPE_SECRET_KEY` in Render environment
2. Check Stripe test mode vs. live keys
3. Review Stripe dashboard for failed charges
4. Check backend logs for payment intent errors

### Webhook not firing
1. Verify webhook URL in Stripe dashboard
2. Confirm `STRIPE_WEBHOOK_SECRET` is set
3. Check Render logs for webhook requests
4. Re-send test event from Stripe dashboard

### Order not created
1. Verify backend API URL in frontend environment
2. Check frontend console for network errors
3. Review backend logs for order creation errors
4. Verify database connection in Render logs

### Refund fails
1. Verify payment_intent_id is correct (from order)
2. Confirm order status is "paid" (not already refunded)
3. Check Stripe dashboard for refund limits
4. Review backend logs for Stripe API errors

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

- **Payment Success Rate** → Target: > 98%
- **Checkout Abandonment** → Target: < 70%
- **Refund Rate** → Baseline: < 2%
- **Page Load Time** → Target: < 2 seconds
- **Error Rate** → Target: < 0.1%

### Dashboards

- **Stripe Dashboard:** Transaction volume, payment success, refunds
- **Render Dashboard:** API uptime, response times, errors
- **Vercel Dashboard:** Deployment status, page performance
- **Google Search Console:** Indexation, search traffic
- **Custom Admin Panel:** Coming in Phase 3

---

## 🎉 Go-Live Checklist

- [ ] Backend deployed to Render with updated code
- [ ] Environment variables configured (all API keys)
- [ ] Frontend deployed to Vercel with API URL
- [ ] DNS verified (shop.pivitfishing.com → Vercel)
- [ ] Stripe webhook configured and tested
- [ ] Lovable Shop page updated with link to webstore
- [ ] Test payment completed successfully
- [ ] Test refund processed successfully
- [ ] Monitoring alerts configured
- [ ] Documentation shared with team
- [ ] Support team trained on refund process
- [ ] Go live! 🚀

---

## 📞 Support & Next Steps

**For questions about:**
- **Stripe Integration:** Check Stripe docs at https://stripe.com/docs
- **Deployment:** See Render/Vercel documentation
- **Database:** AWS RDS PostgreSQL docs
- **Architecture:** Review CLAUDE.md in project root

**Next phase features:**
1. Email notifications (SendGrid)
2. Shipping rate calculation (EasyPost)
3. Admin dashboard for order/refund management
4. Customer account portal
5. Inventory management system

---

**Generated:** October 8, 2026  
**By:** Claude Haiku 4.5  
**Session:** https://claude.ai/code/session_01E9pMmSeGRyLbcKHGDkJq5r
