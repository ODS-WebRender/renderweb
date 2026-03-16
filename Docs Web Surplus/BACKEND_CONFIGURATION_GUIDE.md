# Backend Configuration Guide

## Environment Variables (.env)

The backend services require environment variables to function. You have two options:

### Option 1: Create .env File on FTP Server

SSH into your server and create the .env file:

```bash
ssh olddofyxcg@ftp.old-dog-systems.co.za
cd public_html
nano .env
```

Paste the configuration below, then press Ctrl+X, Y, Enter to save.

### Option 2: Upload .env via FTP

Create a local .env file (in your project folder) with the configurations below, then upload via FTP.

---

## Example .env Configuration

```
# Application Environment
NODE_ENV=production
PORT=80
DEBUG=false

# Security
JWT_SECRET=your_secure_random_string_here_minimum_32_characters
API_KEY=your_api_key_here
ENCRYPTION_KEY=your_encryption_key_here

# Database Configuration (if using database)
DATABASE_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=olddog_production
DB_POOL_SIZE=10

# Email Configuration
EMAIL_HOST=mail.old-dog-systems.co.za
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@old-dog-systems.co.za
EMAIL_PASSWORD=log26M1KB9v2
EMAIL_FROM=info@old-dog-systems.co.za
SUPPORT_EMAIL=sales@old-dog-systems.co.za

# Payment Integration - Lemon Squeezy
LEMON_SQUEEZY_API_KEY=your_lemon_squeezy_api_key
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
LEMON_SQUEEZY_STORE_ID=your_store_id

# Payment Integration - PayFast (if using)
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
PAYFAST_PASSPHRASE=your_passphrase
PAYFAST_SANDBOX_MODE=false

# Frontend URLs
FRONTEND_URL=https://old-dog-systems.co.za
CALLBACK_URL=https://old-dog-systems.co.za/checkout-success.html

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=
SENTRY_DSN=

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# CORS Settings
ALLOWED_ORIGINS=https://old-dog-systems.co.za,https://www.old-dog-systems.co.za

# Session Configuration
SESSION_SECRET=your_session_secret_here
COOKIE_SECURE=true
COOKIE_HTTPONLY=true
COOKIE_SAMESITE=Strict
```

---

## Configuration by Service

### 1. Email Service (Nodemailer)
```
EMAIL_HOST=mail.old-dog-systems.co.za
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=info@old-dog-systems.co.za
EMAIL_PASSWORD=log26M1KB9v2
```

**Test Email Sending:**
```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'mail.old-dog-systems.co.za',
  port: 465,
  secure: true,
  auth: {
    user: 'info@old-dog-systems.co.za',
    pass: 'log26M1KB9v2'
  }
});

transporter.sendMail({
  from: 'info@old-dog-systems.co.za',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email'
}, (err, info) => {
  if (err) console.log('Error:', err);
  else console.log('Email sent:', info);
});
"
```

### 2. Database (if using MySQL)
Get these details from your hosting provider:
- **Host:** Usually 'localhost' if database is on same server
- **User:** Your database username
- **Password:** Your database password
- **Database Name:** olddog_production (or custom name)

**Test Connection:**
```bash
mysql -h localhost -u dbuser -pdbpassword -e "use olddog_production; SHOW TABLES;"
```

### 3. Payment Processing - Lemon Squeezy
[Already configured in LEMON_SQUEEZY_SETUP.md]

1. Log into Lemon Squeezy dashboard
2. Get API key from Account → API Tokens
3. Get Webhook Secret from Settings → Webhooks
4. Add to .env file

**Webhook URL for Lemon Squeezy:**
- Set webhook endpoint to: `https://old-dog-systems.co.za/api/webhooks/lemon-squeezy`
- Events to subscribe: payment created, payment updated, payment failed

### 4. Payment Processing - PayFast
[Already configured in PAYFAST_SETUP.md]

Get credentials from your PayFast account settings.

---

## Uploading .env to Production Server

### Via SSH (Recommended - Most Secure)
```bash
ssh olddofyxcg@ftp.old-dog-systems.co.za
cd public_html
cat > .env << 'EOF'
[paste your .env content here]
EOF

# Verify
cat .env | head -5
chmod 600 .env
exit
```

### Via FTP
1. Create local `.env.prod` file with production values
2. Upload to public_html via FTP
3. Rename on server to `.env`
4. Set permissions to 600

### Via Node.js Script
If you have Node.js on the server:
```bash
ssh olddofyxcg@ftp.old-dog-systems.co.za
cd public_html
npm install dotenv
node -e "require('dotenv').config(); console.log('ENV loaded:', process.env.NODE_ENV)"
```

---

## Environment Variable Security

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never commit .env to Git**
   - .env is already in .gitignore
   - Double-check before pushing

2. **File Permissions**
   ```bash
   chmod 600 .env  # Only owner can read/write
   chmod 400 .env  # Only owner can read (read-only)
   ```

3. **Access Control**
   - Only backend server user should access .env
   - Rotate tokens regularly
   - Use separate keys for development vs production

4. **Sensitive Values**
   - API keys, passwords, secrets should be 32+ characters
   - Use random generators: `openssl rand -base64 32`
   - Store backups securely (encrypted)

---

## How to Generate Secure Keys

```bash
# Generate 32-character random string
openssl rand -base64 32

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API key
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## Verifying Configuration

After setting up .env, test with:

```bash
# Check if .env is loaded
node -e "
require('dotenv').config();
console.log('✓ NODE_ENV:', process.env.NODE_ENV);
console.log('✓ EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('✓ DB_HOST:', process.env.DB_HOST || 'Not configured');
console.log('✓ Keys are set:', !!process.env.JWT_SECRET);
"

# Test email
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test"}'

# Test database
curl -X GET http://localhost:3000/api/test/db
```

---

## Deployment Checklist

- [ ] Created .env file with all required values
- [ ] Set file permissions to 600
- [ ] Verified database connection
- [ ] Tested email sending
- [ ] Tested payment integration
- [ ] Set JWT_SECRET and other keys
- [ ] CORS_ALLOWED_ORIGINS includes your domain
- [ ] NODE_ENV=production
- [ ] DEBUG=false
- [ ] LOG_LEVEL=info (not debug)
- [ ] SSL/TLS enabled (HTTPS)
- [ ] Backups of .env created (stored securely)

---

## Troubleshooting

### Issue: "Cannot find module 'dotenv'"
```bash
cd public_html
npm install dotenv
npm install  # Install all dependencies
```

### Issue: Email not sending
```bash
# Check SMTP credentials
telnet mail.old-dog-systems.co.za 465

# Or use openssl
openssl s_client -connect mail.old-dog-systems.co.za:465
```

### Issue: Database connection fails
```bash
# Check MySQL credentials
mysql -h localhost -u user -p
# Enter password

# Or test with Node
node -e "
const mysql = require('mysql2/promise');
mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).then(conn => {
  console.log('✓ Database connected');
  conn.end();
}).catch(err => console.log('✗ Database error:', err.message));
"
```

---

## Production Deployment Tips

1. **Use strong, unique values** for all secrets
2. **Rotate secrets monthly** for high-security apps
3. **Monitor logs** for authentication failures
4. **Set up alerts** for payment processing errors
5. **Regular backups** of configuration
6. **Staging environment** with test credentials first
7. **Keep dependencies updated:** `npm audit && npm update`

---

**Last Updated:** March 14, 2026  
**Document Version:** 1.0
