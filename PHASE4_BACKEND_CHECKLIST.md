# Phase 4 Backend Implementation Checklist

## 🎯 Goal
Add API endpoints to `server.js` so the dashboard can fetch real user data, orders, and handle authentication.

---

## 📋 Endpoints to Add to server.js

### Endpoint 1: GET /api/dashboard (Critical)
**Purpose:** Fetch all dashboard data for authenticated user

```javascript
router.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const customerId = req.user.id;  // From JWT token
    
    // TODO: Read customer record from /data/customers/{customerId}.json
    // TODO: Read all orders from /data/orders/ matching customer
    // TODO: Count total purchases and total spent
    // TODO: Build response with user + stats + orders
    
    res.json({
      user: {
        id: customerId,
        email: req.user.email,
        name: req.user.name || 'Customer'
      },
      stats: {
        totalPurchases: 5,         // Count of orders
        totalSpent: 89999          // Sum of order amounts (cents)
      },
      orders: [
        // Array of orders with full details
        // See response format in PHASE4_MEMBER_DASHBOARD.md section 2.3
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Endpoint 2: POST /api/accounts/login (High Priority)
**Purpose:** Authenticate user with email/password, return JWT token

```javascript
router.post('/api/accounts/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Find customer by email in /data/customers/
    // TODO: Compare password hash (bcrypt.compare)
    // TODO: Generate JWT token with user.id, user.email
    // TODO: Return token + basic user data
    
    // HINT: Use JWT secret from process.env.JWT_SECRET
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});
```

### Endpoint 3: POST /api/accounts/register (Medium Priority)
**Purpose:** Create new customer account

```javascript
router.post('/api/accounts/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // TODO: Check if email already exists
    // TODO: Hash password (bcrypt.hash with 10 rounds)
    // TODO: Create customer record in /data/customers/
    // TODO: Generate JWT token
    // TODO: Return token + user data
    
    if (response.status === 409) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Similar response to login endpoint
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Endpoint 4: POST /api/email-preferences (Lower Priority)
**Purpose:** Save user's email communication preferences

```javascript
router.post('/api/email-preferences', authenticateToken, async (req, res) => {
  try {
    const { updates, newsletter } = req.body;
    const customerId = req.user.id;
    
    // TODO: Load customer from /data/customers/{customerId}.json
    // TODO: Update emailPreferences object
    // TODO: Save customer back to file
    // TODO: Return confirmation
    
    res.json({ success: true, message: 'Preferences saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 🔐 Authentication Middleware

Add this function to server.js (if not already there from Phase 3):

```javascript
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // "Bearer {token}"
  
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;  // Attach user data to request
    next();           // Continue to next middleware
  });
}
```

---

## 💾 File Structure for Data

The Phase 3 setup created this structure. Phase 4 backend **reads** from it:

```
/data/
├── customers/              ← NEW (for Phase 4)
│   ├── cust_12345.json    
│   ├── cust_67890.json    
│   └── cust_xxxxx.json
│
├── orders/                 ← FROM PHASE 3
│   ├── order_abc123.json  (already created by webhook)
│   ├── order_def456.json  (already created by webhook)
│   └── ...
│
├── licenses/               ← FROM PHASE 3
│   ├── rds_key_001.json
│   └── ...
│
├── invoices/               ← FROM PHASE 3
│   └── invoice_*.pdf

```

### New: Customer Record Format

```json
{
  "id": "cust_12345",
  "email": "user@example.com",
  "name": "John Doe",
  "passwordHash": "$2b$10$N9qo8uLOickgx2ZMRZoMye",
  "createdAt": "2025-01-10T09:00:00Z",
  "emailPreferences": {
    "transactional": true,
    "updates": false,
    "newsletter": false
  },
  "verified": true
}
```

---

## 📦 Dependencies Needed

Check if already installed in `package.json`:

```json
{
  "jsonwebtoken": "^9.0.0",    // For JWT tokens
  "bcryptjs": "^2.4.3",        // For password hashing
  "express": "^4.18.0"         // Already have
}
```

If missing, install with:
```bash
npm install jsonwebtoken bcryptjs
```

---

## 🔑 Environment Variables

Ensure `.env` has:

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d
NODE_ENV=development
PORT=8000
```

---

## 🧪 Testing the Backend (After Implementation)

### Test 1: Create New User
```bash
curl -X POST http://localhost:8000/api/accounts/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Expected response:
# {"token": "eyJhbGciOiJIUzI1NiIs...", "user": {...}}
```

### Test 2: Login User
```bash
curl -X POST http://localhost:8000/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected response:
# {"token": "eyJhbGciOiJIUzI1NiIs...", "user": {...}}
```

### Test 3: Fetch Dashboard (Authenticated)
```bash
# Save token from login response
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {"user": {...}, "stats": {...}, "orders": [...]}
```

### Test 4: Invalid Token
```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "Authorization: Bearer invalid_token"

# Expected response (401):
# {"error": "Invalid or expired token"}
```

---

## 📝 Implementation Tasks

### Step 1: Setup (15 min)
- [ ] Ensure JWT secret in `.env`
- [ ] Verify bcryptjs and jsonwebtoken installed
- [ ] Import dependencies in server.js: `const jwt = require('jsonwebtoken')`

### Step 2: Add Middleware (10 min)
- [ ] Add `authenticateToken()` function to server.js
- [ ] Test middleware with existing endpoints

### Step 3: Implement Endpoints (60 min)
- [ ] Add POST `/api/accounts/register`
- [ ] Add POST `/api/accounts/login`
- [ ] Add GET `/api/dashboard` (requires reading customer + orders)
- [ ] Add POST `/api/email-preferences`

### Step 4: Test (30 min)
- [ ] Use curl commands above
- [ ] Test dashboard.html with real data
- [ ] Verify all tabs load correctly

### Step 5: Deploy (15 min)
- [ ] Commit changes
- [ ] Test on staging/production
- [ ] Verify with live Stripe test transaction

---

## 🚀 Integration Points

### From Phase 3
- ✅ Orders already created by webhook (saved to `/data/orders/`)
- ✅ License keys already generated and stored with orders
- ✅ Email already confirmed in Phase 3 structure
- ✅ JWT auth.js file already exists

### New for Phase 4
- 🆕 Customer records (need to create when order placed)
- 🆕 Authentication endpoints
- 🆕 Dashboard API

### Suggestion: Update Phase 3 Webhook
In the existing `/api/webhook` endpoint (POST), **also create customer record**:

```javascript
// In webhook handler, after creating order:
const customerRecord = {
  id: customerId,
  email: checkoutSession.customer_email || event.data.object.customer_email,
  name: session_data.name || 'Customer',
  createdAt: new Date().toISOString(),
  emailPreferences: {
    transactional: true,
    updates: false,
    newsletter: false
  },
  verified: false  // Set to true after email verification Phase 4b
};

fs.writeFileSync(
  path.join(__dirname, 'data/customers', `${customerId}.json`),
  JSON.stringify(customerRecord, null, 2)
);
```

---

## ⚠️ Security Notes

1. **Never log passwords** - Always use hashed comparisons
2. **JWT expiry** - Set to 7 days, require re-authentication after
3. **HTTPS only** - Don't use HTTP in production for authentication
4. **CORS** - Only allow requests from your domain
5. **Rate limiting** - Add limits to login endpoint (prevents brute force)

---

## 📊 Estimated Timeline

| Task | Time | Notes |
|------|------|-------|
| Setup + deps | 15 min | Install packages, add JWT secret |
| Middleware | 10 min | Add authenticateToken function |
| Register endpoint | 15 min | Create customer, hash password, return token |
| Login endpoint | 15 min | Query customer, verify password, return token |
| Dashboard endpoint | 20 min | Query files, aggregate data, return JSON |
| Preferences endpoint | 10 min | Simple JSON update to customer |
| Testing | 30 min | cURL tests, dashboard integration test |
| **TOTAL** | **2-3 hrs** | Can be done in one session |

---

## 🎯 Success Checklist

- [ ] POST /api/accounts/register working
- [ ] POST /api/accounts/login working
- [ ] GET /api/dashboard returning real order data
- [ ] dashboard.html frontend loading real data
- [ ] All tabs functional with real data
- [ ] License keys display correctly
- [ ] Settings tab can save preferences
- [ ] Logout clears token properly
- [ ] Token expiration handled gracefully

---

**Phase 4 Backend Ready in ~3 hours!**
