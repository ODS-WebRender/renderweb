# Phase 3: Quick Start for Going Live

**Target:** Get payment processing live in < 30 minutes  
**Status:** Ready to deploy  
**Last Updated:** March 7, 2026

---

## 5-Minute Setup

### Step 1: Set Up Stripe Account (5 min)

```bash
# 1. Go to https://stripe.com
# 2. Sign up with your email
# 3. Verify email
# 4. Enter business details (USA/UK based)
# 5. Verify identity (instant approval for USA/UK)

# You now have access to:
# ✓ Test mode dashboard
# ✓ API keys
# ✓ Webhook endpoints
```

### Step 2: Get Your Stripe Test Keys

```bash
# In Stripe Dashboard → Developers → API Keys

# Copy these:
STRIPE_PUBLIC_KEY = pk_test_XXXXXXX
STRIPE_SECRET_KEY = sk_test_XXXXXXX
STRIPE_WEBHOOK_SECRET = whsec_XXXXXXX
```

### Step 3: Create Webhook Endpoint

```bash
# In Stripe Dashboard → Developers → Webhooks

# Add endpoint:
URL: https://your-domain.onrender.com/api/webhook
Events: Choose "checkout.session.completed" and "charge.refunded"

# Copy webhook secret (whsec_...)
```

### Step 4: Set Up SendGrid (3 min)

```bash
# 1. Go to https://sendgrid.com
# 2. Sign up
# 3. Create API key (Settings → API Keys)
# 4. Copy key starting with "SG."

# SendGrid free tier: 100 emails/day (enough for testing)
```

### Step 5: Update Local .env

```bash
# Edit .env file or create if missing:

STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

SENDGRID_API_KEY=SG.your_api_key_here
SENDER_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=youremail@yourdomain.com

DOMAIN=http://localhost:3000
PORT=3000
ADMIN_PASSWORD=set-a-strong-password
```

### Step 6: Deploy to Render (5 min)

```bash
# 1. Push changes
git add .
git commit -m "Phase 3: Payment system with Stripe + SendGrid"
git push origin main

# 2. Go to Render dashboard
# 3. Select your service
# 4. Settings → Environment
# 5. Add/update all variables from .env:
#    - STRIPE_SECRET_KEY=sk_test_...
#    - STRIPE_PUBLISHABLE_KEY=pk_test_...
#    - STRIPE_WEBHOOK_SECRET=whsec_...
#    - SENDGRID_API_KEY=SG....
#    - SENDER_EMAIL=noreply@yourdomain.com
#    - ADMIN_EMAIL=admin@yourdomain.com
#    - DOMAIN=https://your-service.onrender.com (HTTPS!)
#    - ADMIN_PASSWORD=your-secure-password

# 6. Click "Save"
# 7. Render auto-deploys (watch for "Live" status)
```

---

## Fast Testing: 10 Minutes

### Test 1: API Health Check

```bash
# Should show 200 OK
curl https://your-domain.onrender.com/api/health

# Expected response:
# {"status":"OK","timestamp":"2026-03-07T...","paymentProvider":"stripe"}
```

### Test 2: Product Loading

```bash
# Visit shop in browser
https://your-domain.onrender.com/shop.html

# Check:
✓ Products display
✓ No JavaScript errors (F12 console)
✓ Cart works (add item → count changes)
```

### Test 3: Test Payment

1. Add product to cart
2. Click "Proceed to Checkout"
3. Enter: `test@example.com`
4. Enter test card: `4242 4242 4242 4242`
5. Any future expiry and CVC
6. Complete payment
7. Should see success page

### Test 4: Verify Order & License

```bash
# On Render terminal:

# See generated files
ls -la data/orders/
ls -la data/licenses/
ls -la data/invoices/

# View order
cat data/orders/order_*.json | jq
# Should show status: "completed", licenseKeys: {...}
```

### Test 5: Check Emails

1. Go to SendGrid dashboard
2. Mail → Activity
3. Should see 3 emails delivered:
   - Order confirmation
   - License keys
   - Admin notification

---

## Going Live: Stripe LIVE Mode

### When Ready for Real Payments

**BEFORE switching to LIVE:**
- [ ] All tests above pass with test keys
- [ ] 3+ successful test orders
- [ ] Emails delivering correctly
- [ ] License keys format looks good

### Switch to Live Keys

```bash
# 1. In Stripe Dashboard
# Click toggle from "Test" to "Live"

# 2. Get LIVE keys (not test keys!)
# Stripe → Developers → API Keys (LIVE tab)

STRIPE_SECRET_KEY = sk_live_XXXXXXX  (NOT sk_test_!)
STRIPE_PUBLIC_KEY = pk_live_XXXXXXX
STRIPE_WEBHOOK_SECRET = whsec_live_XXXXXXX

# 3. Update Render environment with LIVE keys
# Settings → Environment → Update/Save

# 4. That's it!
# Real transactions will now process
```

### After Going Live

```bash
# Monitor your dashboard
✓ Stripe dashboard shows transactions
✓ SendGrid shows real customer emails
✓ Check data/orders/ for real orders
✓ Check data/invoices/ for PDFs
```

---

## Key Points

### What Happens on Payment

1. **Customer → Your Shop:** Browses products, adds to cart
2. **Customer → Stripe:** Clicks checkout, enters email, pays
3. **Stripe → Your Server:** Sends webhook (cryptographically signed)
4. **Your Server:**
   - Verifies webhook signature (rejects fakes)
   - Creates order in database
   - Generates license keys
   - Generates PDF invoice
   - Sends confirmation email
   - Sends license email
   - Sends admin notification
5. **All Complete:** Customer sees success page

### Security Note

- Stripe handles all card data (PCI compliant)
- Your server **never sees** full credit card numbers
- Webhooks are cryptographically signed
- Email passwords stored in environment (not code)

### Cost

**Stripe Fee:** 2.9% + $0.30 per transaction
- Example: $99 order = $102.87 (Stripe takes $2.87)
- Free test mode for development

**SendGrid Fee:** Free tier includes 100 emails/day
- Upgrade when you exceed 100/day

**Render Hosting:** Free for basic tier (runs payment server)

---

## Troubleshooting Quick Fixes

### Checkout button does nothing
Check browser console (F12): Are there errors?
```
→ Check STRIPE_SECRET_KEY is set
→ Check Render logs for errors
→ Check network tab for failed requests
```

### Email not received
```
→ Check SendGrid dashboard (Activity tab)
→ Verify SENDGRID_API_KEY in Render environment
→ Check server logs for email errors
→ Note: Free tier allows 100/day max
```

### License key not in email
```
→ Check server logs for "License generated"
→ Verify product is in licensedProducts array (server.js)
→ Check data/licenses/ directory exists
```

### Webhook not firing
```
→ Check Stripe dashboard Webhooks section
→ Verify URL is exactly: https://your-domain.onrender.com/api/webhook
→ Verify webhook secret matches STRIPE_WEBHOOK_SECRET
→ Click "Send test webhook" from Stripe dashboard
```

---

## Command Reference

```bash
# Local development
npm start                    # Start server
npm install                  # Install dependencies

# Git
git add .
git commit -m "message"
git push origin main         # Deploys to Render

# Check environment variables
echo $STRIPE_SECRET_KEY
echo $SENDGRID_API_KEY

# View orders
ls data/orders/
cat data/orders/order_*.json | jq

# View licenses  
ls data/licens  
head -20 data/licenses/RDS-*.json

# View invoices
ls data/invoices/
file data/invoices/invoice_*.pdf
```

---

## Checklist: First Live Payment

- [ ] Stripe account created and verified
- [ ] Test mode keys added to .env
- [ ] SendGrid account created and API key added
- [ ] Local testing passes (test card works)
- [ ] Deployed to Render
- [ ] Test payment succeeds on Render
- [ ] Order created in data/orders/
- [ ] License generated
- [ ] Confirmation email received
- [ ] Switched to LIVE keys
- [ ] Real transaction test completed
- [ ] Revenue shows in Stripe dashboard

---

## Next: Monitoring & Support

### Daily

```bash
# Check for failed orders
grep -r "status.*pending" data/orders/
# If any pending orders older than 1 hour, investigate

# Check payment stats
cat data/orders/*.json | jq '.totalAmount' | awk '{sum+=$1} END {print "Total revenue: $" sum}'
```

### Weekly

```bash
# Review customer feedback
# Check for license key issues
# Back up database
tar czf backup_data_$(date +%Y%m%d).tar.gz data/
```

### Monthly

```bash
# Review Stripe dashboard for trends
# Update products based on sales
# Check for any fraud or refund patterns
```

---

## Success Indicators

✓ Shop loads without errors  
✓ Products display correctly  
✓ Checkout works end-to-end  
✓ Test payment succeeds  
✓ Orders created in database  
✓ Licenses generated  
✓ Confirmation emails sent  
✓ Admin notifications received  
✓ Zero JavaScript errors  
✓ HTTPS working on production  

---

## Support

**Stripe Issues:**
- Docs: https://stripe.com/docs
- Support: https://dashboard.stripe.com/support
- Test cards: https://stripe.com/docs/testing

**SendGrid Issues:**
- Docs: https://docs.sendgrid.com/
- Support: https://support.sendgrid.com/

**Your Own Issues:**
- Check server logs on Render
- Check browser console (F12)
- Monitor order files in data/orders/

---

**You're Ready!** 🚀

Once you complete the 5-minute setup and 10-minute testing, you can start accepting payments for real.

Questions? Check PHASE3_PAYMENT_SETUP.md for detailed info.
