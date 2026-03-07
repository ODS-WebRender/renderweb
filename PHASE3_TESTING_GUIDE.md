# Phase 3 Testing & Troubleshooting Guide

**Created:** March 7, 2026  
**Status:** Ready for testing  
**Target:** Complete end-to-end payment flow validation

---

## Overview

This guide walks through testing the complete payment flow from cart to order confirmation, license delivery, and invoice generation.

---

## Part 1: Pre-Testing Checklist

### 1.1 Development Environment

```bash
# 1. Install dependencies
npm install

# 2. Verify Stripe secret key is set
cat .env | grep STRIPE_SECRET_KEY
# Should output: STRIPE_SECRET_KEY=sk_test_xxxx

# 3. Verify SendGrid API key is set
cat .env | grep SENDGRID_API_KEY
# Should output: SENDGRID_API_KEY=SG.xxxx

# 4. Start server
npm start
# Expected output: Server listening on port 3000
```

### 1.2 Verify Files Exist

```bash
# Core payment files
ls -la server.js                    # ✓ Should exist 
ls -la db.js                       # ✓ Should exist
ls -la email.js                    # ✓ Should exist
ls -la invoice.js                  # ✓ Should exist
ls -la shop.html                   # ✓ Should exist
ls -la checkout-success.html       # ✓ Should exist
ls -la products.json               # ✓ Should exist

# Data directories (should create on first order)
mkdir -p data/orders
mkdir -p data/customers
mkdir -p data/licenses
mkdir -p data/invoices
chmod 755 data/orders data/customers data/licenses data/invoices
```

---

## Part 2: API Testing (Postman / cURL)

### 2.1 Test Products Endpoint

**Test:** Product listing loads correctly

```bash
# Request
curl http://localhost:3000/api/products -H "Content-Type: application/json"

# Expected Response
{
  "metadata": {
    "version": "1.1.0",
    "company": "Old Dog Systems",
    "regions": ["RSA", "US", "UK"],
    "lastUpdated": "2026-02-02"
  },
  "products": [
    {
      "id": "rough-diamond-studio-alpha",
      "name": "Rough Diamond Studio — Alpha Access",
      "price": 9900,
      "displayPrice": "$99.00",
      "status": "alpha",
      ...
    },
    ...
  ]
}

# Check: ✓ 200 status code
# Check: ✓ products array has 5+ items
# Check: ✓ Each product has id, name, price, displayPrice, status
```

### 2.2 Test Single Product Endpoint

```bash
# Request
curl http://localhost:3000/api/products/rough-diamond-studio-alpha

# Expected Response
{
  "id": "rough-diamond-studio-alpha",
  "name": "Rough Diamond Studio — Alpha Access",
  "category": "software",
  "price": 9900,
  "displayPrice": "$99.00",
  "description": "Alpha access to the flagship audio podcasting and content creation system...",
  "features": [...],
  "status": "alpha",
  ...
}

# Check: ✓ 200 status code
# Check: ✓ All product details present
```

### 2.3 Test Checkout Endpoint

**Test:** Checkout session creation

```bash
# Request
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "rough-diamond-studio-alpha",
        "name": "Rough Diamond Studio — Alpha Access",
        "price": 9900,
        "displayPrice": "$99.00",
        "quantity": 1
      }
    ],
    "customerEmail": "test@example.com"
  }'

# Expected Response
{
  "success": true,
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_test_xxxxxxxxxxxx",
  "checkoutId": "cs_test_xxxxxxxxxxxx",
  "orderId": "order_1234567890_abc"
}

# Check: ✓ 200 status code
# Check: ✓ success: true
# Check: ✓ checkoutUrl starts with https://checkout.stripe.com/
# Check: ✓ orderId format: order_timestamp_random
```

### 2.4 Test Error Handling

**Test A: Missing Email**

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "rough-diamond-studio-alpha", "name": "...", "price": 9900}],
    "customerEmail": ""
  }'

# Expected: 400 status code
# Expected error: "Valid email required"
```

**Test B: Invalid Email**

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "rough-diamond-studio-alpha", "name": "...", "price": 9900}],
    "customerEmail": "not-an-email"
  }'

# Expected: 400 status code
# Expected error: "Valid email required"
```

**Test C: Empty Cart**

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [],
    "customerEmail": "test@example.com"
  }'

# Expected: 400 status code
# Expected error: "No items in cart"
```

---

## Part 3: Frontend Testing (Browser)

### 3.1 Shop Page Load

**Test:** Shop page renders without errors

1. Open `http://localhost:3000/shop.html`
2. Should see:
   - Navigation header with logo ✓
   - "Unified Shop" hero section ✓
   - Product filter buttons ✓
   - Products grid with cards ✓
   - Cart indicator showing "0 items" ✓

3. Check browser console (F12):
   - No error messages ✓
   - "Products loaded successfully" or similar ✓

### 3.2 Product Loading

**Test:** Products load from API

1. Open DevTools (F12) → Network tab
2. Reload shop.html
3. Look for GET request to `/api/products`
4. Should see response with 200 status and product array ✓

### 3.3 Add to Cart

**Test:** Adding products works correctly

1. Find "Rough Diamond Studio — Alpha Access" card
2. Click "Add to Cart" button
3. Verify:
   - Cart count changes from 0 to 1 ✓
   - Button feedback (visual change) ✓
   - Cart indicator updated ✓

4. Add another product
5. Verify cart count is now 2 ✓

### 3.4 View Cart

**Test:** Cart section displays correctly

1. Scroll down to "Your Cart" section
2. Should see:
   - Both products listed ✓
   - Quantity inputs for each ✓
   - Remove buttons ✓
   - Subtotal calculation ✓
   - "Proceed to Checkout" button ✓

3. Change quantity for first product to 2
4. Verify:
   - Subtotal recalculates ✓
   - Cart state persists on page reload ✓

### 3.5 Clear Cart

**Test:** Clear cart button works

1. With items in cart, click "Clear Cart"
2. Verify:
   - All items removed ✓
   - Cart count shows 0 ✓
   - Empty cart message shows ✓

---

## Part 4: Full Checkout Flow (Test Mode)

### 4.1 Initiate Checkout

**Setup:**
- Server running locally: `npm start`
- Shop page open: `http://localhost:3000/shop.html`
- 1-2 products in cart

**Steps:**

1. Click "Proceed to Checkout" button
2. Modal should appear:
   - Order summary ✓
   - Email input field ✓
   - "Pay $XX.XX" button ✓
   - Security message about Stripe ✓

3. Enter email: `test@example.com`
4. Click "Pay $XX.XX"
5. Should redirect to Stripe checkout page

### 4.2 Stripe Test Checkout

**Pay with test card:**

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g., `12/26`) |
| CVC | Any 3 digits (e.g., `123`) |
| Name | `Test User` |

**Steps:**

1. Enter card details
2. Click "Pay now" button
3. Should redirect to `checkout-success.html`
4. See success message: "Order Confirmed 🎉" ✓

### 4.3 Verify Order Created

**Check filesystem:**

```bash
# List orders
ls data/orders/
# Should show: order_xxxxxx_xxx.json

# View order details
cat data/orders/order_xxxxxx_xxx.json | jq
# Should show:
{
  "id": "order_xxxxxx_xxx",
  "stripeSessionId": "cs_test_xxxxx",
  "customerEmail": "test@example.com",
  "items": [...],
  "totalAmount": XX.XX,
  "status": "completed",
  "licenseKeys": {
    "rough-diamond-studio-alpha": "RDS-2026-03-07-ABCDEF123456"
  },
  ...
}
```

### 4.4 Verify License Keys Generated

```bash
# List licenses
ls data/licenses/
# Should show multiple .json files

# View license
cat "data/licenses/RDS-2026-03-07-ABCDEF123456.json"
# Should show:
{
  "key": "RDS-2026-03-07-ABCDEF123456",
  "productId": "rough-diamond-studio-alpha",
  "orderId": "order_xxxxxx_xxx",
  "customerEmail": "test@example.com",
  "status": "active",
  "expiresAt": null,
  "activationCount": 0
}
```

### 4.5 Verify Invoice Generated

```bash
# List invoices
ls data/invoices/
# Should show: invoice_order_xxxxxx_xxx.pdf

# Check file size (should be > 10 KB)
ls -lh data/invoices/
```

### 4.6 Check Server Logs

Server logs should show:

```
✓ Webhook event: checkout.session.completed
✓ License generated: rough-diamond-studio-alpha -> RDS-2026-03-07-ABCD...
✓ Invoice generated: order_xxxxxx_xxx
✓ Order confirmation sent to test@example.com
✓ License key email sent to test@example.com: rough-diamond-studio-alpha
✓ Admin notification sent for order order_xxxxxx_xxx
✓ Order order_xxxxxx_xxx completed - 1 licenses generated
```

---

## Part 5: Email Testing

### 5.1 Verify SendGrid Connection

**Test SendGrid credentials:**

```bash
# Check if API key is set
echo "SENDGRID_API_KEY: $SENDGRID_API_KEY"
# Should output: SENDGRID_API_KEY: SG.xxxxx
```

### 5.2 Check Email Delivery

**In SendGrid Dashboard:**

1. Go to [app.sendgrid.com](https://app.sendgrid.com)
2. Navigate to **Mail → Activity**
3. After checkout, should see 3 emails:
   - **Order Confirmation** (to `test@example.com`)
     - Subject: "Order Confirmation" or similar
     - Contains: order ID, items, total, license keys
   
   - **License Key** (to `test@example.com`)
     - Subject: "Your License Keys" or similar
     - Contains: formatted license keys, activation instructions
   
   - **Admin Notification** (to `admin@yourdomain.com`)
     - Subject: "New Order Alert" or similar
     - Contains: order summary, customer info, revenue

### 5.3 Email Content Verification

**Order Confirmation Email should include:**
- ✓ Order ID
- ✓ Product names and prices
- ✓ Order total
- ✓ License keys (if applicable)
- ✓ Download links (if applicable)

**License Key Email should include:**
- ✓ Prominently displayed license key
- ✓ Product name
- ✓ Activation instructions
- ✓ Support contact info
- ✓ Lifetime validity statement

---

## Part 6: Multi-Product Cart Testing

### 6.1 Mixed Cart Test

**Test:** Multiple products with different license types

**Steps:**

1. Add to cart:
   - Rough Diamond Studio ($99) ✓
   - Business on Purpose Journal ($29) ✓
   - RDS Templates ($49) ✓

2. Proceed to checkout
3. Use test card: `4242 4242 4242 4242`
4. Verify:
   - Total is $177 ✓
   - Order created with 3 items ✓
   - 3 license keys generated ✓
   - Email includes all 3 licenses ✓

**Check license format:**

```
RDS-2026-03-07-ABCDEF123456    (Rough Diamond)
BOP-2026-03-07-GHIJKL789101    (Business on Purpose)
RDST-2026-03-07-MNOPQR121314   (RDS Templates)
```

---

## Part 7: Error Scenario Testing

### 7.1 Declined Card

**Test:** Payment decline handling

1. Add product to cart
2. Checkout
3. Use card: `4000 0000 0000 0002` (always declines)
4. Should see error: "Your card was declined"
5. Verify:
   - No order created ✓
   - No license keys generated ✓
   - Customer can retry ✓

### 7.2 Network Error

**Test:** Connection loss handling

1. Start checkout
2. Open DevTools → Network tab → Throttle to "Offline"
3. Try to proceed
4. Should show error: "Network error. Please check your connection"
5. Verify:
   - Clear error message ✓
   - Retry button available ✓

### 7.3 Invalid Product

**Test:** Non-existent product ID

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "invalid-product", "name": "...", "price": 1000}],
    "customerEmail": "test@example.com"
  }'

# Should complete (Stripe doesn't validate product IDs)
# But order will have invalid product reference
```

---

## Part 8: Performance Testing

### 8.1 API Response Times

**Test slow API responses:**

```bash
# Measure checkout endpoint response time
time curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"items": [...], "customerEmail": "test@example.com"}'

# Expected: 200-500ms
# Should not exceed: 1 second
```

### 8.2 Concurrent Orders

**Test:** Multiple simultaneous checkouts (manual with multiple browsers)

1. Open shop.html in 3 browser tabs
2. Add product to cart in each
3. Initiate checkout in all 3 simultaneously
4. Verify:
   - All orders created ✓
   - All licenses generated ✓
   - No data conflicts ✓

---

## Part 9: Database Integrity

### 9.1 Verify Data Consistency

```bash
# Count created files
ls data/orders/ | wc -l        # 3 orders expected
ls data/licenses/ | wc -l      # 3+ licenses (depending on products)
ls data/invoices/ | wc -l      # 3 invoices

# Validate JSON syntax
jsonlint data/orders/order_*.json
jsonlint data/licenses/*.json
```

### 9.2 Check License Validation

```bash
# Load server REPL (if using Node)
node

# Import db module
const db = require('./db.js');

// Validate a license
const license = db.validateLicense('RDS-2026-03-07-ABCDEF123456');
console.log(license);
// Expected: { valid: true, license: {...} }

// Validate non-existent license
const invalid = db.validateLicense('INVALID-KEY');
console.log(invalid);
// Expected: { valid: false, reason: 'License not found' }

// Exit
.exit
```

---

## Part 10: Security Testing

### 10.1 Webhook Signature Verification

**Test:** Stripe webhooks are properly verified

1. Check `server.js` webhook handler includes:
   ```javascript
   const sig = req.headers['stripe-signature'];
   const event = stripe.webhooks.constructEvent(
     body, sig, process.env.STRIPE_WEBHOOK_SECRET
   );
   ```

2. If signature invalid:
   - Should throw error ✓
   - Should return 403 Forbidden ✓
   - No order should be created ✓

### 10.2 SQL Injection Prevention

**Test:** Invalid characters in fields

```bash
# Try to inject SQL (should be harmless in JSON-based system)
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"id": "test'; DROP TABLE orders; --", ...}],
    "customerEmail": "test@example.com"
  }'

# Expected: Should either error or create safe order
# File-based DB means SQL injection isn't applicable
```

### 10.3 Email Spoofing Prevention

All emails should use verified SendGrid sender address set in `.env`:

```bash
grep SENDER_EMAIL .env
# Should output: SENDER_EMAIL=noreply@youralready-verified-domain.com
```

---

## Part 11: Deployment Testing (Render)

### 11.1 Pre-Deployment Checklist

- [ ] All local testing passes
- [ ] `.env` configured with live keys (or test keys for staging)
- [ ] Git changes committed
- [ ] `package.json` has all dependencies
- [ ] No hardcoded URLs (all use `DOMAIN` env var)
- [ ] All `console.log` output is useful (not spam)

### 11.2 Deploy to Render

```bash
# 1. Commit changes
git add .
git commit -m "Phase 3: Complete payment system with license delivery"

# 2. Push to main
git push origin main

# 3. Monitor Render deployment
# Dashboard should show "Deploy" in progress

# 4. Wait for "Live" status
# Expected time: 2-3 minutes

# 5. Test production
# Go to https://your-domain-on-render.com/shop.html
# Complete test purchase
```

### 11.3 Production Verification Checklist

- [ ] Shop page loads ✓
- [ ] Products API returns products ✓
- [ ] Checkout initiates ✓
- [ ] Stripe checkout page opens ✓
- [ ] Test payment completes ✓
- [ ] Success page shows ✓
- [ ] Order file created ✓
- [ ] License generated ✓
- [ ] Emails sent ✓

---

## Part 12: Troubleshooting

### Issue: "Payment system not configured"

**Cause:** Environment variables not set

**Solution:**
```bash
# 1. Check .env file
cat .env | grep STRIPE

# 2. On Render dashboard:
# Settings → Environment → Verify all variables

# 3. Restart service
# Render should auto-redeploy after env change
```

### Issue: Emails not sending

**Cause:** SendGrid not configured

**Solution:**
```bash
# 1. Verify SendGrid API key
echo $SENDGRID_API_KEY

# 2. Check SendGrid dashboard for:
# - Active API key
# - Sender email verified
# - Not rate-limited (free tier: 100/day)

# 3. Check server logs for errors
# Look for: "SendGrid API response:" or error messages
```

### Issue: License keys not generated

**Cause:** Product not in licensedProducts list or file write error

**Solution:**
```bash
# 1. Check server.js licensedProducts array
grep -A 15 "licensedProducts = \[" server.js

# 2. Add product to list if missing
# 3. Verify data/licenses/ directory writable
chmod 755 data/licenses/

# 4. Check server logs:
grep -i "license" /path/to/server/logs
```

### Issue: Webhook not firing

**Cause:** Webhook URL not registered in Stripe or signature mismatch

**Solution:**
```bash
# 1. Stripe dashboard → Developers → Webhooks
# Verify endpoint is registered ✓

# 2. Verify webhook secret matches
grep STRIPE_WEBHOOK_SECRET .env
# Should match value in Stripe dashboard exactly

# 3. Check endpoint status in Stripe
# Should show recent requests with 200 responses

# 4. Resend test webhook from Stripe dashboard
# Monitor server logs for receipt
```

---

## Checklist: Ready for Production

- [ ] All API tests pass
- [ ] Frontend tests pass
- [ ] Full checkout flow works end-to-end
- [ ] Test payment completes successfully
- [ ] Email confirmations received
- [ ] License keys delivered correctly
- [ ] Invoice generated and looks good
- [ ] Admin notifications received
- [ ] Error handling tested
- [ ] Security checks passed
- [ ] Performance acceptable
- [ ] Deployed to production
- [ ] Production test purchase completed
- [ ] All monitoring in place

---

**Last Updated:** March 7, 2026  
**Next Review:** After first 10 production orders
