# Phase 1 Testing & Deployment Guide

## ✅ Phase 1 Complete: Order Storage + Customer Accounts

### What's Deployed

**New Files:**
- `db.js` — JSON database for orders, customers, licenses
- `auth.js` — Authentication with JWT tokens and password hashing
- Updated `server.js` — 8 new API endpoints

**New Endpoints:**
```
POST /api/accounts/create        → Create account
POST /api/accounts/login         → Login & get JWT
GET /api/dashboard               → View customer orders (auth required)
GET /api/orders/:orderId         → Get order details
GET /api/admin/dashboard         → Admin analytics (password required)
GET /api/admin/orders            → Admin view all orders
POST /api/checkout               → Create order + Stripe session
POST /api/webhook                → Process Stripe events
```

---

## 🧪 Testing Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Create `.env` file
```bash
cp .env.example .env
```

Edit `.env`:
```
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
DOMAIN=http://localhost:3000
PORT=3000
JWT_SECRET=test-secret-key
ADMIN_PASSWORD=test-admin-123
```

### 3. Start Server
```bash
npm start
```

Server should start at `http://localhost:3000`

---

## 📝 API Testing

### Test Account Creation
```bash
curl -X POST http://localhost:3000/api/accounts/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "steve@olddogsystems.com",
    "password": "MyPassword123",
    "name": "Steve"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "account": {
    "id": "uuid...",
    "email": "steve@olddogsystems.com",
    "name": "Steve"
  },
  "message": "Account created successfully"
}
```

---

### Test Login
```bash
curl -X POST http://localhost:3000/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "steve@olddogsystems.com",
    "password": "MyPassword123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "uuid...",
    "email": "steve@olddogsystems.com",
    "name": "Steve"
  }
}
```

Save the `token` for the next test.

---

### Test Customer Dashboard
```bash
curl http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "user": {
    "id": "uuid...",
    "email": "steve@olddogsystems.com",
    "name": "Steve"
  },
  "orders": [],
  "stats": {
    "totalPurchases": 0,
    "totalSpent": 0
  }
}
```

---

### Test Admin Dashboard
```bash
curl http://localhost:3000/api/admin/dashboard \
  -H "X-Admin-Password: test-admin-123"
```

**Expected Response:**
```json
{
  "totalOrders": 0,
  "totalRevenue": 0,
  "completedOrders": 0,
  "refundedOrders": 0,
  "uniqueCustomers": 0,
  "averageOrderValue": 0,
  "topProducts": {},
  "revenueByDate": {}
}
```

---

## 🔍 Check Database Files

After creating an account, you should see:

**Customer profile created:**
```bash
cat data/customers/steve@olddogsystems.com.json
```

**Should output:**
```json
{
  "id": "uuid...",
  "email": "steve@olddogsystems.com",
  "passwordHash": "bcrypt_hash...",
  "name": "Steve",
  "createdAt": "2026-01-27T...",
  "lastLogin": "2026-01-27T...",
  "totalSpent": 0,
  "purchaseCount": 0,
  "preferences": {
    "emailNotifications": true,
    "marketingEmails": false
  }
}
```

---

## 💳 Test Stripe Checkout Flow

### 1. Add item to cart in shop.html
- Browse shop at `http://localhost:3000/shop.html`
- Add item to cart
- Verify cart appears

### 2. Proceed to checkout
- Click "Proceed to Checkout"
- Enter test email: `test@example.com`
- Click checkout button

### 3. Verify order was created
```bash
ls data/orders/
```

Should see `order_*.json` file. Check contents:
```bash
cat data/orders/order_*.json | head -50
```

Should show:
```json
{
  "id": "order_...",
  "createdAt": "2026-01-27T...",
  "status": "pending",
  "stripeSessionId": "cs_test_...",
  "customerEmail": "test@example.com",
  "items": [...],
  "totalAmount": 9900,
  "licenseKeys": {}
}
```

### 4. Simulate Stripe webhook
After payment completes in Stripe, webhook fires and:
- Order status → `completed`
- License key → Generated automatically (if Rough Diamond Studio)

---

## 🚀 Deployment to Render.com

**Phase 1 is LIVE.** To redeploy after changes:

1. Make code changes locally
2. Run tests locally
3. Commit and push:
   ```bash
   git add .
   git commit -m "your message"
   git push https://x-access-token:TOKEN@github.com/ODS-WebRender/renderweb.git main
   ```
4. Render auto-deploys (2-3 minutes)
5. Check logs in Render dashboard

---

## 🔐 Environment Variables on Render.com

Go to Render Dashboard → Settings → Environment:

Add:
```
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
JWT_SECRET=your-long-random-secret
ADMIN_PASSWORD=your-secure-admin-password
DOMAIN=https://old-dog-systems1.onrender.com
```

---

## 📊 Data Directory Structure

After tests, you should see:

```
data/
├── orders/
│   └── order_20260127_abc123.json
├── customers/
│   └── test@example.com.json
└── licenses/
```

**Don't commit this to GitHub** (it's in `.gitignore`). This data is persistent on Render.

---

## ⚠️ Common Issues

### "Unauthorized: Invalid or missing token"
- Make sure you're passing `Authorization: Bearer TOKEN` header
- Token expires after 30 days by default

### "Account with this email already exists"
- Change test email each time
- Or delete `data/customers/email.json`

### Database files not created
- Make sure `node_modules` is installed
- Restart server after npm install

### Stripe webhook not working
- Check `STRIPE_WEBHOOK_SECRET` is set
- Verify webhook URL in Stripe dashboard matches your domain

---

## ✨ Phase 1 Summary

**Completed:**
- ✅ Order storage (JSON database)
- ✅ Customer account system
- ✅ Password hashing + JWT auth
- ✅ Automatic license key generation
- ✅ Admin analytics endpoints
- ✅ Webhook processing

**Ready for Phase 2:**
- ⏳ Customer dashboard UI
- ⏳ Admin dashboard UI
- ⏳ Email notifications (SendGrid)
- ⏳ Invoice generation (PDF)
- ⏳ Refund management

---

## 🎯 Next Steps

1. **Test Phase 1 locally** — Follow tests above
2. **Verify on Render.com** — Check environment variables are set
3. **Make test purchase** — Use Stripe test card `4242 4242 4242 4242`
4. **Confirm order created** — Check admin dashboard
5. **Ready for Phase 2** — Dashboard UIs + email system

Questions? Check `server.js`, `db.js`, and `auth.js` comments.
