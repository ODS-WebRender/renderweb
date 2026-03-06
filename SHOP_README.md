# 🚀 Product Activation Checklist & Quick Launch Guide

**For:** Adding RDS, Podcasts, Courses, Journals, Audiobooks  
**Status:** Ready to implement incrementally  
**Timeline:** Launch products as they're ready (no waiting required)

---

## ✅ What's Ready NOW

| Product | Status | What You Need |
|---------|--------|-----------------|
| **RDS (Software)** | ✅ Ready | Download link + instructions |
| **Journals (PDFs)** | ✅ Ready | PDF files |
| **Audiobooks (MP3s)** | ✅ Ready | Audio files |
| **Podcasts** | ⏳ Simple | Hosting platform + RSS |
| **Courses** | ⏳ Complex | Phase 3 portal build |

---

## 🎯 How to Launch Products

### Option A: TODAY (5 minutes)
```
1. Edit products.json
2. Add product entry
3. git push → 2-3 min deploy
4. Product is LIVE
```

### Option B: WITH DELIVERY (1-3 days)
```
1. Prepare product files
2. Add file delivery endpoint
3. Update email template
4. Test purchase
5. Launch!
```

### Option C: FULL INTEGRATION (Phase 3)
```
1. Build custom portal
2. Advanced access control
3. Subscription support
4. Analytics tracking
```

---

## 🎯 RDS (Rough Diamond Studio)

**Status:** ✅ Ready to launch  
**Needs:** Download link + setup instructions

**Current:** Already in products.json with alpha status  
**To Launch:**
1. Decide where to host RDS (GitHub, AWS S3, Dropbox)
2. Update email.js with download URL
3. Change status from "alpha" to "active"
4. Test with purchase
5. Go live!

**What Happens:**
- Customer buys RDS
- License key auto-generated: `RDS-XXXXX-XXXXX-XXXXX`
- Email sent with:
  - License key
  - Download link
  - Installation guide
  - Support info

---

## 📚 Journals & PDFs

**Status:** ✅ Ready to launch  
**Needs:** PDF files ready

**Products Ready:**
- Business on Purpose Journal ($29)
- Systems Playbook ($39)
- When Life Bites Journal ($29)
- Wellness Guide ($19)

**To Launch:**
1. Finalize PDF files
2. Add 15-line file delivery endpoint to server.js
3. Update email template with download link
4. Change status to "active"
5. Go live!

**What Happens:**
- Customer buys journal
- PDF generated in invoice
- Email sent with download link
- Customer downloads journal

---

## 🎙️ Podcasts

**Status:** ⏳ Need hosting platform  
**Needs:** Choose: Transistor, Podbean, or Captivate

**Products to Create:**
- Bronze Tier: All episodes + forum ($4.99/mo)
- Silver Tier: Early access + Q&A ($9.99/mo)
- Gold Tier: 1-on-1 calls ($49.99/mo)

**To Launch (when platform chosen):**
1. Set up podcast hosting account
2. Create private tier/paywall
3. Add products to products.json
4. Configure email with RSS feed URL
5. Test subscription

**What Happens:**
- Customer buys podcast tier
- Email sent with private RSS URL
- Customer subscribes in podcast app
- New episodes auto-delivered

---

## 🎬 Courses

**Status:** ⏳ Phase 3 (portal needed)  
**Needs:** Curriculum finalized, videos prepared

**To Plan (Phase 3):**
1. Finalize 6-week course
2. Prepare video content
3. Plan schedule
4. Decide: weekly release or on-demand
5. Notify me for portal build

**What Will Happen:**
- Customer buys course
- Portal access created
- Week 1 materials sent
- New lessons released weekly
- Certificates issued on completion

---

## 🎵 Audiobooks

**Status:** ✅ Ready (simple version)  
**Needs:** MP3 audio files

**To Launch:**
1. Prepare audiobook MP3s
2. Upload to `data/files/audiobooks/`
3. Add products to products.json
4. Use same file delivery as journals
5. Go live!

**What Happens:**
- Customer buys audiobook
- Email sent with download link
- Customer downloads MP3
- Can listen offline

---

## 📊 Current Product Catalog

### In products.json (Ready to activate):
```
Software:
  ✅ Rough Diamond Studio Alpha ($99)

Business on Purpose:
  ✅ Founder's Journal ($29)
  ✅ Systems Playbook ($39)
  ⏳ Building Systems Course ($149)
  ✅ Essentials Bundle ($59)

When Life Bites:
  ✅ Resilience Journal ($29)
  ✅ Companion Guide ($19)
  ✅ 3-Day Retreat Program ($799)
```

---

## 🚀 Quick Start: Add a Product TODAY

### Step 1: Edit products.json
```bash
# Open file
nano products.json
```

### Step 2: Add Entry
```json
{
  "id": "podcast-bronze-tier",
  "name": "Rough Diamond Studio Access - Bronze",
  "category": "media",
  "price": 4900,
  "displayPrice": "$49.00",
  "description": "Monthly podcast access + community",
  "status": "active",
  "format": "subscription"
}
```

### Step 3: Deploy
```bash
git add products.json
git commit -m "Add: Podcast bronze tier"
git push origin main
# 2-3 min → Live in shop!
```

### Step 4: Test
1. Go to shop.html
2. See new product
3. Try purchase with test card: 4242 4242 4242 4242
4. Check admin dashboard for order

---

## 📦 File Delivery Setup

### For Journals & Audiobooks:
```bash
# Create directories
mkdir -p data/files/journals
mkdir -p data/files/audiobooks
mkdir -p data/files/templates

# Add your files here:
# data/files/journals/bop-journal.pdf
# data/files/audiobooks/audiobook-title.mp3
```

### Add Endpoint (copy to server.js):
```javascript
// GET /api/downloads/file/:type/:productId
if (pathname.match(/^\/api\/downloads\/file\/[^/]+\/[^/]+$/) && req.method === 'GET') {
  const [type, productId] = pathname.split('/').slice(-2);
  const filePath = path.join(__dirname, 'data', 'files', type, `${productId}.pdf`);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendJSON(res, { error: 'File not found' }, 404);
      return;
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${productId}.pdf"`);
    res.writeHead(200);
    res.end(data);
  });
  return;
}
```

### Update Email (in email.js):
```javascript
// Add download link to sendOrderConfirmation
const downloadLinks = {};
order.items.forEach(item => {
  if (item.category === 'media' && item.format === 'digital-pdf') {
    downloadLinks[item.id] = `${process.env.DOMAIN}/api/downloads/file/${item.category}/${item.id}`;
  }
});
```

---

## 🎯 Launch Priority

### This Week:
- [ ] RDS - add download URL
- [ ] Journals - prepare PDFs

### Next Week:
- [ ] Choose podcast platform
- [ ] Add podcast products
- [ ] Audiobooks - prepare MP3s

### Later (Phase 3):
- [ ] Course portal
- [ ] Advanced features

---

## 💡 Can You Push Directly?

**YES - Products.json:**
- Add/update products: Edit → Push → 2-3 min deploy

**YES - With Code Changes:**
- File delivery: Add endpoint → Push → 2-3 min deploy
- Email templates: Update → Push → 2-3 min deploy

**NOT YET - Complex:**
- Course portal: Needs development (Phase 3)
- Advanced integrations: Needs planning

---

## 🔗 Key Links

- **Shop:** https://renderweb.onrender.com/shop.html
- **Products:** products.json in repo
- **Documentation:** [PRODUCT_ACTIVATION_GUIDE.md](PRODUCT_ACTIVATION_GUIDE.md)

---

## ✨ Summary

✅ You can add products TODAY via products.json  
✅ Delivery systems ready for PDFs, audio, and software  
⏳ Complex features (courses, advanced) in Phase 3  
🚀 Launch as products are ready - no waiting for all at once
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
