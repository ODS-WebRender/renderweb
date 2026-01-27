# Old Dog Systems — Enterprise Shop & Stripe Integration

## Overview

This is a **production-ready, expandable e-commerce system** for Old Dog Systems built with Node.js, Stripe, and modern frontend architecture. Designed for growth from day one.

---

## 🏗️ Architecture

### Frontend
- **shop.html** — Dynamic product grid with filtering, cart management, and checkout flow
- **checkout-success.html** — Order confirmation page with session tracking
- **constants.js** — Centralized product catalog and helper functions
- **shop-filter.js** — Legacy filtering system (being superseded by modern shop.html)

### Backend
- **server.js** — Node.js HTTP server with Stripe API integration
  - `GET /api/products` — Fetch product catalog
  - `GET /api/products/:id` — Single product details
  - `POST /api/checkout` — Create Stripe checkout session
  - `POST /api/webhook` — Handle Stripe webhooks for order fulfillment
  - Static file serving with security headers and aggressive caching

### Data
- **products.json** — Central product database (expandable for unlimited SKUs)
- **.env.example** — Configuration template for Stripe keys

---

## 🛍️ Current Products

### Software
1. **Rough Diamond Studio — Alpha Access** ($99)
   - Professional audio pipeline
   - Editorial operations dashboard
   - Asset generation for distribution
   - Team collaboration tools
   - Alpha community access

### Business on Purpose (Podcast)
1. **Founder's Journal** ($29)
2. **Systems Playbook** ($39) 
3. **Building Systems Course** ($149 — Coming Soon)
4. **Essentials Bundle** ($59)

### When Life Bites (Podcast)
1. **Resilience Journal** ($29)
2. **Companion Guide** ($19)
3. **3-Day Retreat Program** ($799 — RSA, expandable)
4. **Starter Bundle** ($39)

---

## 📦 Expandable Product Structure

Products follow this schema (in `products.json`):

```json
{
  "id": "unique-slug",
  "name": "Display Name",
  "category": "software|media",
  "subcategory": "studio|business-on-purpose|when-life-bites",
  "price": 9900,  // in cents for Stripe
  "displayPrice": "$99.00",
  "stripePriceId": "price_xxx",
  "description": "Short description",
  "longDescription": "Full details",
  "features": ["Feature 1", "Feature 2"],
  "status": "active|coming-soon|archived",
  "format": "digital-pdf|video-course|in-person|digital-templates",
  "media": {
    "podcast": "business-on-purpose|when-life-bites|both"
  },
  "includesAccess": ["community", "live-q-and-a"]  // optional
}
```

---

## 🔑 Stripe Setup

### 1. Get Stripe Keys
Visit **https://dashboard.stripe.com/apikeys**:
- Copy **Secret Key** (starts with `sk_live_` or `sk_test_`)
- Copy **Publishable Key** (starts with `pk_live_` or `pk_test_`)

### 2. Create Price IDs
For each product in Stripe Dashboard:
1. Go to **Products** → Create new
2. Set name, price, currency (USD for US/UK, ZAR for RSA)
3. Copy the **Price ID** (e.g., `price_1234567890`)
4. Update `products.json` with the `stripePriceId`

### 3. Set Environment Variables

On **Render.com**:
1. Go to **Settings** → **Environment**
2. Add:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   DOMAIN=https://your-domain.onrender.com
   ```

### 4. Webhook Configuration
1. Go to **https://dashboard.stripe.com/webhooks**
2. Create endpoint pointing to: `https://your-domain.onrender.com/api/webhook`
3. Select events: `checkout.session.completed`, `checkout.session.async_payment_failed`
4. Copy **Signing Secret** to `STRIPE_WEBHOOK_SECRET`

---

## 💳 Multi-Region Pricing

### Current Markets
- **RSA** (South Africa) — ZAR pricing available
- **US/UK** — USD pricing
- **EU** — EUR pricing (future)

To add region-specific pricing:

1. Create products in each currency:
   ```json
   "price_rds_alpha_zar": "ZAR pricing",
   "price_rds_alpha_gbp": "GBP pricing"
   ```

2. Update shop.html to detect user region:
   ```javascript
   const userRegion = Intl.DateTimeFormat().resolvedOptions().timeZone;
   // Show appropriate pricing
   ```

---

## 📈 Roadmap Features

### Phase 2 (Q1 2026)
- [ ] User accounts & purchase history
- [ ] Digital product delivery (email with download links)
- [ ] Email receipt with invoice PDF
- [ ] Coupon/discount code system
- [ ] Product reviews and testimonials

### Phase 3 (Q2 2026)
- [ ] Team/Organization accounts
- [ ] Seat-based licensing for Rough Diamond Studio
- [ ] Integration with Stripe tax calculation
- [ ] Refund/return management
- [ ] Analytics dashboard (revenue, conversions, etc.)

### Phase 4 (Q3 2026)
- [ ] Rough Diamond Studio Team Edition product
- [ ] BPO Management System product
- [ ] Affiliate program
- [ ] Enterprise licensing
- [ ] API access for partners

---

## 🚀 Adding New Products

### To add a product to the shop:

1. **Edit `products.json`:**
   ```json
   {
     "id": "my-new-product",
     "name": "My New Product",
     "category": "software",
     "price": 4900,
     "displayPrice": "$49.00",
     "description": "...",
     "status": "active"
   }
   ```

2. **Create Stripe product:**
   - Go to Stripe Dashboard → Products
   - Create product with correct pricing
   - Copy Price ID

3. **Update `stripePriceId` in products.json**

4. **Commit and push:**
   ```bash
   git add products.json
   git commit -m "add: new product — [name]"
   git push
   ```

The shop will auto-update within minutes as Render redeploys.

---

## 🔐 Security

- All sensitive keys stored in environment variables (not in code)
- CORS configured for your domain only
- Stripe webhook signature verification
- HTTPS enforced (Render auto-ssl)
- Directory traversal prevention
- XSS, clickjacking, and frame embedding protections

---

## 📊 Testing Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```
   STRIPE_SECRET_KEY=sk_test_xxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxx
   PORT=3000
   ```

3. **Start server:**
   ```bash
   npm start
   ```

4. **Visit:** `http://localhost:3000/shop.html`

5. **Test Stripe checkout:**
   - Use card: `4242 4242 4242 4242`
   - Any future expiry and CVC

---

## 📝 Deployment to Render.com

The site auto-deploys on every git push to `main`:

1. Changes pushed → GitHub
2. Render detects changes
3. Runs `npm install` (installs Stripe SDK)
4. Runs `node server.js`
5. Live within 2-3 minutes

To manually redeploy:
- Visit **Render Dashboard** → **Manual Deploy**

---

## 🆘 Troubleshooting

### Logo not showing?
- Check image path: `./images/Dog 5.png`
- File must exist locally and be pushed to GitHub

### Stripe checkout fails?
- Check `STRIPE_PUBLISHABLE_KEY` is set in shop.html
- Verify Price IDs in products.json match Stripe dashboard
- Test with Stripe test mode keys first

### Products not loading?
- Run `curl http://localhost:3000/api/products`
- Check `products.json` is valid JSON
- Look at server logs for errors

### Cart not persisting?
- Browser localStorage might be disabled
- Check browser console for errors
- Verify not using private/incognito mode

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `server.js` | Node.js server + Stripe API |
| `shop.html` | Frontend shop with cart |
| `products.json` | Product database |
| `constants.js` | Brand config + product helpers |
| `checkout-success.html` | Post-purchase confirmation |
| `.env.example` | Config template |
| `package.json` | Dependencies + Stripe SDK |

---

## 🎯 Next Steps

1. **Get Stripe account** → https://stripe.com
2. **Add API keys to Render** environment variables
3. **Create products in Stripe Dashboard**
4. **Update `stripePriceId` in products.json**
5. **Test checkout** with test mode
6. **Go live** with production keys

---

**Built for operators who ship weekly.** Questions? Check the source code or contact the team.
