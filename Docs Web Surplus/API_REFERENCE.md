# Old Dog Systems - REST API Reference

## Base URL

```
http://localhost:3000 (development)
https://old-dog-web.onrender.com (production)
```

## Authentication

### User Authentication (JWT Tokens)
- Used for customer-facing endpoints
- Format: `Authorization: Bearer {jwt_token}`
- Token lifespan: 30 days

### Admin Authentication (Bearer Tokens)
- Used for admin-facing endpoints
- Format: `Authorization: Bearer {admin_token}`
- Token obtained from `/api/admin/login`

---

## Customer Accounts (Phase 4a)

### POST /api/accounts/create
Create a new customer account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

**Response:** 201 Created
```json
{
  "success": true,
  "account": {
    "id": "cust_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-03-07T10:30:00Z",
    "verified": false
  },
  "message": "Account created successfully"
}
```

**Errors:**
- 400: Email already exists
- 400: Invalid email format
- 400: Password too weak

---

### POST /api/accounts/login
Authenticate customer and get JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cust_abc123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Errors:**
- 401: Invalid email or password
- 400: Email required

---

### GET /api/accounts/profile
Get authenticated user's profile information.

**Authentication:** Required (JWT)

**Response:** 200 OK
```json
{
  "id": "cust_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-03-07T10:30:00Z",
  "verified": false,
  "preferences": {}
}
```

**Errors:**
- 401: Unauthorized
- 404: User not found

---

### GET /api/customer/orders
Get customer's order history with statistics.

**Authentication:** Required (JWT)

**Query Parameters:** None

**Response:** 200 OK
```json
{
  "orders": [
    {
      "id": "ord_xyz789",
      "customerEmail": "user@example.com",
      "createdAt": "2026-03-05T14:22:00Z",
      "status": "completed",
      "items": [
        {
          "id": "prod_1",
          "name": "Pro Plan Annual",
          "price": 299.99,
          "displayPrice": "$299.99",
          "quantity": 1
        }
      ],
      "totalAmount": 299.99,
      "licenseKeys": {
        "prod_1": "PRO-ANNUAL-ABC123XYZ"
      }
    }
  ],
  "count": 1,
  "totalSpent": 299.99
}
```

**Errors:**
- 401: Unauthorized
- 500: Database error

---

### GET /api/customer/licenses
Get all license keys from customer's purchases.

**Authentication:** Required (JWT)

**Response:** 200 OK
```json
{
  "licenses": [
    {
      "key": "PRO-ANNUAL-ABC123XYZ",
      "productId": "prod_1",
      "productName": "Pro Plan Annual",
      "orderId": "ord_xyz789",
      "purchaseDate": "2026-03-05T14:22:00Z",
      "status": "active"
    }
  ],
  "count": 1
}
```

**Errors:**
- 401: Unauthorized
- 500: Database error

---

## Admin Dashboard (Phase 4e)

### POST /api/admin/login
Authenticate as admin and get bearer token.

**Request:**
```json
{
  "password": "admin_secure_password"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "token": "YWRtaW46MTc0MzAyNzAwMDAw",
  "message": "Login successful"
}
```

**Errors:**
- 401: Invalid password
- 400: Password required

---

### GET /api/admin/orders
Get all orders (admin view).

**Authentication:** Required (Bearer Token)

**Response:** 200 OK
```json
{
  "orders": [
    {
      "id": "ord_xyz789",
      "customerEmail": "user@example.com",
      "createdAt": "2026-03-05T14:22:00Z",
      "status": "completed",
      "items": [...],
      "totalAmount": 299.99,
      "stripeSessionId": "cs_test_abc123"
    }
  ],
  "count": 1
}
```

**Errors:**
- 401: Unauthorized
- 500: Database error

---

### GET /api/admin/customers
Get all customers with order statistics.

**Authentication:** Required (Bearer Token)

**Response:** 200 OK
```json
{
  "customers": [
    {
      "id": "cust_abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-03-05T14:22:00Z",
      "orderCount": 3,
      "totalSpent": 899.97,
      "lastOrder": "2026-03-06T09:15:00Z"
    }
  ],
  "count": 1
}
```

**Errors:**
- 401: Unauthorized
- 500: Database error

---

### GET /api/admin/dashboard
Get analytics and dashboard metrics.

**Authentication:** Required (Bearer Token)

**Response:** 200 OK
```json
{
  "stats": {
    "totalOrders": 45,
    "totalRevenue": 13499.55,
    "totalCustomers": 12,
    "averageOrderValue": 299.99,
    "refundedAmount": 599.98
  },
  "recentOrders": [
    {
      "id": "ord_xyz789",
      "customerEmail": "user@example.com",
      "createdAt": "2026-03-06T09:15:00Z",
      "totalAmount": 299.99
    }
  ],
  "chartData": {
    "dailyRevenue": [
      {"date": "2026-03-01", "amount": 299.99},
      {"date": "2026-03-02", "amount": 599.98}
    ],
    "topProducts": [
      {"name": "Pro Plan Annual", "count": 15},
      {"name": "Starter Plan", "count": 8}
    ],
    "customerSegments": {
      "firstTime": 8,
      "repeat": 3,
      "vip": 1
    }
  }
}
```

**Errors:**
- 401: Unauthorized
- 500: Database error

---

### POST /api/admin/refunds
Process a refund for an order.

**Authentication:** Required (Bearer Token)

**Request:**
```json
{
  "orderId": "ord_xyz789",
  "reason": "Customer requested cancellation"
}
```

**Response:** 200 OK
```json
{
  "success": true,
  "order": {
    "id": "ord_xyz789",
    "status": "refunded",
    "refundReason": "Customer requested cancellation",
    "refundedAt": "2026-03-07T10:45:00Z"
  },
  "message": "Order ord_xyz789 refunded successfully"
}
```

**Errors:**
- 401: Unauthorized
- 404: Order not found
- 400: Order already refunded
- 500: Database error

**Note:** 
- Customer is notified via email
- TODO: Integrate Stripe refund API for actual payment reversal

---

## Payment Processing (Phase 3 - Existing)

### POST /api/checkout
Create Stripe checkout session.

**Request:**
```json
{
  "items": [
    {
      "id": "prod_1",
      "quantity": 1
    }
  ],
  "productIdToName": {
    "prod_1": "Pro Plan Annual"
  }
}
```

**Response:** 200 OK
```json
{
  "sessionUrl": "https://checkout.stripe.com/pay/cs_test_abc123",
  "sessionId": "cs_test_abc123"
}
```

---

### POST /api/webhook
Stripe webhook for payment events.

**Event Types:**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

**Handlers:**
- Creates order in database
- Generates license keys
- Sends confirmation email
- Updates order status

---

## Product Endpoints (Existing)

### GET /api/products
Get all available products.

**Response:** 200 OK
```json
{
  "products": [
    {
      "id": "prod_1",
      "name": "Pro Plan Annual",
      "price": 299.99,
      "currency": "USD",
      "description": "...",
      "features": [...]
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error description",
  "code": "ERROR_CODE"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per minute per IP
- 10 requests per second per authenticated user

---

## CORS Policy

All endpoints allow cross-origin requests:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Data Models

### Order
```json
{
  "id": "ord_xyz789",
  "customerEmail": "user@example.com",
  "createdAt": "ISO timestamp",
  "status": "completed|pending|failed|refunded",
  "items": [
    {
      "id": "prod_1",
      "name": "Product Name",
      "price": 99.99,
      "quantity": 1
    }
  ],
  "totalAmount": 99.99,
  "stripeSessionId": "cs_test_xyz",
  "licenseKeys": {
    "prod_1": "LICENSE-KEY"
  },
  "refundReason": "optional",
  "refundedAt": "ISO timestamp (if refunded)"
}
```

### Customer
```json
{
  "id": "cust_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "passwordHash": "bcrypt hash",
  "createdAt": "ISO timestamp",
  "verified": false,
  "preferences": {}
}
```

### License
```json
{
  "key": "LICENSE-KEY-STRING",
  "productId": "prod_1",
  "productName": "Product Name",
  "orderId": "ord_xyz789",
  "purchaseDate": "ISO timestamp",
  "status": "active|expired|revoked"
}
```

---

## Implementation Checklist

- [x] Customer account creation & login
- [x] User profile endpoint
- [x] Order history endpoint
- [x] License keys endpoint
- [x] Admin login endpoint
- [x] Admin orders endpoint
- [x] Admin customers endpoint
- [x] Admin analytics endpoint
- [x] Admin refunds endpoint
- [ ] Stripe refund API integration
- [ ] Rate limiting
- [ ] Request validation middleware
- [ ] Pagination for large datasets
- [ ] Cache layer for analytics

---

## Deployment

### Environment Variables Required
```
ADMIN_PASSWORD=secure_password
PORT=3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SENDGRID_API_KEY=SG.xxx...
```

### Deployment Platforms
- Render (current: old-dog-web.onrender.com)
- Heroku
- Railway
- DigitalOcean App Platform

---

## Support & Documentation

- Testing Guide: [PHASE_4a_4e_TESTING.md](./PHASE_4a_4e_TESTING.md)
- Code Repository: [Old_Dog_Web GitHub](https://github.com/username/Old_Dog_Web)
- Issue Tracker: GitHub Issues
