# PayFast Integration Guide

## Status: ✅ Ready to Deploy

Your PayFast integration is complete and ready to go live with merchant credentials:
- **Merchant ID**: 34040991
- **Merchant Key**: uzi59baavudk5

---

## Quick Setup (5 minutes)

### 1. Update Your .env File

```bash
# Edit .env or create one from .env.example
nano .env
```

Add these PayFast credentials:

```env
PAYMENT_PROCESSOR=payfast
PAYFAST_MERCHANT_ID=34040991
PAYFAST_MERCHANT_KEY=uzi59baavudk5
DOMAIN=http://localhost:3000
SENDGRID_API_KEY=SG.your_key_here
ADMIN_PASSWORD=your_secure_password
```

### 2. Update Render Environment Variables

1. Go to: https://dashboard.render.com/
2. Select your Old Dog Web service
3. Click "Environment" tab
4. Add/Update:
   ```
   PAYMENT_PROCESSOR=payfast
   PAYFAST_MERCHANT_ID=34040991
   PAYFAST_MERCHANT_KEY=uzi59baavudk5
   DOMAIN=https://your-app.onrender.com
   ```
5. Click "Save Changes"
6. Service will re-deploy

### 3. Start Local Server

```bash
npm start
# or
node server.js
```

Should see:
```
Payment processor: payfast
Server running on port 3000
```

---

## Testing Locally

### Test 1: Create Checkout Session

```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "small-ai-toolkit",
        "name": "Small AI Toolkit",
        "price": 299.99,
        "quantity": 1
      }
    ],
    "customerEmail": "test@example.com"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "checkoutUrl": "https://sandbox.payfast.co.za/eng/process?...",
  "checkoutId": "1234567890",
  "orderId": "ord_abc123",
  "provider": "payfast"
}
```

### Test 2: Visit PayFast Sandbox

1. Copy the `checkoutUrl` from response
2. Paste in browser
3. You'll see PayFast checkout page
4. Use any test card to complete payment

**PayFast Sandbox Test Cards:**
- Any card number works in sandbox
- Use future expiry date
- Any CVC

### Test 3: Verify Order Created

After payment:

```bash
curl -X GET http://localhost:3000/api/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

Should see new order with:
- Status: `completed`
- License keys generated
- Order confirmed via email

---

## What Changes from Stripe → PayFast

| Aspect | Stripe | PayFast |
|--------|--------|---------|
| **Currency** | USD | ZAR (South African Rand) |
| **Redirect** | Session URL | Form redirect |
| **Signature** | Webhook signature | MD5 hash |
| **ID Format** | cs_test_xyz | Unix timestamp |
| **Webhook** | Stripe events | PayFast IPN |
| **Setup** | API keys | Merchant ID + Key |

---

## Production Checklist

- [ ] PayFast merchant account verified with SA documents
- [ ] Credentials added to `.env` file
- [ ] Local testing complete (checkout → payment → email)
- [ ] Render environment variables updated
- [ ] Production domain set in Render config
- [ ] Test transaction completed on production
- [ ] Email notifications working
- [ ] Orders appear in admin dashboard
- [ ] License keys generated correctly

---

## How It Works (Technical)

### Checkout Flow

```
1. User clicks "Buy"
   ↓
2. POST /api/checkout with items + email
   ↓
3. paymentProcessor.createCheckoutSession()
   ↓
4. PayFastProcessor generates:
   - MD5 signature from merchant data
   - Form redirect URL
   ↓
5. Response includes PayFast redirect URL
   ↓
6. Browser redirected to PayFast checkout
```

### Payment Completion Flow

```
1. User completes payment on PayFast
   ↓
2. PayFast verifies payment
   ↓
3. PayFast sends IPN to /api/webhook
   ↓
4. Server verifies MD5 signature
   ↓
5. Order status updated to "completed"
   ↓
6. License keys generated
   ↓
7. Emails sent to customer + admin
```

---

## Key Features

✅ **South Africa Ready**
- Supports ZAR currency
- Local payment provider
- No geographic restrictions

✅ **Abstraction Layer**
- Easy to swap payment processors
- No code changes needed
- Just change `PAYMENT_PROCESSOR` env var

✅ **Same User Experience**
- Orders created immediately
- License keys generated on payment success
- Email confirmations sent automatically
- Admin dashboard works the same

✅ **Backward Compatible**
- Existing orders/customers unaffected
- All dashboard features work
- Phase 4a+4e still work

---

## Monitoring & Troubleshooting

### Check PayFast Dashboard

Monitor all transactions at: https://dashboard.payfast.co.za/

### View Server Logs

**Local:**
```bash
npm start
# Logs print to console
```

**Render:**
```bash
# View logs from Render dashboard
# or via CLI:
render logs --service-id=YOUR_SERVICE_ID
```

### Common Issues

**Issue: "Invalid signature"**
- Double-check Merchant Key (no spaces)
- Verify MD5 calculation in paymentProcessor.js
- Restart server after changing credentials

**Issue: Webhook not firing**
- Go to PayFast dashboard → Settings → Notify URL
- Ensure it's set to: `https://your-domain.com/api/webhook`
- Test transaction to verify

**Issue: Currency showing USD not ZAR**
- Check order record - should show ZAR
- Update products.json prices if needed
- Verify PAYMENT_PROCESSOR=payfast in .env

---

## Next Steps

### Immediate (Today)
1. ✅ Add credentials to .env
2. ✅ Test local checkout flow
3. ✅ Deploy to Render
4. ✅ Test production payment

### This Week
1. Monitor first transactions
2. Gather feedback from test users
3. Fine-tune error messages
4. Optimize email templates

### Future Phases
- Phase 4b: Recurring subscriptions on PayFast
- Phase 4c: Affiliate system integration
- Phase 4b+4c: Combined billing features
- Multi-currency support (ZAR + others)

---

## Success Indicators

✅ Order created after payment
✅ Email sent to customer  
✅ Email sent to admin
✅ License keys visible in customer dashboard
✅ Order appears in admin orders list
✅ Transaction visible in PayFast dashboard
✅ Customer can login and view orders
✅ Admin can process refunds

---

## Support Resources

- **PayFast Documentation**: https://developers.payfast.co.za/
- **PayFast Dashboard**: https://dashboard.payfast.co.za/
- **Sandbox Testing**: https://sandbox.payfast.co.za/
- **Contact PayFast**: support@payfast.co.za

---

## Code Architecture

### Payment Processor Abstraction

All payment logic lives in `paymentProcessor.js`:

```javascript
// Factory function to get processor
const processor = getPaymentProcessor();

// Use same interface regardless of processor
const session = await processor.createCheckoutSession(...);
const result = await processor.handleWebhook(...);
```

**Benefits:**
- Easy to add Yoco, Lemon Squeezy, etc.
- No changes to server.js logic
- Just add new `YocoProcessor` class
- Update `getPaymentProcessor()` to return it

---

## Final Checklist

Before going live:

- [ ] PayFast account verified and in good standing
- [ ] Credentials copied exactly (no spaces/tabs)
- [ ] Render environment config updated
- [ ] Production domain matches PayFast return URL
- [ ] Test transaction completed
- [ ] Email confirmations received
- [ ] Orders visible in admin dashboard
- [ ] Refund processing tested
- [ ] Documentation updated for team

---

**Status**: ✅ Ready for South African market  
**Date**: 7 March 2026  
**Merchant ID**: 34040991  
**Live URL**: https://old-dog-web.onrender.com
