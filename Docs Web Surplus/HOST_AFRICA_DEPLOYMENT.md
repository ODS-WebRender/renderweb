# Host Africa Deployment Guide

**Status:** Production Ready  
**Last Updated:** March 7, 2026  
**Hosting Provider:** Host Africa  
**Environment:** Node.js v20.x  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Setup](#environment-setup)
4. [Deployment Steps](#deployment-steps)
5. [Database Initialization](#database-initialization)
6. [Troubleshooting](#troubleshooting)
7. [Monitoring & Logs](#monitoring--logs)
8. [Rollback Procedure](#rollback-procedure)

---

## 🎯 Overview

### System Requirements
- **Node.js:** 20.x LTS (minimum 18.x)
- **OS:** Linux (Ubuntu 20.04+ recommended)
- **Disk Space:** 2GB minimum
- **Memory:** 512MB minimum (1GB recommended)
- **Network:** Outbound HTTPS access required for:
  - SendGrid API (email)
  - PayFast API (payments)
  - GitHub (for git deployments)

### Application Stack
- **Framework:** Node.js HTTP server (built-in, no Express)
- **Database:** JSON file-based (local storage)
- **Static Files:** HTML/CSS/JS served from filesystem
- **Payment:** PayFast (with Stripe fallback)
- **Email:** SendGrid

### Application Ports
- **Production:** Port 3000 (mapped through Host Africa routing)
- **Local Testing:** Port 3000

---

## ✅ Pre-Deployment Checklist

**Before deploying to Host Africa, verify:**

- [ ] Node.js 20.x installed: `node --version`
- [ ] npm available: `npm --version`
- [ ] Git installed: `git --version`
- [ ] Repository cloned locally
- [ ] All configuration files present:
  - `package.json`
  - `server.js`
  - `db.js`
  - `auth.js`
  - `email.js`
  - `invoice.js`
  - `paymentProcessor.js`
  - `constants.js`
  - `components.js`
  - `.env.example` (template)
- [ ] All HTML files present:
  - `index.html`
  - `dashboard.html`
  - `admin.html`
  - `affiliate-dashboard.html`
  - `media.html`
- [ ] `/images` folder contains brand assets
- [ ] `/data` folder exists (will be created on first run)
- [ ] SSL certificates obtained (if using HTTPS)
- [ ] Domain DNS configured pointing to Host Africa server
- [ ] Firewall rules configured for ports 80/443

---

## 🔧 Environment Setup

### Step 1: Access Host Africa Server

```bash
# SSH into Host Africa server
ssh username@host-africa-server-ip

# Recommended: Use key-based authentication
ssh -i ~/.ssh/host-africa-key username@host-africa-server-ip
```

### Step 2: Install Node.js & npm

**If not already installed:**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js with nvm (recommended for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
exec bash

# Install Node.js 20.x LTS
nvm install 20
nvm use 20

# Verify installation
node --version  # Should output v20.x.x
npm --version   # Should output 9.x.x or later
```

**Alternative (apt, direct install):**

```bash
# If you prefer direct installation (less flexible)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 3: Clone Repository

```bash
# Navigate to desired location (e.g., /var/www or /home/username)
cd /var/www

# Clone the repository
git clone https://github.com/ODS-WebRender/renderweb.git old-dog-web

# Navigate to project
cd old-dog-web

# Verify directory structure
ls -la
# Should show: index.html, server.js, package.json, etc.
```

### Step 4: Install Dependencies

```bash
# Navigate to project root
cd /var/www/old-dog-web

# Install npm packages (lean stack, ~150MB)
npm install

# Verify packages installed
npm list --depth=0
# Should show:
# ├── @sendgrid/mail@7.7.0
# ├── bcryptjs@2.4.3
# ├── dotenv@16.3.1
# ├── jsonwebtoken@9.0.2
# ├── pdfkit@0.13.0
# ├── stripe@13.11.0
# └── uuid@9.0.1
```

### Step 5: Create `.env` File

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your specific values
nano .env
```

**Required `.env` variables:**

```env
# Server Configuration
PORT=3000
DOMAIN=https://yourdomain.com

# Payment Processor (PayFast for South Africa)
PAYMENT_PROCESSOR=payfast
PAYFAST_MERCHANT_ID=34040991
PAYFAST_MERCHANT_KEY=uzi59baavudk5
PAYFAST_RETURN_URL=https://yourdomain.com/checkout-success
PAYFAST_CANCEL_URL=https://yourdomain.com/checkout-cancel

# Stripe (Fallback/International)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Admin Authorization
ADMIN_SECRET_TOKEN=your-secret-admin-token-here

# Application Settings
NODE_ENV=production
```

**Where to get these values:**

| Variable | Source | Notes |
|----------|--------|-------|
| `PAYFAST_*` | PayFast Merchant Account | [PayFast Admin](https://merchant.payfast.co.za) |
| `STRIPE_*` | Stripe Dashboard | [Stripe](https://stripe.com) - Optional backup |
| `SENDGRID_API_KEY` | SendGrid Settings | [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys) |
| `ADMIN_SECRET_TOKEN` | Generate yourself | `openssl rand -hex 32` |

---

## 🚀 Deployment Steps

### Option A: Manual Deployment (Recommended for Testing)

```bash
# 1. SSH into Host Africa server
ssh username@host-africa-server

# 2. Navigate to project
cd /var/www/old-dog-web

# 3. Pull latest code from GitHub
git pull origin main

# 4. Install any new dependencies
npm install

# 5. Create `.env` file (or update if already exists)
# nano .env

# 6. Create data directory for JSON database
mkdir -p data

# 7. Start application manually to test
npm start

# Output should show:
# Server running on http://localhost:3000
# Payment processor: payfast
# Database initialized
```

**Test the server:**

```bash
# In a new terminal, or locally:
curl http://localhost:3000

# Should return HTML homepage
# Test API:
curl http://localhost:3000/api/health
# Should return: {"status":"ok"}
```

### Option B: Systemd Service (Recommended for Production)

**Create systemd service file:**

```bash
# Create service file
sudo nano /etc/systemd/system/old-dog-web.service
```

**Paste this content:**

```ini
[Unit]
Description=Old Dog Systems Web Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/old-dog-web
ExecStart=/usr/bin/node /var/www/old-dog-web/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/old-dog-web/.env

[Install]
WantedBy=multi-user.target
```

**Enable and start service:**

```bash
# Reload systemd daemon
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable old-dog-web

# Start the service
sudo systemctl start old-dog-web

# Check status
sudo systemctl status old-dog-web

# View logs
sudo journalctl -u old-dog-web -f
```

### Option C: Process Manager (PM2)

**Install PM2 globally:**

```bash
sudo npm install -g pm2
```

**Create PM2 ecosystem file:**

```bash
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'old-dog-web',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    watch: false,
    max_memory_restart: '500M',
    autorestart: true,
    max_restarts: 5,
    min_uptime: '10s'
  }]
};
EOF
```

**Start with PM2:**

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Setup startup hook (starts on system reboot)
pm2 startup systemd -u www-data --hp /var/www
pm2 save

# View all PM2 processes
pm2 list

# View logs
pm2 logs old-dog-web
```

### Option D: Docker Deployment (Optional)

**Create Dockerfile:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY . .

# Create data directory
RUN mkdir -p data

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
```

**Build and run:**

```bash
# Build Docker image
docker build -t old-dog-web:latest .

# Run container
docker run -d \
  --name old-dog-web \
  -p 3000:3000 \
  --env-file .env \
  -v /var/www/old-dog-web/data:/app/data \
  old-dog-web:latest
```

---

## 🗄️ Database Initialization

### Automatic Initialization

The application automatically creates the database on first startup:

```bash
npm start
```

**Auto-created files in `/data`:**

```
data/
├── orders.json          # Customer orders
├── customers.json       # Customer profiles  
├── licenses.json        # License keys
├── alphaInquiries.json  # Alpha program inquiries
├── subscriptions.json   # Recurring subscriptions
├── affiliates.json      # Affiliate registrations
└── referrals.json       # Referral tracking
```

### Manual Database Reset (If Needed)

**⚠️ WARNING: This will delete all data!**

```bash
# Stop the application
sudo systemctl stop old-dog-web

# Or with PM2:
pm2 stop old-dog-web

# Delete data directory
rm -rf /var/www/old-dog-web/data

# Restart application (will recreate empty DB)
sudo systemctl start old-dog-web
```

### Database Backup

**Create backup:**

```bash
# Backup all JSON data
tar -czf old-dog-web-backup-$(date +%Y%m%d_%H%M%S).tar.gz /var/www/old-dog-web/data/

# Move to safe location
mv old-dog-web-backup-*.tar.gz /backups/
```

**Restore from backup:**

```bash
# Stop application
sudo systemctl stop old-dog-web

# Restore data
tar -xzf /backups/old-dog-web-backup-20260307_143000.tar.gz -C /

# Restart application
sudo systemctl start old-dog-web
```

---

## 🌐 Web Server Configuration

### Nginx Reverse Proxy

**Create Nginx config:**

```bash
sudo nano /etc/nginx/sites-available/old-dog-web
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    gzip_comp_level 6;

    # Static files (cache aggressively)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # API endpoints (no cache)
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_read_timeout 30s;
        proxy_connect_timeout 10s;
    }

    # Everything else
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security: Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }

    location ~ /data/ {
        deny all;
    }
}
```

**Enable Nginx site:**

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/old-dog-web /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (already configured)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verify renewal works
sudo certbot renew --dry-run
```

---

## 🐛 Troubleshooting

### Application Won't Start

**Check logs:**

```bash
# Systemd logs
sudo journalctl -u old-dog-web -n 50

# PM2 logs
pm2 logs old-dog-web

# Direct startup
npm start  # Watch for error messages
```

**Common issues:**

| Error | Solution |
|-------|----------|
| `Port 3000 already in use` | Kill existing process: `lsof -ti:3000 \| xargs kill -9` |
| `Cannot find module 'dotenv'` | Run `npm install` |
| `ENOENT .env file` | Copy `.env.example` to `.env`: `cp .env.example .env` |
| `Connection refused` | Check if Node.js process is running: `ps aux \| grep node` |

### Database Corruption

```bash
# Check database file for syntax errors
node -e "const db = require('./db.js'); console.log(db.getAllOrders())"

# Restore from backup
tar -xzf /backups/old-dog-web-backup-latest.tar.gz -C /
systemctl restart old-dog-web
```

### PayFast Integration Issues

```bash
# Check PayFast configuration
grep "PAYFAST" .env

# Test PayFast connection
curl -X POST https://www.payfast.co.za/onsite/process \
  -d "merchant_id=34040991"
```

### Email Not Sending

```bash
# Verify SendGrid API key
grep SENDGRID .env

# Test SendGrid API
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer $SENDGRID_API_KEY" \
  -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@yourdomain.com"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'
```

---

## 📊 Monitoring & Logs

### Application Logs

**View real-time logs:**

```bash
# Systemd
sudo journalctl -u old-dog-web -f -n 100

# PM2
pm2 logs old-dog-web --lines 100

# Direct file
tail -f /var/www/old-dog-web/logs/app.log
```

### System Health Check

```bash
# Check Node.js process
top -bn1 | grep node

# Check disk space
df -h /var/www/old-dog-web

# Check memory usage
free -h

# Check network connections to server
netstat -tlnp | grep 3000
```

### Health Endpoint

```bash
# Check application health
curl http://localhost:3000/api/health

# Response should be:
# {"status":"ok","timestamp":"2026-03-07T..."}
```

### Monitoring Script

**Auto-restart if down:**

```bash
#!/bin/bash
# save as /usr/local/bin/check-old-dog.sh

if ! pgrep -f "node.*server.js" > /dev/null; then
    sudo systemctl start old-dog-web
    echo "Application restarted at $(date)" >> /var/log/old-dog-monitor.log
fi
```

**Add to crontab:**

```bash
# Check every 5 minutes
*/5 * * * * /usr/local/bin/check-old-dog.sh
```

---

## 🔄 Rollback Procedure

### Rollback to Previous Version

```bash
# Stop application
sudo systemctl stop old-dog-web

# Show commit history
git log --oneline -10

# Reset to previous commit (example: 1 commit back)
git reset --hard HEAD~1

# Restart application
sudo systemctl start old-dog-web

# Verify
curl http://localhost:3000/api/health
```

### Restore from Database Backup

```bash
# Stop application
sudo systemctl stop old-dog-web

# List available backups
ls -lh /backups/old-dog-web-backup-*.tar.gz

# Restore specific backup
tar -xzf /backups/old-dog-web-backup-20260307_130000.tar.gz -C /

# Start application
sudo systemctl start old-dog-web
```

---

## 📝 Deployment Checklist

**After deploying:**

- [ ] Application starts without errors: `systemctl status old-dog-web`
- [ ] API responds: `curl http://localhost:3000/api/health`
- [ ] Website loads: Visit https://yourdomain.com
- [ ] Database initialized: Check `/data/` directory exists
- [ ] Emails configured: Test order triggers SendGrid email
- [ ] PayFast integrated: Verify merchant ID in logs
- [ ] SSL certificate valid: Check HTTPS works
- [ ] Admin dashboard accessible: Visit /admin.html
- [ ] Customer dashboard accessible: Visit /dashboard.html
- [ ] Affiliate portal accessible: Visit /affiliate-dashboard.html
- [ ] Backups running: Verify cron job active
- [ ] Logs being collected: Check journalctl output

---

## 🆘 Support & Documentation

**For additional help:**

- Application docs: See `PHASE_4b_4c_IMPLEMENTATION.md`
- API reference: See `PHASE4_BACKEND_CHECKLIST.md`
- Payment setup: See `PAYFAST_SETUP.md`
- Deployment issues: Check system logs with `journalctl -u old-dog-web -n 100`

**Quick Commands Reference:**

```bash
# Start/stop/restart
sudo systemctl start old-dog-web
sudo systemctl stop old-dog-web
sudo systemctl restart old-dog-web

# View logs
sudo journalctl -u old-dog-web -f

# Check status
sudo systemctl status old-dog-web

# Deploy new code
cd /var/www/old-dog-web
git pull origin main
npm install
sudo systemctl restart old-dog-web
```

---

**Version:** 1.0  
**Status:** Production Ready  
**Last Updated:** March 7, 2026
