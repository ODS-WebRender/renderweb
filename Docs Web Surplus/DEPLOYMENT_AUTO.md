# Automatic Deployment Guide

Old Dog Systems deployment uses **FTP ONLY** for your live site.

## 🎯 Important Clarification

| Site | Purpose | Method | Use |
|------|---------|--------|-----|
| **old-dog-systems.co.za** | **LIVE SITE** | FTP | Use this daily |
| old-dog-systems1.onrender.com | Backup/Testing | Render (GitHub) | For major testing only |

---

## 🚀 Quick Start

### Option 1: Auto-Watch Mode (Easiest)
Automatically redeploys whenever you save a file:

```bash
./watch-and-deploy.sh
```

Then just edit files normally in VS Code. The site updates automatically every time you save.

**In VS Code:** Press `Ctrl+Shift+B` → Select "Watch Files & Auto-Deploy"

---

## 📋 All Deployment Options

### Direct Deployment Commands

**Deploy to FTP only (primary domain):**
```bash
./deploy.sh --ftp-only
```
Updates: `https://old-dog-systems.co.za` (instant)

**Deploy to Render only (backup):**
```bash
./deploy.sh --render-only
```
Updates: `https://old-dog-systems1.onrender.com` (2-3 minutes)

**Deploy to both (all domains):**
```bash
./deploy.sh
```
Updates both sites simultaneously.

---

## 🎯 VS Code Integration

### Quick Deploy Keyboard Shortcuts

1. **Keyboard Shortcut:** `Ctrl+Shift+B` (or `Cmd+Shift+B` on Mac)
   - Opens task picker
   - Select your deployment option
   - Watch status in terminal panel

2. **Task Options:**
   - **Deploy to old-dog-systems.co.za (FTP)** - Primary, fastest
   - **Deploy to Render (Backup)** - Backup domain
   - **Deploy to Both (FTP + Render)** - All domains
   - **Watch Files & Auto-Deploy** - Continuous monitoring

### Custom Keyboard Shortcuts (Optional)

Add to `.vscode/keybindings.json`:

```json
[
    {
        "key": "ctrl+alt+d",
        "command": "workbench.action.tasks.runTask",
        "args": "Deploy to old-dog-systems.co.za (FTP)"
    },
    {
        "key": "ctrl+alt+w",
        "command": "workbench.action.tasks.runTask",
        "args": "Watch Files & Auto-Deploy"
    }
]
```

---

## 🔄 Workflow Examples

### ✏️ Making a Quick Change

1. Edit your file in VS Code
2. Save (`Ctrl+S`)
3. Press `Ctrl+Shift+B` → Select "Deploy to old-dog-systems.co.za (FTP)"
4. **Done!** Site updates in ~10 seconds

### 🔁 Continuous Development (Recommended)

1. Open terminal: `Terminal` → `New Terminal`
2. Run: `./watch-and-deploy.sh`
3. Edit files normally
4. **Automatic deployment** on every save
5. Check `https://old-dog-systems.co.za` for live changes

### 🛠️ Batch Changes + Render Sync

When making multiple changes and want backup sync:

```bash
# Edit files...
# Then deploy to all domains
./deploy.sh
```

---

## 📊 Deployment Targets

| Domain | Type | Speed | Use Case |
|--------|------|-------|----------|
| `old-dog-systems.co.za` | FTP | Instant (~10s) | **PRIMARY** - Use this |
| `old-dog-systems1.onrender.com` | Render | 2-3 min | **BACKUP** - For redundancy |

---

## 🔐 Security & Storage

### Credentials Used
- **FTP:** `olddofyxcg` (stored in deploy script)
- **GitHub Token:** `.github-token` (if Render deployment)
- **Email:** `info@old-dog-systems.co.za`, `sales@old-dog-systems.co.za`

### Safety Notes
- Credentials are only used for deployment
- `.github-token` is in `.gitignore`
- Never commit credentials to git
- All credentials are encrypted during deployment

---

## 🧪 Testing Deployment

### Quick Test

```bash
# Make a small change (e.g., add comment to HTML)
# Then deploy
./deploy.sh --ftp-only

# Verify in browser
# https://old-dog-systems.co.za
```

### Check Logs

```bash
# View deployment log
tail -f .deploy-watcher.log
```

---

## 🐛 Troubleshooting

### FTP Connection Issues

If you get FTP errors:

1. **Check internet connection:**
   ```bash
   ping ftp.old-dog-systems.co.za
   ```

2. **Test FTP credentials manually:**
   ```bash
   lftp -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za
   ```

3. **Verify lftp is installed:**
   ```bash
   which lftp
   # If not found, install: sudo apt-get install lftp
   ```

### Auto-Watch Not Working

If `watch-and-deploy.sh` doesn't trigger:

1. **Check inotifywait:**
   ```bash
   which inotifywait
   # Install if needed: sudo apt-get install inotify-tools
   ```

2. **Run watcher with verbose output:**
   ```bash
   ./watch-and-deploy.sh
   # Look for "File changed" messages
   ```

### Render Deployment Slow

- Render builds from git, takes 2-3 minutes
- FTP deployment is immediate for faster feedback
- Use `--ftp-only` for quick iterations

---

## ⚙️ Manual Commands for Reference

### Just FTP Upload (No Git)
```bash
lftp -u olddofyxcg,zk1R95Z1t3G8jS4lWKdh ftp.old-dog-systems.co.za << EOF
lcd /mnt/Master_Storage/Project\ Folders/Old_Dog_Web
cd /public_html
mirror --reverse --delete --verbose
quit
EOF
```

### Render Manual Deploy
```bash
curl -X POST "https://api.render.com/deploy/srv-d5saf6hr0fns739h1900?key=thZJo3zu6a8"
```

---

## 📞 Support Contacts

**Email Accounts:**
- `info@old-dog-systems.co.za` (Password: log26M1KB9v2)
- `sales@old-dog-systems.co.za` (Password: AF8HgZj17RAr)

**Mail Settings:**
- Incoming: mail.old-dog-systems.co.za (IMAP 993 / POP 995)
- Outgoing: smtp.old-dog-systems.co.za (SMTP 465)
- SSL/TLS: On

---

## 🎯 Next Steps

1. **Try auto-watch:** `./watch-and-deploy.sh`
2. **Edit a test file** (e.g., add a comment)
3. **Verify it updates** at https://old-dog-systems.co.za
4. **Set up keyboard shortcut** (optional, for quick deploys)
5. **Enjoy automatic deployments!** ✨

---

**Last Updated:** March 2026
**Primary Domain:** https://old-dog-systems.co.za
**Status:** ✅ Fully Operational
