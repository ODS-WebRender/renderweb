# QUICK START - Old Dog Systems Website Operations

## 🎯 Current Status
✅ **Website LIVE and RUNNING** at old-dog-systems.co.za  
📊 38+ files deployed | 6 images uploaded | Email configured

---

## 🔥 CRITICAL - Do TODAY

### 1. Configure DNS
Your domain registrar → Update nameservers to Host Africa  
[See: DNS_CONFIGURATION_GUIDE.md]

### 2. Create .env Backend Configuration
```bash
ssh olddofyxcg@ftp.old-dog-systems.co.za
cd public_html
nano .env
# Paste config from BACKEND_CONFIGURATION_GUIDE.md
# Ctrl+X, Y, Enter to save
```

### 3. Verify Website Works
```bash
curl http://old-dog-systems.co.za/
# Should return HTML
```

---

## 🚀 How to Make Changes (Ongoing)

### Quick Update
```bash
cd "/mnt/Master_Storage/Project Folders/Old_Dog_Web"
./simple-upload.sh
```

### Update Single File (Fastest)
```bash
lftp -c "
set ftp:ssl-allow no
open -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
cd public_html
put 'filename.html'
bye
"
```

### Update on FTP Server
Right-click → Download current version first, then upload updates

### Using FileZilla
Drag & drop files to FTP server (see ONGOING_UPDATES_GUIDE.md)

---

## 🔐 Essential Credentials

| Service | Login | Password | URL |
|---------|-------|----------|-----|
| FTP | olddofyxcg | zk1R95Z...(33char) | ftp.old-dog-systems.co.za:21 |
| Email (Info) | info@.. | log26M1... | mail.old-dog-systems.co.za |
| Email (Sales) | sales@.. | AF8HgZ... | mail.old-dog-systems.co.za |

**Keep these secure! Do not share or commit to git.**

---

## 📍 Key Locations

| Item | Location |
|------|----------|
| Website Files | /mnt/Master_Storage/Project Folders/Old_Dog_Web/ |
| FTP Location | ftp.old-dog-systems.co.za:/public_html/ |
| Images | public_html/images/ (on FTP) |
| Email | info@ and sales@old-dog-systems.co.za |
| Webmail | http://mail.old-dog-systems.co.za |
| Live Site | http://old-dog-systems.co.za/ |

---

## 📋 Available Scripts

```bash
./simple-upload.sh    # Upload HTML/JS/CSS/JSON (30 seconds)
./deploy-to-ftp.sh    # Full deployment (5 minutes)
./upload-images.sh    # Update images directory
```

---

## ✓ Testing Checklist

- [ ] Homepage loads: http://old-dog-systems.co.za/
- [ ] Images display
- [ ] Email links in footer work
- [ ] No JavaScript errors (F12 Console)
- [ ] Mobile responsive (test on phone)
- [ ] DNS resolves: `nslookup old-dog-systems.co.za`
- [ ] HTTPS works: `https://old-dog-systems.co.za/`
- [ ] Payment integration operational

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Site not loading | Wait 24-48h for DNS propagation; check FTP files exist |
| Images missing | Check images/ folder on FTP; verify permissions |
| Email not working | ssh into server; verify .env EMAIL credentials |
| JavaScript errors | Hard refresh (Ctrl+Shift+R); check console (F12) |
| Slow site | Check file sizes; verify CDN resources load; compress images |

[Full troubleshooting: ONGOING_UPDATES_GUIDE.md]

---

## 📚 Complete Documentation

| Document | Purpose |
|----------|---------|
| IMPLEMENTATION_COMPLETE.md | Full status report & checklist |
| DNS_CONFIGURATION_GUIDE.md | How to set up domain DNS |
| BACKEND_CONFIGURATION_GUIDE.md | Environment variables setup |
| ONGOING_UPDATES_GUIDE.md | How to make changes |
| FTP_DEPLOYMENT_GUIDE.md | Detailed FTP instructions |
| MIGRATION_CHECKLIST.md | Step-by-step verification |

---

## 🔄 Maintenance Schedule

**Daily:** Monitor site, check emails  
**Weekly:** Review logs, check performance  
**Monthly:** Full backup, security audit  
**As needed:** Update content, deploy changes  

---

## 📞 Get Help

- **Hosting Support:** support@hostnafrica.co.za
- **DNS Issues:** Your domain registrar
- **Payment:** Lemon Squeezy / PayFast support
- **Email:** Contact Host Africa if SMTP fails

---

## 💡 Pro Tips

✓ Always backup before major changes  
✓ Test locally before uploading HTML  
✓ Keep FTP credentials secure  
✓ Clear browser cache after CSS changes  
✓ Use FileZilla for large file uploads  
✓ Set up automated backups: `./backup-website.sh`  

---

## ⏱️ Typical Workflow

```
1. Edit file locally (2 min)
2. Test in browser (1 min)
3. Upload via script (1 min)
4. Verify on live site (1 min)
━━━━━━━━━━━━━━━━━━━━━━
Total: 5 minutes
```

---

**Everything you need is in this folder.**  
**You've got this! 🚀**

---

*Document Version: 1.0 — March 14, 2026*
