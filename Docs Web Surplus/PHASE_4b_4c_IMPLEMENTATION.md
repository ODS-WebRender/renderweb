# Phase 4b + 4c Implementation: Subscriptions & Affiliate System

**Completion Date:** March 7, 2026  
**Status:** ✅ Backend Complete | ✅ Frontend Complete | ⏳ Production Deployment  
**Last Updated:** Phase 4b+4c Full Implementation

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Phase 4b: Subscriptions System](#phase-4b-subscriptions-system)
3. [Phase 4c: Affiliate System](#phase-4c-affiliate-system)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Integration Guide](#integration-guide)
7. [Testing Procedures](#testing-procedures)
8. [Production Deployment](#production-deployment)

---

## 🎯 Overview

### Phase 4b: Recurring Subscriptions
Enables customers to create recurring subscriptions with automated billing cycles. Supports multiple billing periods (monthly, quarterly, annual) with pause/resume capabilities.

**Key Features:**
- Recurring billing with multiple cycles
- Subscription lifecycle management (create, cancel, pause, resume)
- Next billing date tracking
- PayFast recurring token integration
- Subscription analytics (MRR, ARR)

### Phase 4c: Affiliate & Referral System
Complete affiliate marketing system with commission tracking, automatic referral link generation, and payout management.

**Key Features:**
- Self-service affiliate registration
- Automatic affiliate code generation
- 15% commission rate (configurable)
- Referral tracking (pending → completed → paid)
- Affiliate dashboard with real-time statistics
- Admin approval workflow

---

## 🔄 Phase 4b: Subscriptions System

### Architecture

**Flow:**
```
1. Customer creates subscription via /api/subscriptions/create
2. Subscription stored in subscriptions.json with status="active"
3. Next billing date calculated based on billingCycle
4. PayFast token stored for recurring charges
5. Customer can pause/resume/cancel at any time
```

**Billing Cycles:**
- `monthly`: Bills every 30 days
- `quarterly`: Bills every 90 days
- `annual`: Bills every 365 days

### Database Schema

**File:** `data/subscriptions.json`

```javascript
{
  "subscription_id_1": {
    "id": "subscription_id_1",
    "customerEmail": "customer@example.com",
    "productId": "PLAN_BASIC",
    "productName": "Basic Plan",
    "billingCycle": "monthly",
    "amount": 199.99,
    "currency": "ZAR",
    "status": "active", // "active", "paused", "cancelled"
    "nextBillingDate": "2026-04-07",
    "createdAt": "2026-03-07T10:30:00Z",
    "pausedAt": null,
    "cancelledAt": null,
    "payfastToken": "token_abc123", // For recurring charges
    "renewalCount": 5,
    "failedAttempts": 0
  }
}
```

### Database Functions

**File:** `db.js`

```javascript
// Create new subscription
createSubscription(data)
// Returns: { id, customerEmail, productId, ..., status: "active" }

// Get subscription by ID
getSubscription(subscriptionId)
// Returns: subscription object or null

// Get customer's subscriptions
getSubscriptionsByCustomer(email)
// Returns: [subscription, subscription, ...]

// Update subscription status/fields
updateSubscription(subscriptionId, updates)
// Returns: updated subscription object

// Cancel subscription immediately
cancelSubscription(subscriptionId)
// Returns: { status: "cancelled", cancelledAt: timestamp }

// Get all subscriptions (admin)
getAllSubscriptions()
// Returns: [subscription, subscription, ...]

// Get active subscriptions only
getActiveSubscriptions()
// Returns: [subscription, subscription, ...]

// Analytics
getSubscriptionStats()
// Returns: {
//   totalSubscriptions: number,
//   activeCount: number,
//   pausedCount: number,
//   totalMRR: number,
//   totalARR: number
// }
```

### API Endpoints

#### 1. Create Subscription
**POST** `/api/subscriptions/create`

**Authentication:** JWT (Customer)

**Request Body:**
```json
{
  "productId": "PLAN_BASIC",
  "productName": "Basic Plan",
  "amount": 199.99,
  "billingCycle": "monthly"
}
```

**Response (201):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123456",
    "customerEmail": "user@example.com",
    "productId": "PLAN_BASIC",
    "status": "active",
    "amount": 199.99,
    "billingCycle": "monthly",
    "nextBillingDate": "2026-04-07",
    "createdAt": "2026-03-07T10:30:00Z"
  }
}
```

**Error (400):**
```json
{ "error": "Missing required fields: productId, amount, billingCycle" }
```

#### 2. Get User Subscriptions
**GET** `/api/subscriptions`

**Authentication:** JWT (Customer)

**Response (200):**
```json
{
  "subscriptions": [
    {
      "id": "sub_123456",
      "productId": "PLAN_BASIC",
      "status": "active",
      "amount": 199.99,
      "billingCycle": "monthly",
      "nextBillingDate": "2026-04-07"
    }
  ],
  "stats": {
    "activeCount": 1,
    "totalValue": 199.99
  }
}
```

#### 3. Cancel Subscription
**POST** `/api/subscriptions/:id/cancel`

**Authentication:** JWT (Customer)

**Response (200):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123456",
    "status": "cancelled",
    "cancelledAt": "2026-03-07T11:45:00Z"
  }
}
```

#### 4. Pause Subscription
**POST** `/api/subscriptions/:id/pause`

**Authentication:** JWT (Customer)

**Response (200):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123456",
    "status": "paused",
    "pausedAt": "2026-03-07T11:45:00Z"
  }
}
```

#### 5. Resume Subscription
**POST** `/api/subscriptions/:id/resume`

**Authentication:** JWT (Customer)

**Response (200):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_123456",
    "status": "active",
    "nextBillingDate": "2026-04-07"
  }
}
```

---

## 👥 Phase 4c: Affiliate System

### Architecture

**Flow:**
```
1. Potential affiliate submits join request via /api/affiliates/join (public)
2. System generates unique affiliate code (AFF123ABC)
3. Affiliate created with status="pending"
4. Admin reviews via /api/admin/affiliates/approve (Bearer token)
5. Affiliate gets dashboard access via /api/affiliates/dashboard
6. Customer clicks referral link ?ref=AFF123ABC
7. Referral tracked and linked to affiliate
8. Commission automatic on order completion
```

**Commission Flow:**
- Affiliate receives 15% commission (configurable)
- Status: `pending` (referral created)
- Status: `completed` (order fulfilled)
- Status: `paid` (payout processed)

### Database Schema

**File:** `data/affiliates.json`

```javascript
{
  "affiliate_id_1": {
    "id": "affiliate_id_1",
    "affiliateCode": "AFF123ABC",
    "email": "affiliate@example.com",
    "name": "John Affiliate",
    "website": "https://example.com",
    "status": "approved", // "pending", "approved", "suspended"
    "commissionRate": 15,
    "referralLink": "https://old-dog-web.onrender.com/shop?ref=AFF123ABC",
    "totalReferrals": 5,
    "totalCommission": 1499.95,
    "totalPaidOut": 999.95,
    "pendingCommission": 500.00,
    "bankDetails": {
      "accountName": "John Doe",
      "bankName": "Standard Bank",
      "accountNumber": "1234567890",
      "branchCode": "050001"
    },
    "createdAt": "2026-03-01T09:00:00Z",
    "approvedAt": "2026-03-02T14:30:00Z"
  }
}
```

**File:** `data/referrals.json`

```javascript
{
  "referral_id_1": {
    "id": "referral_id_1",
    "affiliateCode": "AFF123ABC",
    "affiliateId": "affiliate_id_1",
    "customerEmail": "customer@example.com",
    "orderId": "order_123456",
    "amount": 999.99,
    "commission": 149.99,
    "status": "completed", // "pending", "completed", "paid"
    "createdAt": "2026-03-05T10:00:00Z",
    "completedAt": "2026-03-05T11:30:00Z",
    "paidAt": null
  }
}
```

### Database Functions

**File:** `db.js`

#### Affiliate Functions

```javascript
// Register new affiliate (creates pending)
createAffiliate(data)
// Returns: { id, affiliateCode, email, status: "pending" }

// Get affiliate by ID
getAffiliate(affiliateId)
// Returns: affiliate object or null

// Get affiliate by code
getAffiliateByCode(code)
// Returns: affiliate object or null

// Get affiliate by email
getAffiliateByEmail(email)
// Returns: affiliate object or null

// Update affiliate (status, bank details, etc)
updateAffiliate(affiliateId, updates)
// Returns: updated affiliate object

// Get all affiliates (admin)
getAllAffiliates()
// Returns: [affiliate, affiliate, ...]

// Get approved affiliates only
getApprovedAffiliates()
// Returns: [affiliate, affiliate, ...]
```

#### Referral Functions

```javascript
// Create referral record
createReferral(data)
// Returns: { id, affiliateCode, customerEmail, orderId, commission, status: "pending" }

// Get all referrals for affiliate
getReferralsByAffiliate(code)
// Returns: [referral, referral, ...]

// Update referral status
updateReferral(referralId, updates)
// Returns: updated referral object

// Get affiliate statistics
getAffiliateStats(code)
// Returns: {
//   totalReferrals: number,
//   completedReferrals: number,
//   totalValue: number,
//   totalCommission: number,
//   pendingCommission: number
// }
```

### API Endpoints

#### 1. Join Affiliate Program
**POST** `/api/affiliates/join`

**Authentication:** None (Public)

**Request Body:**
```json
{
  "email": "affiliate@example.com",
  "name": "John Affiliate",
  "website": "https://example.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "affiliateCode": "AFF123ABC",
  "referralLink": "https://old-dog-web.onrender.com/shop?ref=AFF123ABC",
  "message": "Application submitted. Pending admin approval."
}
```

**Error (400):**
```json
{ "error": "Email already registered as affiliate" }
```

#### 2. Get Affiliate Dashboard
**GET** `/api/affiliates/dashboard?code=AFF123ABC`

**Authentication:** None (Public, code-based)

**Response (200):**
```json
{
  "affiliate": {
    "affiliateCode": "AFF123ABC",
    "name": "John Affiliate",
    "email": "affiliate@example.com",
    "status": "approved",
    "commissionRate": 15,
    "referralLink": "https://old-dog-web.onrender.com/shop?ref=AFF123ABC",
    "totalReferrals": 5,
    "totalCommission": 1499.95,
    "pendingCommission": 500.00,
    "totalPaidOut": 999.95
  },
  "stats": {
    "totalReferrals": 5,
    "completedReferrals": 3,
    "totalValue": 2999.97,
    "totalCommission": 449.99,
    "pendingCommission": 225.00
  },
  "recentReferrals": [
    {
      "customerEmail": "customer@example.com",
      "productId": "PLAN_PRO",
      "amount": 999.99,
      "commission": 149.99,
      "status": "completed",
      "createdAt": "2026-03-05T10:00:00Z"
    }
  ]
}
```

#### 3. Get Affiliate Referrals
**GET** `/api/affiliates/:code/referrals`

**Authentication:** None (Public, code-based)

**Response (200):**
```json
{
  "referrals": [
    {
      "id": "referral_id_1",
      "customerEmail": "customer1@example.com",
      "productId": "PLAN_BASIC",
      "amount": 199.99,
      "commission": 29.99,
      "status": "completed",
      "createdAt": "2026-03-05T10:00:00Z"
    }
  ],
  "stats": {
    "totalReferrals": 5,
    "pending": 1,
    "completed": 3,
    "paid": 1,
    "totalValue": 2999.97,
    "totalCommission": 449.99
  }
}
```

#### 4. Admin: Approve Affiliate
**POST** `/api/admin/affiliates/approve`

**Authentication:** Bearer Token (Admin)

**Request Body:**
```json
{
  "affiliateId": "affiliate_id_1"
}
```

**Response (200):**
```json
{
  "success": true,
  "affiliate": {
    "id": "affiliate_id_1",
    "affiliateCode": "AFF123ABC",
    "status": "approved",
    "approvedAt": "2026-03-07T14:30:00Z"
  }
}
```

#### 5. Admin: List All Affiliates
**GET** `/api/admin/affiliates`

**Authentication:** Bearer Token (Admin)

**Response (200):**
```json
{
  "affiliates": [
    {
      "id": "affiliate_id_1",
      "affiliateCode": "AFF123ABC",
      "email": "affiliate@example.com",
      "name": "John Affiliate",
      "status": "approved",
      "totalReferrals": 5,
      "totalCommission": 1499.95,
      "totalPaidOut": 999.95,
      "createdAt": "2026-03-01T09:00:00Z"
    }
  ],
  "stats": {
    "totalAffiliates": 10,
    "approved": 7,
    "pending": 2,
    "suspended": 1,
    "totalCommissionsPaid": 5499.95
  }
}
```

---

## 🗄️ Database Schema

### Directory Structure

```
data/
├── orders.json              # Existing
├── customers.json           # Existing
├── licenses.json            # Existing
├── alphaInquiries.json      # Existing
├── subscriptions.json       # NEW (Phase 4b)
├── affiliates.json          # NEW (Phase 4c)
└── referrals.json          # NEW (Phase 4c)
```

### Key Relationships

```
Customer
├── Order (1:N)
│   └── Referral (if affiliated)
│       └── Affiliate
└── Subscription (1:N)

Affiliate
├── Referral (1:N)
└── Commission (calculated from Referrals)
```

---

## 🔌 Integration Guide

### 1. Integrate Subscriptions into Dashboard

**Location:** `dashboard.html`

**Add Tab:** "Subscriptions"

```html
<button title="Manage Subscriptions">
  Subscriptions (ID: subscription-tab)
</button>
```

**Content:**
```html
<div id="subscriptions-content" class="hidden">
  <!-- Subscription list -->
  <!-- Create subscription button -->
  <!-- Pause/Resume/Cancel buttons -->
</div>
```

**JavaScript Integration:**
```javascript
async function loadSubscriptions() {
  const response = await fetch('/api/subscriptions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  displaySubscriptions(data.subscriptions);
}
```

### 2. Integrate Affiliate Dashboard

**Standalone File:** `affiliate-dashboard.html`

**Access:** `/affiliate-dashboard.html`

**Flow:**
1. Affiliate enters code → `/api/affiliates/dashboard?code=ABC`
2. Shows stats, referral link, recent referrals
3. Real-time commission tracking

### 3. Add Referral Tracking to Checkout

**Location:** `server.js` → Checkout endpoint

**When Customer Completes Purchase:**
```javascript
// Extract referral code from query params
const referralCode = req.query.ref;

if (referralCode) {
  // Create referral record
  const affiliate = db.getAffiliateByCode(referralCode);
  if (affiliate) {
    db.createReferral({
      affiliateCode: referralCode,
      affiliateId: affiliate.id,
      customerEmail: customerEmail,
      orderId: order.id,
      amount: order.total,
      commission: (order.total * affiliate.commissionRate) / 100,
      status: 'pending'
    });
  }
}
```

---

## 🧪 Testing Procedures

### Phase 4b: Subscriptions Testing

#### Test 1: Create Subscription
```bash
curl -X POST http://localhost:3000/api/subscriptions/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "productId": "PLAN_BASIC",
    "productName": "Basic Plan",
    "amount": 199.99,
    "billingCycle": "monthly"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_xxxxx",
    "status": "active",
    "nextBillingDate": "2026-04-07"
  }
}
```

#### Test 2: Get Subscriptions
```bash
curl -X GET http://localhost:3000/api/subscriptions \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Test 3: Pause Subscription
```bash
curl -X POST http://localhost:3000/api/subscriptions/sub_xxxxx/pause \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Test 4: Resume Subscription
```bash
curl -X POST http://localhost:3000/api/subscriptions/sub_xxxxx/resume \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Test 5: Cancel Subscription
```bash
curl -X POST http://localhost:3000/api/subscriptions/sub_xxxxx/cancel \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

### Phase 4c: Affiliate Testing

#### Test 1: Join Program
```bash
curl -X POST http://localhost:3000/api/affiliates/join \
  -H "Content-Type: application/json" \
  -d '{
    "email": "affiliate@example.com",
    "name": "John Affiliate",
    "website": "https://example.com"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "affiliateCode": "AFF123ABC",
  "referralLink": "https://old-dog-web.onrender.com/shop?ref=AFF123ABC"
}
```

#### Test 2: Get Affiliate Dashboard
```bash
curl http://localhost:3000/api/affiliates/dashboard?code=AFF123ABC
```

#### Test 3: Get Affiliate Referrals
```bash
curl http://localhost:3000/api/affiliates/AFF123ABC/referrals
```

#### Test 4: Admin Approve Affiliate
```bash
curl -X POST http://localhost:3000/api/admin/affiliates/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{
    "affiliateId": "affiliate_id_1"
  }'
```

#### Test 5: Admin List Affiliates
```bash
curl http://localhost:3000/api/admin/affiliates \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

---

## 🚀 Production Deployment

### Render Environment Variables

**Add to Render Dashboard:**

```env
# PayFast Configuration (from Phase 4d)
PAYMENT_PROCESSOR=payfast
PAYFAST_MERCHANT_ID=34040991
PAYFAST_MERCHANT_KEY=uzi59baavudk5
DOMAIN=https://old-dog-web.onrender.com

# Existing Variables (keep these)
PORT=3000
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...
ADMIN_SECRET_TOKEN=...
```

### Deployment Checklist

- [ ] Set `PAYMENT_PROCESSOR=payfast` in Render
- [ ] Verify PayFast credentials in Render
- [ ] Test subscription creation on production
- [ ] Test affiliate join on production
- [ ] Verify referral link generation
- [ ] Monitor Render logs for errors
- [ ] Verify emails sent via SendGrid
- [ ] Test payment processing (use PayFast test mode)

### Render Deployment Steps

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Select Service:** old-dog-web
3. **Go to Environment:** Settings → Environment
4. **Update Variables:**
   - Change `PAYMENT_PROCESSOR` to `payfast`
   - Add PayFast merchant credentials
   - Verify `DOMAIN` points to Render URL
5. **Trigger Redeploy:**
   - Git push will auto-trigger
   - Or manually click "Redeploy" button
6. **Verify Logs:**
   - Check Logs tab for startup messages
   - Verify no errors on startup

---

## 📊 Metrics & Analytics

### Subscription Analytics

**Endpoint:** Use `/api/subscriptions` to calculate:
- **MRR (Monthly Recurring Revenue):** Sum of monthly subscriptions
- **ARR (Annual Recurring Revenue):** MRR × 12
- **Churn Rate:** Cancelled subscriptions / Total active
- **Growth Rate:** MoM subscriber growth

### Affiliate Analytics

**Endpoint:** Use `/api/admin/affiliates` to track:
- **Total Commission Paid:** Sum of all paid commissions
- **Pending Commission:** Sum of pending commissions
- **Conversion Rate:** Completed referrals / Total referrals
- **Average Commission:** Total commission / Total referrals
- **Top Affiliates:** Sort by totalReferrals or totalCommission

---

## 🔄 Next Steps

### Immediate (Next Deployment)
1. ✅ Backend implementation complete
2. ✅ Frontend dashboard complete
3. ⏳ Set Render environment variables
4. ⏳ Test on production
5. ⏳ Monitor for errors

### Phase 4f: Payment Optimization
- Retry failed payments
- Dunning management (collection workflow)
- Subscription renewal notifications
- Late payment handling

### Phase 5+: Future Features
- Mobile app integration
- Advanced analytics dashboard
- Automated payout processing
- Subscription usage-based billing
- Custom commission structures per affiliate

---

## ❓ FAQ & Troubleshooting

### Q: How do I change affiliate commission rate?
**A:** Edit `db.js` in `createAffiliate()` function. Change `commissionRate: 15` to desired percentage.

### Q: Can I manually approve affiliates?
**A:** Yes, use `POST /api/admin/affiliates/approve` with admin Bearer token.

### Q: What happens if a subscription payment fails?
**A:** Currently marked as `failedAttempts++`. Phase 4f will add retry logic.

### Q: How do customers access their subscriptions?
**A:** Via `/dashboard.html` → Subscriptions tab. Requires JWT login.

### Q: How do affiliates access their dashboard?
**A:** Via `/affiliate-dashboard.html` → Enter affiliate code. No login required.

### Q: Can affiliates see individual customer details?
**A:** No, only anonymized referral stats (first part of email hidden).

---

## 📝 Notes

- All timestamps in ISO 8601 format (UTC)
- Currency: ZAR (South African Rand) for PayFast
- Commission calculations automatic on referral completion
- No manual payout processing (Phase 4f feature)
- Database files auto-created if missing

---

**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** March 7, 2026
