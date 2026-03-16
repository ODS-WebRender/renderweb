# FTP Deployment Guide - old-dog-systems.co.za

## Overview
This guide helps you transfer your website from render.com (https://old-dog-systems1.onrender.com) to your new domain (old-dog-systems.co.za) via FTP.

## FTP Server Details
- **Host:** ftp.old-dog-systems.co.za
- **Port:** 21 (Standard FTP)
- **Username:** olddofyxcg
- **Password:** zk1R95Z1t3G8jS4lWKdh
- **Target Directory:** public_html

## Method 1: Automated Script (Recommended)

### Prerequisites
```bash
sudo apt-get install lftp
```

### Run the Deployment Script
```bash
cd /mnt/Master_Storage/Project\ Folders/Old_Dog_Web
chmod +x deploy-to-ftp.sh
./deploy-to-ftp.sh
```

The script will automatically:
- Connect to the FTP server
- Upload all necessary files to public_html
- Exclude unnecessary files (node_modules, .git, documentation, etc.)
- Preserve directory structure
- Show progress during upload

### Expected Output
```
==========================================
FTP Deployment to old-dog-systems.co.za
==========================================
Creating FTP connection and uploading files...
[... progress output ...]
==========================================
✓ Deployment completed successfully!
Your site should now be accessible at:
  http://old-dog-systems.co.za
  https://old-dog-systems.co.za
==========================================
```

## Method 2: Manual FTP Using FileZilla (GUI)

### Steps
1. Download FileZilla: https://filezilla-project.org/
2. Open FileZilla and go to **File → Site Manager**
3. Create a new site with:
   - **Protocol:** FTP
   - **Host:** ftp.old-dog-systems.co.za
   - **Port:** 21
   - **User:** olddofyxcg
   - **Password:** zk1R95Z1t3G8jS4lWKdh
4. Connect to the server
5. Navigate to the **public_html** folder on the server
6. Drag and drop files from your local folder to public_html
7. Exclude these directories/files:
   - node_modules/
   - .git/
   - .github-token
   - *.md files
   - WEB Instruct Etc/
   - web-dev1/
   - rough-diamond-studio/

## Method 3: Command-line FTP (Interactive)

```bash
lftp -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
```

Once connected:
```ftp
cd public_html
lcd /mnt/Master_Storage/Project\ Folders/Old_Dog_Web
mirror -R --verbose
quit
```

## Files to Upload (Most Important)

### HTML Files (REQUIRED)
- index.html
- admin.html
- dashboard.html
- shop.html
- about.html
- checkout-success.html
- affiliate-dashboard.html
- admin-dashboard.html
- All other .html files

### JavaScript Files (REQUIRED)
- auth.js
- components.js
- constants.js
- db.js
- email.js
- invoice.js
- lemon-squeezy.js
- paymentProcessor.js
- shop-filter.js
- server.js

### CSS Files (REQUIRED)
- styles.css

### JSON Files (REQUIRED)
- products.json
- olddog-erp-product.json

### Directories (OPTIONAL - Include if needed)
- images/ (product images, etc.)
- data/ (if used for static data)

### DO NOT UPLOAD
- node_modules/ (too large, server has npm)
- .git/ (not needed)
- .github-token (security risk)
- *.md files (documentation only)
- .env files (recreate on server)
- WEB Instruct Etc/ (development only)
- web-dev1/ (development only)
- rough-diamond-studio/ (development only)

## Post-Deployment Steps

### 1. Environment Configuration
SSH into your server and create .env file:
```bash
ssh olddofyxcg@old-dog-systems.co.za
# Navigate to public_html
cd public_html
cat > .env << 'EOF'
# Add your environment variables here
NODE_ENV=production
DATABASE_URL=your_database_url
API_KEY=your_api_key
# ... other variables
EOF
```

Or use FileZilla to upload the .env file (create it separately for security)

### 2. Install Dependencies (if needed)
If the server has Node.js:
```bash
cd public_html
npm install
```

### 3. Configure Domain DNS
Update your domain registrar's DNS records to point to your hosting provider:
- Ask your hosting provider (Host Africa) for the nameserver details
- OR point A record to the server IP

### 4. Verify SSL Certificate
The hosting provider may provide an SSL certificate. Ensure:
- HTTPS is enabled
- SSL certificate is valid
- Redirect HTTP to HTTPS

### 5. Test the Website
Visit the following to verify:
- http://old-dog-systems.co.za (should work)
- https://old-dog-systems.co.za (should work with SSL)
- Check all pages load correctly
- Test forms and functionality

## Troubleshooting

### Issue: Connection Refused
- Check FTP credentials are correct
- Ensure port 21 is not blocked by firewall
- Verify the FTP server is running (contact hosting provider)

### Issue: Permission Denied
- Check file permissions (FTP account permissions)
- Ensure you have write access to public_html

### Issue: Files Not Uploading
- Check available storage space on server
- Verify file sizes aren't too large
- Try uploading smaller batches

### Issue: Website Not Loading
- Check DNS is pointing to correct server
- Verify files are in public_html directory
- Check server error logs
- Ensure index.html is in public_html root

### Issue: SSL Certificate Warning
- Wait 24-48 hours for DNS propagation
- Clear browser cache and try again
- Contact hosting provider if problem persists

## Email Configuration

Email accounts have been created. Configure in your application:

### info@old-dog-systems.co.za
- **Username:** info@old-dog-systems.co.za
- **Password:** log26M1KB9v2
- **IMAP Server:** mail.old-dog-systems.co.za:993 (SSL/TLS)
- **SMTP Server:** smtp.old-dog-systems.co.za:465 (SSL/TLS)

### sales@old-dog-systems.co.za
- **Username:** sales@old-dog-systems.co.za
- **Password:** AF8HgZj17RAr
- **IMAP Server:** mail.old-dog-systems.co.za:993 (SSL/TLS)
- **SMTP Server:** smtp.old-dog-systems.co.za:465 (SSL/TLS)

### Webmail Access
- URL: http://mail.old-dog-systems.co.za

## Rollback Plan (Keep render.com as Backup)

If you want to keep your render.com site running as a backup:
1. Don't remove the Render deployment
2. Keep your GitHub repository active
3. Update DNS to point to FTP server
4. If issues arise, revert DNS to Render

To switch back to Render:
1. Update domain DNS to point to Render
2. Your site will be live again

## Important Notes

1. **Backup First:** Always backup your current website before migrating
2. **DNS Propagation:** DNS changes can take 24-48 hours to fully propagate
3. **Test First:** Test thoroughly on the FTP server before updating DNS
4. **Keep Render Active:** Consider keeping Render active for a few days as a backup
5. **Database:** If using a database, ensure it's properly configured before switching DNS
6. **SSL/TLS:** Hosting provider should provide free SSL certificates

## Support

If you encounter issues:
1. Contact your hosting provider (Host Africa): support@hostnafrica.co.za or through their control panel
2. Check FTP logs for error messages
3. Verify all credentials are correct
4. Ensure adequate storage space

## Summary of Migration

```
Current: https://old-dog-systems1.onrender.com (Render + GitHub)
                     ↓
Migrate to: https://old-dog-systems.co.za (FTP + Host Africa)

Files: Upload via FTP to public_html/
Email: info@ and sales@ accounts ready
DNS: Configure to point to Host Africa servers
Backup: Keep Render running initially
```

Version: 1.0  
Last Updated: March 14, 2026
