# Phase 4a + 4e Testing Guide

## Overview

This guide provides step-by-step instructions for testing the customer accounts (Phase 4a) and admin dashboard (Phase 4e) implementations.

## Setup Requirements

1. **Environment Variables** (.env file):
   ```
   ADMIN_PASSWORD=your_secure_admin_password
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   SENDGRID_API_KEY=SG.xxx...
   ```

2. **Server Running**: 
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Access URLs**:
   - User Dashboard: `http://localhost:3000/dashboard.html`
   - Admin Dashboard: `http://localhost:3000/admin.html`

---

## Phase 4a: Customer Account Testing

### 1. User Registration and Login

**Step 1: Create Account**

```bash
curl -X POST http://localhost:3000/api/accounts/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "account": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "createdAt": "2026-03-07T..."
  },
  "message": "Account created successfully"
}
```

**Step 2: Login to Get JWT Token**

```bash
curl -X POST http://localhost:3000/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",  // JWT token for Bearer auth
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

Save the token value for the next requests.

### 2. Get User Profile

```bash
curl -X GET http://localhost:3000/api/accounts/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "id": "...",
  "email": "test@example.com",
  "name": "Test User",
  "createdAt": "2026-03-07T...",
  "verified": false
}
```

### 3. Get Customer Orders

```bash
curl -X GET http://localhost:3000/api/customer/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "orders": [
    {
      "id": "order_123",
      "createdAt": "2026-03-07T...",
      "status": "completed",
      "items": [
        {
          "id": "product_1",
          "name": "Pro Plan",
          "price": 99.99,
          "displayPrice": "$99.99"
        }
      ],
      "totalAmount": 99.99,
      "licenseKeys": {
        "product_1": "LICENSE-KEY-HERE"
      }
    }
  ],
  "count": 1,
  "totalSpent": 99.99
}
```

### 4. Get Customer Licenses

```bash
curl -X GET http://localhost:3000/api/customer/licenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "licenses": [
    {
      "key": "LICENSE-KEY-HERE",
      "productId": "product_1",
      "productName": "Pro Plan",
      "orderId": "order_123",
      "purchaseDate": "2026-03-07T...",
      "status": "active"
    }
  ],
  "count": 1
}
```

### 5. Test Dashboard UI

**In Browser:**
1. Navigate to `http://localhost:3000/dashboard.html`
2. You'll be redirected to login if not authenticated
3. After login, you should see:
   - Account email
   - Total purchases
   - Active licenses count
   - Order history with details
   - License keys with copy functionality

---

## Phase 4e: Admin Dashboard Testing

### 1. Admin Login

**Step 1: Get Admin Token**

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "password": "your_secure_admin_password"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "YWRtaW46MTc0MzAyNzAw...",
  "message": "Login successful"
}
```

Save this token for admin endpoint access.

### 2. Get All Orders (Admin View)

```bash
curl -X GET http://localhost:3000/api/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "orders": [
    {
      "id": "order_123",
      "customerEmail": "test@example.com",
      "createdAt": "2026-03-07T...",
      "status": "completed",
      "items": [...],
      "totalAmount": 99.99
    }
  ],
  "count": 1
}
```

### 3. Get All Customers (with stats)

```bash
curl -X GET http://localhost:3000/api/admin/customers \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "customers": [
    {
      "id": "cust_123",
      "email": "test@example.com",
      "name": "Test User",
      "orderCount": 2,
      "totalSpent": 199.98,
      "lastOrder": "2026-03-07T..."
    }
  ],
  "count": 1
}
```

### 4. Get Analytics Dashboard

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response:**
```json
{
  "stats": {
    "totalOrders": 10,
    "totalRevenue": 999.99,
    "totalCustomers": 5,
    "refundedAmount": 0
  },
  "recentOrders": [...],
  "chartData": {
    "dailyRevenue": [...],
    "topProducts": [...],
    "customerSegments": {...}
  }
}
```

### 5. Process Refund

```bash
curl -X POST http://localhost:3000/api/admin/refunds \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order_123",
    "reason": "Customer requested refund"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_123",
    "status": "refunded",
    "refundReason": "Customer requested refund",
    "refundedAt": "2026-03-07T..."
  },
  "message": "Order order_123 refunded successfully"
}
```

**Verification:**
- Email should be sent to customer
- Order status should change to "refunded"
- Check email logs in SendGrid dashboard

### 6. Test Admin Dashboard UI

**In Browser:**
1. Navigate to `http://localhost:3000/admin.html`
2. Enter admin password
3. Should see dashboard with tabs:
   - **Orders**: Search & filter orders, view details
   - **Customers**: Table showing customer stats (orders, total spent, last order)
   - **Analytics**: Dashboard metrics and recent activity
   - **Refunds**: Form to process refunds with reason

---

## Testing Workflow

### Test Flow 1: Complete Purchase → Admin Review

1. Create customer account
2. Make purchase (creates order with license key)
3. Customer views orders & licenses on dashboard
4. Admin views orders & customer on admin dashboard
5. Admin processes refund if needed

### Test Flow 2: Analytics Tracking

1. Create 3-5 test orders with different products
2. Check `/api/admin/dashboard` metrics update
3. Verify topProducts shows correct counts
4. Check recent orders displays latest orders

### Test Flow 3: Customer Management

1. Create 2-3 test customers with orders
2. Check `/api/admin/customers` enrichment
3. Verify orderCount, totalSpent calculations
4. Check lastOrder timestamp accuracy

---

## Common Issues & Troubleshooting

### Issue: "Unauthorized - Bearer token required"
- **Cause**: Missing or malformed Authorization header
- **Fix**: Ensure header is exactly: `Authorization: Bearer YOUR_TOKEN`

### Issue: "Invalid password" on admin login
- **Cause**: ADMIN_PASSWORD environment variable not set or incorrect
- **Fix**: Set `ADMIN_PASSWORD` in .env file

### Issue: Refund email not sent
- **Cause**: SendGrid not configured or email function error
- **Fix**: Check SENDGRID_API_KEY in .env, verify email.js has sendRefundNotification function

### Issue: 404 on endpoints
- **Cause**: Endpoints not added or server not restarted
- **Fix**: Verify server.js has all endpoints, restart `node server.js`

### Issue: CORS errors in browser
- **Cause**: Missing CORS headers
- **Fix**: Verify server.js sets `Access-Control-Allow-*` headers (already set)

---

## Success Criteria

✅ **Phase 4a Complete When:**
- User can create account
- User can login and get JWT token
- GET /api/accounts/profile returns user data
- GET /api/customer/orders returns user's orders with stats
- GET /api/customer/licenses returns user's licenses
- dashboard.html displays all data correctly

✅ **Phase 4e Complete When:**
- Admin can login with password
- GET /api/admin/orders returns all orders
- GET /api/admin/customers returns enriched customer list
- GET /api/admin/dashboard returns analytics data
- POST /api/admin/refunds processes refund and sends email
- admin.html shows all tabs and data correctly

---

## Performance Notes

- Order queries filter by customer email (O(n) - consider indexing)
- Customer list pulls all customers + orders each time (could be cached)
- Refund email notification is async but not awaited in response
- TODO: Add actual Stripe refund API call in production

---

## Next Steps (Phase 4c/4d)

1. **Phase 4b**: Add subscription endpoints
2. **Phase 4c**: Add affiliate system endpoints
3. **Phase 4d**: Add Lemon Squeezy integration
4. Add caching layer for analytics
5. Add pagination for large datasets
6. Add order notes/comments system
