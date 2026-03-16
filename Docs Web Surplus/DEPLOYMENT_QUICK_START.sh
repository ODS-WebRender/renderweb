#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║           OLD DOG SYSTEMS - QUICK DEPLOYMENT REFERENCE                   ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

cat << 'EOF'

🚀 AUTOMATIC DEPLOYMENT - QUICK START
═════════════════════════════════════════════════════════════════════════════

📌 THREE WAYS TO DEPLOY:

  1️⃣  AUTO-WATCH (Recommended)
  ─────────────────────────────
  ./watch-and-deploy.sh
  
  → Automatically deploys every time you save a file
  → Requires: ./watch-and-deploy.sh running in terminal
  → Speed: ~10 seconds per change


  2️⃣  KEYBOARD SHORTCUT (Quick Deploy)
  ────────────────────────────────────
  Press: Ctrl+Shift+B  (in VS Code)
  
  → Select "Deploy to old-dog-systems.co.za (FTP)"
  → One-click deployment
  → Speed: ~10 seconds


  3️⃣  COMMAND LINE (Manual)
  ────────────────────────
  ./deploy.sh --ftp-only
  
  → Deploy FTP to primary domain
  → Alternatives:
    • ./deploy.sh --render-only   (backup domain, slower)
    • ./deploy.sh                 (both domains)
  → Speed: ~10 seconds (FTP) or 2-3 min (Render)

═════════════════════════════════════════════════════════════════════════════

🌐 DEPLOYMENT TARGETS:

  PRIMARY:   https://old-dog-systems.co.za         ← Use this
  BACKUP:    https://old-dog-systems1.onrender.com ← Redundancy

═════════════════════════════════════════════════════════════════════════════

📋 TYPICAL WORKFLOW:

  Step 1: Edit files in VS Code (normal editing)
  Step 2: Save file (Ctrl+S)
  Step 3: Press Ctrl+Shift+B → Select FTP deploy
  Step 4: Wait ~10 seconds
  Step 5: Refresh browser to see changes
  
  OR use ./watch-and-deploy.sh for automatic updates!

═════════════════════════════════════════════════════════════════════════════

⚙️  SETUP (One-time):

  1. Install lftp (if needed):
     sudo apt-get install lftp

  2. Make scripts executable:
     chmod +x deploy.sh watch-and-deploy.sh

  3. Test it:
     ./deploy.sh --ftp-only

═════════════════════════════════════════════════════════════════════════════

📚 FULL DOCUMENTATION:

  Open: DEPLOYMENT_AUTO.md

═════════════════════════════════════════════════════════════════════════════

🔐 CREDENTIALS SECURED:

  ✓ FTP credentials in deploy script (encrypted during transfer)
  ✓ GitHub token in .gitignore (never committed)
  ✓ All data transferred over SSL/TLS

═════════════════════════════════════════════════════════════════════════════

✨ That's it! You're ready to deploy.

Any changes you make → Auto-update to https://old-dog-systems.co.za

═════════════════════════════════════════════════════════════════════════════

EOF
