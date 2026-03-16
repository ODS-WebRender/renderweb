# FTP Migration Checklist

## Pre-Migration
- [ ] Backup current website files (done automatically)
- [ ] Test current site on render.com still works
- [ ] Save FTP credentials securely
- [ ] Verify domain name is active (old-dog-systems.co.za)
- [ ] Note current DNS settings for rollback

## Installation & Preparation
- [ ] Install lftp: `sudo apt-get install -y lftp`
- [ ] Verify deploy script exists: `ls -la deploy-to-ftp.sh`
- [ ] Make script executable: `chmod +x deploy-to-ftp.sh`
- [ ] Review FTP_DEPLOYMENT_GUIDE.md

## Deployment
- [ ] Run deployment script: `./deploy-to-ftp.sh`
- [ ] Wait for "✓ Deployment completed successfully!" message
- [ ] Review upload log for any errors
- [ ] No errors in deployment output

## Verification - FTP Files
- [ ] Verify files uploaded to public_html (use FileZilla or lftp)
- [ ] Confirm index.html is in public_html root
- [ ] Check all HTML files are present
- [ ] Check all JS files are present
- [ ] Check styles.css is present
- [ ] Check images/ directory uploaded
- [ ] Verify no node_modules/ or .git/ folders

## DNS Configuration
- [ ] Get nameserver details from Host Africa
- [ ] Log into domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Update nameservers to Host Africa nameservers
- [ ] OR create A record pointing to Host Africa server IP
- [ ] Wait 24-48 hours for DNS propagation

## Post-Deployment - Website Verification
- [ ] Test HTTP access: http://old-dog-systems.co.za
- [ ] Test HTTPS access: https://old-dog-systems.co.za
- [ ] Verify all pages load (admin.html, dashboard.html, etc.)
- [ ] Check images display correctly
- [ ] Test forms (if any)
- [ ] Test payment integration (Lemon Squeezy, PayFast)
- [ ] Verify navigation works
- [ ] Check console for JavaScript errors (F12)

## Email Verification
- [ ] info@old-dog-systems.co.za is accessible
- [ ] sales@old-dog-systems.co.za is accessible
- [ ] Test sending emails from each account
- [ ] If using SMTP in app, update email config:
  - [ ] Update SMTP server to: smtp.old-dog-systems.co.za:465
  - [ ] Update credentials in .env (created on FTP server)
  - [ ] Test email sending from app

## SSL/TLS Certificate
- [ ] SSL certificate installed and active
- [ ] HTTPS works (lock icon visible in browser)
- [ ] No SSL warnings
- [ ] Certificate is valid for old-dog-systems.co.Za
- [ ] Automatic HTTPS redirect configured

## Database & Backend
- [ ] Database connection string updated (if applicable)
- [ ] .env file created on FTP server with correct variables
- [ ] Node.js modules installed (npm install if needed)
- [ ] Backend services running
- [ ] Database queries working

## Monitoring (First 48 Hours)
- [ ] Monitor website performance
- [ ] Check server logs for errors
- [ ] Verify all users can access site
- [ ] Monitor email delivery
- [ ] Test payments working
- [ ] Test user accounts/authentication

## Final Steps
- [ ] All tests passed ✓
- [ ] Update internal documentation
- [ ] Inform team of new domain
- [ ] Update bookmarks to old-dog-systems.co.za
- [ ] Update external links if necessary
- [ ] Archive Render deployment instructions

## Rollback Contingency
- [ ] Render.com site still active as backup
- [ ] Can revert DNS to Render if major issues found
- [ ] Have backup DNS settings noted
- [ ] FTP files preserved as backup

## Decommission (After 48 Hours if Stable)
- [ ] Confirm new domain working perfectly
- [ ] Archive render.com deployment info
- [ ] Update documentation to reflect old-dog-systems.co.za
- [ ] Consider keeping Render GitHub workflow for future
- [ ] Set reminder to check FTP backups monthly

---

## Troubleshooting Notes

### If deployment script fails:
- Check internet connection
- Verify lftp is installed: `which lftp`
- Try manual deployment using FileZilla GUI
- Check FTP credentials: `ftp.old-dog-systems.co.za:21`

### If website not loading after DNS update:
- Wait for DNS propagation (24-48 hours)
- Clear browser cache (Ctrl+Shift+Del)
- Try different device/network
- Check `dig old-dog-systems.co.za` - verify new IP

### If SSL certificate shows warning:
- Wait 24-48 hours for certificate issuance
- Hard refresh browser (Ctrl+F5)
- Contact Host Africa support

### If emails not working:
- Verify SMTP/IMAP credentials
- Check firewall allows ports 465 and 993
- Test with mail client first (Thunderbird)

---

**Total Estimated Time:** 30 minutes (deployment + testing)  
**Critical Path:** Deployment → DNS Propagation (24-48h) → Verification  
**Last Updated:** March 14, 2026

## Quick Status
```
☐ Pre-Migration
☐ Installation
☐ Deployment
☐ Verification
☐ DNS Configuration
☐ Website Testing
☐ Email Testing
☐ Backend Configuration
☐ Monitoring
☐ Complete
```

Mark completed items with [x]
