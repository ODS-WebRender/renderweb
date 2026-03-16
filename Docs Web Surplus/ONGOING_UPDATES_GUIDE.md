# Ongoing Updates & Deployment Workflow

## Quick Reference - Three Deployment Methods

### Option 1: Simple Script (Fastest)
```bash
cd "/mnt/Master_Storage/Project Folders/Old_Dog_Web"
./simple-upload.sh
```

### Option 2: Manual FTP Update
```bash
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'filename.html' 'filename.html'
ls -lah filename.html
bye
"
```

### Option 3: GUI FileZilla
- See "FileZilla Setup" section below

---

## Types of Updates

### 1. Update HTML Files (Pages)
**Files affected:**
- index.html
- shop.html
- dashboard.html
- about.html
- admin.html
- media.html
- etc.

**Process:**
```bash
cd "/mnt/Master_Storage/Project Folders/Old_Dog_Web"

# 1. Edit file locally
nano index.html  # or use VS Code

# 2. Test locally in browser (if applicable)
# Open file:///path/to/Old_Dog_Web/index.html in browser

# 3. Upload single file
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'index.html'
bye
"

# 4. Verify on live site
curl -I https://old-dog-systems.co.za/index.html
```

### 2. Update JavaScript Files
**Files affected:**
- auth.js
- components.js
- db.js
- server.js
- paymentProcessor.js
- etc.

**Process:**
```bash
# 1. Edit and test locally
nano auth.js

# 2. Check syntax
node -c auth.js

# 3. Upload
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'auth.js'
bye
"

# 4. Test in browser console - refresh and check for JS errors (F12)
```

### 3. Update CSS Files
**File:** styles.css

**Process:**
```bash
nano styles.css

# Upload
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'styles.css'
bye
"

# Clear cache and refresh browser (Ctrl+Shift+R)
```

### 4. Update Image Assets
**Directory:** images/

**Process:**
1. Edit/create new image locally
2. Save to images/ folder
3. Upload via FTP:
```bash
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html/images
put 'new-image.png'
bye
"
```

### 5. Update JSON Data Files
**Files affected:**
- products.json
- olddog-erp-product.json

**Process:**
```bash
# 1. Edit JSON file
nano products.json

# 2. Validate JSON syntax
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('products.json')); console.log('✓ Valid JSON')"

# 3. Upload
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'products.json'
bye
"

# 4. Test API
curl https://old-dog-systems.co.za/products.json | jq '.'
```

### 6. Update Backend .env Configuration
⚠️ **This requires SSH access:**

```bash
ssh olddofyxcg@ftp.old-dog-systems.co.za
cd public_html

# Edit .env
nano .env

# Your changes here, save with Ctrl+X, Y, Enter

# Verify changes
cat .env | grep CHANGED_VALUE

# Restart services (if applicable)
# npm restart  # or similar based on your setup
exit
```

---

## Batch Updates - Multiple Files

### Upload multiple HTML files:
```bash
cd "/mnt/Master_Storage/Project Folders/Old_Dog_Web"

lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'index.html'
put 'shop.html'
put 'dashboard.html'
put 'about.html'
ls -1 *.html | head -10
bye
"
```

### Upload all modified files:
```bash
./simple-upload.sh  # Uploads all core files
```

---

## Using FileZilla GUI (No Command Line)

### Setup FileZilla
1. Download: https://filezilla-project.org/
2. Go to File → Site Manager
3. Create new site:
   - **Protocol:** FTP
   - **Host:** ftp.old-dog-systems.co.za
   - **Port:** 21
   - **Encryption:** "Only use plain FTP (insecure)"
   - **User:** olddofyxcg
   - **Password:** zk1R95Z1t3G8jS4lWKdh
4. Click "Connect"

### Upload Files with FileZilla
1. Navigate to public_html in the "Remote site" panel
2. Drag and drop files from local folder to public_html
3. Right-click file → "Upload" (Ctrl+Shift+U)
4. Verify upload in Remote site panel

### Sync Entire Folders
1. Right-click folder on Local site
2. Select "Upload"
3. Check "Overwrite if exists"
4. Let it transfer all files and subdirectories

---

## Updating Backend Apps (Node.js)

If your backend server is running on FTP:

```bash
ssh olddofyxcg@ftp.old-dog-systems.co.za
cd public_html

# Stop current server
pkill -f "node server.js"  # or whatever your process is
# Or if using PM2:
# pm2 stop app

# Update files
lftp -c "...upload new js files..."

# Reinstall dependencies if needed
npm install

# Restart server
node server.js &
# Or with PM2:
# pm2 start app.js

# Check logs
tail -f logs/server.log
```

---

## Git-Based Deployment (If Using GitHub)

If you keep files in Git and sync to FTP:

```bash
cd "/mnt/Master_Storage/Project Folders/Old_Dog_Web"

# Make changes
nano index.html
nano styles.css

# Commit locally
git add index.html styles.css
git commit -m "Update: Fix homepage layout"

# Push to GitHub
git push origin main

# Deploy to FTP
./simple-upload.sh

# Or use webhook (if GitHub Actions configured)
```

---

## Before/After Deployment Checklist

### Before Deployment
- [ ] Edited and tested files locally
- [ ] Verified HTML syntax (valid tags)
- [ ] Validated JSON files (if data files)
- [ ] Checked JavaScript syntax (`node -c file.js`)
- [ ] Verified image files are optimized
- [ ] Tested links are correct
- [ ] Backed up current version

### After Deployment
- [ ] Verified file upload successful (check file size/date)
- [ ] Hard refresh website (Ctrl+Shift+R)
- [ ] Clear browser cache if needed
- [ ] Check no new JavaScript errors (F12 console)
- [ ] Test all affected functionality
- [ ] Verify images load correctly
- [ ] Mobile test (different devices)
- [ ] Check no broken links

---

## Automation - Daily/Weekly Backups

### Backup all files to local drive:
```bash
#!/bin/bash
BACKUP_DATE=$(date +%Y%m%d)
BACKUP_DIR="backups/old-dog-systems-$BACKUP_DATE"

mkdir -p "$BACKUP_DIR"

# Download all files from FTP
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
mirror -R --verbose . $BACKUP_DIR
bye
"

# Create tar archive
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
echo "Backup created: ${BACKUP_DIR}.tar.gz"
```

Save as `backup-website.sh` and run:
```bash
chmod +x backup-website.sh
./backup-website.sh
```

---

## Comparing Versions

See what changed since last deployment:

```bash
# Compare local file with FTP version
diff index.html index.html.backup

# Download current FTP version for comparison
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
get 'index.html' 'index.html.ftp'
bye
"

# Compare
diff index.html index.html.ftp
```

---

## Rolling Back Changes

If you made a mistake:

### Restore from backup
```bash
# You kept daily backups, right?
tar -xzf backups/old-dog-systems-20260314.tar.gz

# Upload previous version
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'backups/old-dog-systems-20260314/index.html' 'index.html'
bye
"
```

### Or download working version from FTP
```bash
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
get 'index.html' 'index.html.working'
bye
"

# Then upload working version again
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'index.html.working' 'index.html'
bye
"
```

---

## Deployment Scripts Summary

You now have these scripts available:

| Script | Purpose | Usage |
|--------|---------|-------|
| `simple-upload.sh` | Quick upload of core files | `./simple-upload.sh` |
| `deploy-to-ftp.sh` | Full site deployment | `./deploy-to-ftp.sh` |
| `upload-images.sh` | Upload images directory | `./upload-images.sh` |

### Create new scripts as needed:
```bash
#!/bin/bash
# upload-batch.sh - Upload specific files

lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'file1.html'
put 'file2.html'
put 'file3.js'
bye
"
echo "✓ Batch upload complete"
```

---

## Quick Deployment Summary

```
Edit File → Test Locally → Upload → Verify on Site → Done!

1-2 minute process for most updates
5-10 minutes for complex changes
```

---

## Common Questions

**Q: How do I update the shop page?**
A: Edit shop.html, then: `simple-upload.sh`

**Q: Can I edit files directly on the server?**
A: Yes, via SSH: `ssh olddofyxcg@ftp.old-dog-systems.co.za && nano public_html/index.html`

**Q: What if I accidentally upload the wrong file?**
A: Download the working version from FTP and re-upload it, or restore from backup.

**Q: How often should I backup?**
A: Daily if making changes, weekly minimum. Set up automated backups.

**Q: Can I schedule deployments?**
A: Yes, use cron jobs (Linux) or Task Scheduler (Windows) to run upload scripts.

---

**Document Version:** 1.0  
**Last Updated:** March 14, 2026  
**Next Review:** After first deployment
