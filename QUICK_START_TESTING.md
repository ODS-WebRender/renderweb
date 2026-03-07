# Phase 4a + 4e: Quick Start Testing Guide

## What's Ready to Test

✅ **Customer Account System (Phase 4a)**
- User registration and login with JWT tokens
- User profile access
- Order history with statistics
- License key retrieval and display

✅ **Admin Dashboard (Phase 4e)**
- Admin authentication with password
- Orders management interface
- Customer insights with stats
- Analytics dashboard with metrics
- Refund processing with email notifications

---

## 5-Minute Test Flow

### 1️⃣ Start the Server (if not already running)

```bash
cd /mnt/Master_Storage/Project\ Folders/Old_Dog_Web
npm start
# or
node server.js
```

Check that it's running on `http://localhost:3000`

### 2️⃣ Test Customer Dashboard

**In Browser:**
```
http://localhost:3000/dashboard.html
```

**What to test:**
1. Click login link (if needed)
2. Create new account:
   - Email: `test@example.com`
   - Password: `test123456`
   - Name: `Test User`
3. Login with those credentials
4. Dashboard should show:
   - Your email
   - Total purchases (0 if new)
   - Active licenses (0 if new)
   - Empty orders section

### 3️⃣ Test Admin Dashboard

**In Browser:**
```
http://localhost:3000/admin.html
```

**Administrator Password:** Check your `.env` file for `ADMIN_PASSWORD`

**What to test:**
1. Enter admin password (from `.env`)
2. Login - should see admin dashboard
3. Click through tabs:
   - **Orders**: Shows all orders (empty if no purchases)
   - **Customers**: Shows customer list with stats
   - **Analytics**: Shows metrics and charts
   - **Refunds**: Form to process refunds

### 4️⃣ Test with Real Orders (Optional)

If you have existing orders in the database:

1. Go to customer dashboard with an existing customer email
2. You should see their orders and licenses
3. Go to admin dashboard
4. Find the order in the Orders tab
5. Click "Refresh" to see current status

---

## API Testing with curl

### Create Test Customer

```bash
curl -X POST http://localhost:3000/api/accounts/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@test.com",
    "password": "testpass123",
    "name": "Curl Test User"
  }'
```

Expected: Account created successfully

### Save Response Token

After login, save the JWT token (copy the "token" value):

```bash
curl -X POST http://localhost:3000/api/accounts/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@test.com",
    "password": "testpass123"
  }'
```

### Use Token to Get Profile

```bash
curl -X GET http://localhost:3000/api/accounts/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Customer Orders

```bash
curl -X GET http://localhost:3000/api/customer/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Customer Licenses

```bash
curl -X GET http://localhost:3000/api/customer/licenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Admin API Testing

### Get Admin Token

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "YOUR_ADMIN_PASSWORD"}'
```

Save the token from response.

### Get All Orders (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Customers (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/customers \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Analytics

```bash
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Process Refund

```bash
curl -X POST http://localhost:3000/api/admin/refunds \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "EXISTING_ORDER_ID",
    "reason": "Testing refund flow"
  }'
```

---

## What to Check

### Dashboard (Customer Side)
- [ ] Can see user email in profile section
- [ ] Order history displays (if purchases exist)
- [ ] License keys are copyable
- [ ] Status badges show correct colors
- [ ] Total spent calculations are accurate

### Admin Dashboard (Admin Side)
- [ ] Can login with admin password
- [ ] Orders tab shows all orders
- [ ] Customers tab shows customer names and stats
- [ ] Analytics shows correct metrics
- [ ] Can process refunds without errors
- [ ] Refund success message appears

### HTML/UX
- [ ] All tabs are clickable
- [ ] Responsive design works on mobile
- [ ] No console errors in browser DevTools
- [ ] Tables have proper formatting
- [ ] Forms have proper validation

---

## Known Limitations (Planned for Future)

- 🟡 Stripe refund API not integrated yet (marked as TODO)
- 🟡 No pagination for very large order lists
- 🟡 Admin token uses Base64 encoding (not JWT)
- 🟡 No request rate limiting
- 🟡 Analytics calculated on-demand (no caching)

---

## Next Steps After Testing

### If No Issues Found
1. Deploy to Render: `git push`
2. Monitor deployment logs
3. Test on production URL: `https://old-dog-web.onrender.com`

### If Issues Found
1. Report the specific error
2. Check browser console (F12 → Console tab)
3. Check server logs
4. Fix issue and recommit

### When Ready for Phase 4b/4c/4d
- Implement recurring subscriptions (Phase 4b)
- Add affiliate system (Phase 4c)
- Add Lemon Squeezy integration (Phase 4d)

---

## File Locations for Reference

- **Testing Guide**: [PHASE_4a_4e_TESTING.md](./PHASE_4a_4e_TESTING.md)
- **API Docs**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Backend Code**: [server.js](./server.js) (lines 700-950 for new endpoints)
- **Dashboard UI**: [dashboard.html](./dashboard.html)
- **Admin UI**: [admin.html](./admin.html)
- **Database**: [db.js](./db.js)
- **Auth**: [auth.js](./auth.js)

---

## Checklist Summary

### Environment Variables
```bash
# Make sure these are in .env file:
ADMIN_PASSWORD=your_chosen_password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
SENDGRID_API_KEY=SG.xxx...
```

### Test Results
- [ ] Customer registration works
- [ ] Customer login works  
- [ ] Customer can view profile
- [ ] Customer can view orders
- [ ] Customer can view licenses
- [ ] Admin login works
- [ ] Admin can view orders
- [ ] Admin can view customers
- [ ] Admin can view analytics
- [ ] Admin can process refunds
- [ ] No console errors
- [ ] No network errors

### Ready for Production?
- [ ] All tests passed
- [ ] No TODOs blocking functionality
- [ ] Email notifications working
- [ ] Performance acceptable
- [ ] Ready to deploy

---

## Questions or Issues?

Refer to the comprehensive testing guide:
📖 **[Full Testing Guide](./PHASE_4a_4e_TESTING.md)**

Or check the API reference:
📖 **[API Reference](./API_REFERENCE.md)**

---

**Status**: ✅ Phase 4a+4e ready for testing  
**Commits**: 3 commits pushed to GitHub  
**Next**: Manual validation and deployment  
