# Lemon Squeezy Integration Setup

**Status:** Code structure ready | Waiting for API credentials

---

## What's Been Done ✅

1. **Lemon Squeezy module created** (`lemon-squeezy.js`)
   - Checkout session creation
   - Webhook handling
   - Ready to use immediately once credentials are added

2. **Server updated** (`server.js`)
   - Removed Stripe integration
   - Added Lemon Squeezy `/api/checkout` endpoint
   - Added `/api/webhooks/lemon-squeezy` for order confirmation

3. **Shop frontend updated** (`shop.html`)
   - Removed Stripe JavaScript
   - Updated checkout flow to use Lemon Squeezy API
   - Better error handling and email validation

---

## What You Need to Do

### Step 1: Create Lemon Squeezy Account
- Go to [lemonsqueezy.com](https://lemonsqueezy.com)
- Sign up and verify email
- Create a store

### Step 2: Get Your Credentials
From your Lemon Squeezy dashboard:
1. **Store ID**
   - Settings → Store
   - Copy your Store ID (looks like: `123456`)

2. **API Key**
   - Settings → API
   - Create new API key
   - Copy the key (starts with: `gsk_live_...`)

### Step 3: Create Products in Lemon Squeezy
For each product in your shop, you need to create a Lemon Squeezy product:

**Products to create:**
1. Rough Diamond Studio — Alpha Access ($99)
2. Business on Purpose — Founder's Journal ($29)
3. RDS Standard Templates ($49)
4. Podcast Editing Masterclass ($79)

For each product, note its **Variant ID** (e.g., `var_12345678`)

### Step 4: Set Environment Variables on Render

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Select your service: `old-dog-systems1`
3. Go to **Settings → Environment**
4. Add these variables:

```
LEMON_SQUEEZY_STORE_ID=<your-store-id>
LEMON_SQUEEZY_API_KEY=<your-api-key>
LSQUEEZY_VAR_RDS=<variant-id-for-rds-alpha>
LSQUEEZY_VAR_BOP_JOURNAL=<variant-id-for-journal>
LSQUEEZY_VAR_TEMPLATES=<variant-id-for-templates>
LSQUEEZY_VAR_MASTERCLASS=<variant-id-for-masterclass>
```

5. Click **Save**
6. Render will auto-redeploy

### Step 5: Set Up Webhooks (Optional but Recommended)

Webhooks allow automatic order confirmation emails:

1. In Lemon Squeezy dashboard: **Settings → Webhooks**
2. Add webhook:
   - **URL:** `https://old-dog-systems1.onrender.com/api/webhooks/lemon-squeezy`
   - **Events:** Select `order:created` and `order:completed`
3. Save

---

## How It Works (After Setup)

### Customer Journey:
1. Customer adds items to cart
2. Clicks "Proceed to Checkout"
3. Enters email address
4. Redirected to Lemon Squeezy checkout page
5. Makes payment (supports 100+ payment methods)
6. Redirected to success page
7. Order confirmed in your database
8. Confirmation email sent to customer

### Backend Flow:
- `/api/checkout` → Creates checkout link → Returns URL
- Customer pays on Lemon Squeezy (never touches your server)
- Webhook → Order marked complete → Email sent

---

## Product Variant ID Reference

After creating products in Lemon Squeezy, your variant IDs will look like:

```
rough-diamond-studio-alpha: var_ABC123DEF456
bop-journal-founders: var_XYZ789GHI012
rds-standard-templates: var_MNO345PQR678
podcast-editing-masterclass: var_STU901VWX234
```

Update `lemon-squeezy.js` line 9-14 with your actual IDs, OR set them as environment variables (recommended).

---

## Testing Before Going Live

### Test Checkout Locally:
```bash
export LEMON_SQUEEZY_STORE_ID=your_store_id
export LEMON_SQUEEZY_API_KEY=your_api_key
export LSQUEEZY_VAR_RDS=your_variant_id
node server.js
# Visit http://localhost:3000/shop.html
```

### Use Lemon Squeezy Test Mode:
- Use test card: `4111 1111 1111 1111`
- Any future date, any CVC

(Note: Lemon Squeezy is at [lemonsqueezy.com](https://lemonsqueezy.com))

---

## Troubleshooting

**"API not configured" error:**
- Environment variables not set on Render
- Service not redeployed after adding variables

**"Invalid variant ID" error:**
- Variant IDs don't match your Lemon Squeezy products
- Double-check the IDs in dashboard

**Webhook not firing:**
- Webhook URL incorrect
- Make sure it's `https://` (not http)
- Check webhook logs in Lemon Squeezy dashboard

---

## Switching Back to Stripe (if needed)

To revert:
1. `git log --oneline` to find commit before Lemon Squeezy
2. `git revert <commit-hash>`
3. `git push` to redeploy

---

## Next Steps After Setup

- [ ] Create Lemon Squeezy account
- [ ] Get Store ID and API Key
- [ ] Create products in Lemon Squeezy
- [ ] Note down variant IDs
- [ ] Set environment variables on Render
- [ ] Test checkout flow with test card
- [ ] Go live!

**Questions?** All code is in place and ready. Just need your credentials to activate.
