# Phase 3: Payment Processing, License Delivery & Order Fulfillment

**Status:** Ready for implementation  
**Timeline:** 2-3 hours  
**Target Markets:** USA, UK (with future RSA support)

---

## Executive Summary

Phase 3 wires the shop to a robust payment system with order confirmation, license key delivery, and invoice generation. We use **Stripe** for USA/UK markets (recommended) with Lemon Squeezy as a fallback option.

### Why Stripe for Your Markets?
- **US/UK Expansion:** Stripe fully supports both markets with no ID verification barriers
- **Enterprise-Grade:** Used by Fortune 500 companies, supports recurring billing
- **Webhook Security:** cryptographically signed events, production-ready
- **Global:** 135+ currencies, 100+ payment methods
- **RSA Later:** Can add Lemon Squeezy for South African customers once ID verification is resolved

### Why NOT Lemon Squeezy for RSA?
Lemon Squeezy is Stripe-backed but adds an ID verification layer for sellers in RSA that makes it difficult to initially prove business legitimacy (chicken-and-egg problem). Better to:
1. Start with Stripe (USA/UK focused)
2. Build sales history and proof of business
3. Apply for Lemon Squeezy as RSA seller later

---

## Part 1: Stripe Setup (20 minutes)

### 1.1 Create Stripe Account
```bash
# Go to https://stripe.com
# Sign up → Business details → Verify identity
# You'll get into the dashboard immediately (not delayed like Lemon Squeezy)
```

### 1.2 Get API Keys
From **Stripe Dashboard → Developers → API Keys**:

**Test Mode (for development):**
- Publishable Key (starts with `pk_test_...`)
- Secret Key (starts with `sk_test_...`)

**Live Mode (for production):**
- Only available after identity verification (happens instantly for USA/UK)
- Same format, starts with `pk_live_...` and `sk_live_...`

### 1.3 Create Webhook Endpoint
1. Go to **Developers → Webhooks**
2. Add endpoint:
   - **URL:** `https://your-domain.onrender.com/api/webhook`
   - **Events:** 
     - `checkout.session.completed` ✓
     - `charge.refunded` ✓
     - `customer.subscription.deleted` ✓
3. Copy the webhook signing secret (`whsec_...`)

### 1.4 Test Stripe Mode
```bash
# In browser console, test these card numbers:
✓ Success:    4242 4242 4242 4242 (any future exp/CVC)
✗ Decline:    4000 0000 0000 0002
✗ Auth Error: 4000 0202 0000 0000
```

---

## Part 2: Environment Configuration (10 minutes)

### 2.1 Update .env File

```bash
# Payment Processing
STRIPE_SECRET_KEY=sk_test_xxxxx_or_sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx_or_pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Email Delivery
SENDGRID_API_KEY=SG.xxxxx  # Get from sendgrid.com
SENDER_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=you@yourdomain.com

# Deployment
DOMAIN=https://your-domain.onrender.com
PORT=3000

# Admin
ADMIN_PASSWORD=set-a-secure-password

# Optional: Lemon Squeezy (for future RSA support)
LEMON_SQUEEZY_STORE_ID=
LEMON_SQUEEZY_API_KEY=
```

### 2.2 Get SendGrid API Key (5 minutes)
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account (free tier: 100 emails/day)
3. In **Settings → API Keys**, create new key
4. Copy the key starting with `SG.`

### 2.3 Deploy to Render
```bash
# Push changes with updated .env vars
git add .
git commit -m "Phase 3: Payment system configuration"
git push origin main

# In Render dashboard:
# 1. Go to your service
# 2. Settings → Environment
# 3. Add/update all variables above
# 4. Click "Save" (auto-redeploys)
```

---

## Part 3: Payment Flow (20 minutes of testing)

### 3.1 Frontend Cart Flow
**File:** `shop.html`

Current flow:
1. Customer adds products to cart (localStorage)
2. Views cart with running total
3. Clicks "Proceed to Checkout"
4. Enters email via prompt
5. Frontend calls `POST /api/checkout`
6. Backend returns `checkoutUrl`
7. Redirects to Stripe checkout
8. Customer completes payment
9. Stripe sends webhook
10. Order created, license generated, email sent
11. Customer redirected to success page

### 3.2 Backend Checkout Endpoint
**File:** `server.js` → `POST /api/checkout`

What it does:
```javascript
// 1. Validates cart items & email
// 2. Converts items to Stripe line items
// 3. Creates Stripe checkout session
// 4. Creates order in database (status: pending)
// 5. Returns checkout URL
```

### 3.3 Webhook Handler
**File:** `server.js` → `POST /api/webhook`

Events handled:
```javascript
✓ checkout.session.completed
  ├─ Mark order as completed
  ├─ Generate license keys (per product)
  ├─ Generate PDF invoice
  ├─ Send order confirmation email
  ├─ Send license key emails
  └─ Send admin notification

✓ charge.refunded
  ├─ Mark order as refunded
  └─ Send refund notification email
```

---

## Part 4: License Key System (15 minutes)

### 4.1 How License Keys Are Generated

**Database:** `data/licenses/{licenseKey}.json`

```json
{
  "key": "RDS-2026-03-07-ABC123XYZ",
  "productId": "rough-diamond-studio-alpha",
  "orderId": "order_1234567890_abc",
  "customerEmail": "user@example.com",
  "createdAt": "2026-03-07T10:30:00Z",
  "expiresAt": null,  // null = lifetime
  "status": "active",
  "activationCount": 0
}
```

### 4.2 License Key Format
```
[PRODUCT_CODE]-[YEAR]-[MONTH]-[DAY]-[RANDOM_STRING]
Examples:
- RDS-2026-03-07-A1B2C3D4E5F6G7H8
- PROPAIPRO-2026-03-07-X9Y8Z7W6V5U4T3S2
- BUILDENAV-2026-03-07-H1G2F3E4D5C6B7A8
```

### 4.3 License Delivery Email

Customer receives email with:
- License key (clearly displayed)
- Activation instructions
- Support contact
- License terms (lifetime vs. subscription)

**Example email:**
```
Subject: Your Rough Diamond Studio License Key

Your purchase is confirmed! Here's your lifetime license:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
License Key: RDS-2026-03-07-A1B2C3D4E5F6G7H8
Product: Rough Diamond Studio — Alpha Access
Status: Active (Lifetime)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**How to Activate:**
1. Go to studio.html
2. Click "Activate License"
3. Enter your email and license key
4. Full access unlocked!

Questions? support@olddogsystems.com
```

---

## Part 5: Email Configuration (10 minutes)

### 5.1 Email Templates in Use

**File:** `email.js`

Templates:
1. `sendOrderConfirmation()` - Order receipt + items + total
2. `sendLicenseKey()` - License key delivery
3. `sendAdminNotification()` - Alert admin of new order
4. `sendRefundNotification()` - Notify customer of refund
5. `sendVerificationEmail()` - Email verification code

### 5.2 Test Email Sending

```bash
# Server logs should show:
[2026-03-07T10:35:22Z] Email sent to customer@example.com
[2026-03-07T10:35:23Z] License email sent to customer@example.com
[2026-03-07T10:35:24Z] Admin notification sent to admin@yourdomain.com

# Check SendGrid dashboard to verify delivery
```

---

## Part 6: Order Confirmation Emails (Enhanced)

### 6.1 Email Sent Immediately After Payment

The webhook handler sends:

**1. Order Confirmation (to customer)**
- Order ID
- Items purchased with prices
- Total amount paid
- License keys (if applicable)
- Download links (if applicable)

**2. Admin Notification (to you)**
- New order alert
- Customer email
- Total revenue
- Quick dashboard link

**3. License Key Email (to customer)**
- Prominent license key display
- Activation instructions
- Support contact

### 6.2 Email Delivery Timeline

```
T+0s   → Payment completed
T+1s   → Order status updated
T+2s   → License keys generated
T+3s   → PDF invoice generated
T+4s   → Order confirmation email sent
T+5s   → License key email sent
T+6s   → Admin notification email sent
T+10s  → All complete, webhook returns 200 ✓
```

---

## Part 7: Testing Checklist (30 minutes)

### 7.1 Unit Tests - API Endpoints

```bash
# 1. Test product listing
curl http://localhost:3000/api/products
# Should return: { metadata, products: [...] }

# 2. Test single product
curl http://localhost:3000/api/products/rough-diamond-studio-alpha
# Should return: { id, name, price, description, ... }

# 3. Test checkout
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "rough-diamond-studio-alpha", "name": "...", "price": 9900, "quantity": 1}],
    "customerEmail": "test@example.com"
  }'
# Should return: { checkoutUrl: "https://checkout.stripe.com/...", orderId: "..." }
```

### 7.2 Integration Test - Full Purchase Flow

**In Test Mode (Stripe):**

1. Open shop.html
2. Add product to cart
3. Click "Proceed to Checkout"
4. Enter `test@example.com`
5. Use card: `4242 4242 4242 4242` | `12/26` | `123`
6. Complete payment
7. View checkout-success.html
8. Check email for confirmation

**Expected Results:**
- ✓ Order created in `data/orders/`
- ✓ License key generated in `data/licenses/`
- ✓ Invoice generated in `data/invoices/`
- ✓ Confirmation email sent (check SendGrid dashboard)
- ✓ License key email sent
- ✓ Admin notification sent

### 7.3 Error Handling Tests

**Invalid Email:**
```bash
# Test should show: "Valid email required"
curl -X POST http://localhost:3000/api/checkout \
  -d '{"items": [...], "customerEmail": "not-an-email"}'
```

**Empty Cart:**
```bash
# Test should show: "No items in cart"
curl -X POST http://localhost:3000/api/checkout \
  -d '{"items": [], "customerEmail": "test@example.com"}'
```

**Missing API Key:**
```bash
# When STRIPE_SECRET_KEY not set, should fail gracefully
# Error: "Payment system not configured"
```

### 7.4 Webhook Security Test

Stripe includes signature verification:
```javascript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  JSON.stringify(body),
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
// If signature invalid: throws error, returns 403
```

---

## Part 8: Payment Provider Comparison

### Stripe vs Lemon Squeezy

| Feature | Stripe | Lemon Squeezy |
|---------|--------|---------------|
| **Setup Time** | 5 min | 15 min |
| **USA/UK** | ✓ Instant | ✓ Yes |
| **RSA** | ✓ Yes | ⚠️ ID barrier |
| **Fee** | 2.9% + $0.30 | 4.5% (incl. Stripe) |
| **Webhooks** | ✓ Secure | ✓ Yes |
| **Multiple Revenue Streams** | ✓ Yes | ⚠️ Limited |
| **Subscription Billing** | ✓ Advanced | ✓ Basic |
| **License Keys** | Manual | Native |

### Recommendation

**For USA/UK Launch:** Use Stripe
- Faster setup
- Better established
- Full webhook support already implemented
- Can add Lemon Squeezy later for RSA customers

**Future Addition:** Add Lemon Squeezy
- Once RSA ID verification resolved
- Keep existing Stripe infrastructure
- Route RSA customers through different payment path

---

## Part 9: Troubleshooting

### Issue: Webhook Not Firing

**Cause:** Webhook URL not registered or signature mismatch

**Solution:**
1. Check Stripe dashboard → Webhooks → Endpoint shows ✓
2. Verify `STRIPE_WEBHOOK_SECRET=whsec_...` in .env
3. Check server logs for webhook receipt
4. Resend test webhook from Stripe dashboard

### Issue: Email Not Sending

**Cause:** SendGrid API key not set or email quota exceeded

**Solution:**
1. Verify `SENDGRID_API_KEY=SG....` in .env
2. Check SendGrid dashboard → Email Activity
3. Free tier allows 100 emails/day
4. Upgrade tier if needed

### Issue: License Key Not Generated

**Cause:** Product not in license allowlist

**Solution:**
1. In `server.js` webhook handler, line ~530:
   ```javascript
   if (item.id === 'rough-diamond-studio-alpha') {
     // Only generates for this product currently
   }
   ```
2. Add more products:
   ```javascript
   const licensedProducts = [
     'rough-diamond-studio-alpha',
     'bop-journal-founders',
     'rds-standard-templates'
   ];
   
   if (licensedProducts.includes(item.id)) {
     const license = db.createLicense(...);
     // ...
   }
   ```

### Issue: Invoice Not Generating

**Cause:** PDFKit dependency issue or file permissions

**Solution:**
1. Verify PDFKit installed: `npm list pdfkit`
2. Check `data/invoices/` directory exists
3. Ensure write permissions: `chmod 755 data/invoices/`

---

## Part 10: Going Live (Safety Checklist)

Before switching to Stripe LIVE mode:

- [ ] All environment variables set in Render dashboard
- [ ] Test mode purchases working end-to-end
- [ ] Emails being delivered correctly
- [ ] License keys generating and formatting correctly
- [ ] Webhook signature validation working
- [ ] Admin email receiving notifications
- [ ] Refund flow tested (if applicable)
- [ ] Terms of Service visible on shop

### Switch to Live Mode

```bash
# 1. Get Live API keys from Stripe dashboard
# 2. Update .env with live keys (starts with pk_live_, sk_live_)
# 3. Verify domain is HTTPS (required by Stripe)
# 4. Test one real transaction with small amount
# 5. Monitor order confirmation emails
# 6. Check Stripe dashboard for transaction
```

---

## Part 11: Performance & Security

### Security Best Practices

1. **Webhook Signature Verification** ✓ Already implemented
   - Prevents fake payment notifications
   
2. **HTTPS Only** ✓ Required in .env DOMAIN
   - All paymentpasses through encrypted channel
   
3. **Email Validation** ✓ Already implemented
   - Prevents order creation with invalid emails
   
4. **PCI Compliance**
   - Stripe handles all card data (not your server)
   - You never see full credit card numbers
   
5. **API Key Rotation**
   - Keep separate test and live keys
   - Rotate quarterly in production

### Expected Performance

```
API Response Times (on Render free tier):
├─ /api/products               ~50-100ms
├─ /api/products/:id           ~50-100ms
├─ POST /api/checkout          ~200-500ms (Stripe API call)
├─ POST /api/webhook           ~100-200ms (verification + db update)
└─ Email sending              ~1-3 seconds (async)

Concurrent Users: 100+ simultaneously on Render free tier
Monthly Cost: $0 (free dynos for < 100k monthly requests)
```

---

## Next Steps: Phase 4 (Future)

Once Phase 3 is live and working:

- **Phase 4a:** Add account login system for customers to view orders
- **Phase 4b:** Add subscription billing for recurring products
- **Phase 4c:** Implement affiliate/referral system
- **Phase 4d:** Add Lemon Squeezy as secondary provider for RSA
- **Phase 4e:** Build admin dashboard for order management

---

## Quick Reference: All API Endpoints

```
GET  /api/products                 → List all products
GET  /api/products/:id             → Get single product
POST /api/checkout                 → Create checkout session
POST /api/webhook                  → Handle Stripe webhooks
GET  /api/dashboard                → Get customer dashboard (requires auth)
GET  /api/orders/:orderId          → Get order details
GET  /api/health                   → Health check
```

---

## Support

- **Stripe Docs:** https://stripe.com/docs/checkout
- **SendGrid Docs:** https://docs.sendgrid.com/
- **Stripe Webhooks:** https://stripe.com/docs/webhooks/
- **Error Codes:** https://stripe.com/docs/error-codes

---

**Last Updated:** March 7, 2026  
**Maintained By:** Old Dog Systems  
**Version:** 3.0.0
