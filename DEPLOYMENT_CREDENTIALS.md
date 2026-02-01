# Deployment Credentials & Process

## GitHub Access
**Token File:** `.github-token` (stored locally, never committed)

**To push and deploy:**
```bash
TOKEN=$(cat .github-token)
git push https://x-access-token:$TOKEN@github.com/ODS-WebRender/renderweb.git main
```

Or one-liner:
```bash
git push https://x-access-token:$(cat .github-token)@github.com/ODS-WebRender/renderweb.git main
```

## Render Deployment
**Deploy Webhook URL:** `https://api.render.com/deploy/srv-d5saf6hr0fns739h1900?key=thZJo3zu6a8`

**To trigger deploy after pushing:**
```bash
curl -X POST "https://api.render.com/deploy/srv-d5saf6hr0fns739h1900?key=thZJo3zu6a8"
```

**Deployment takes 2-3 minutes. Check live at:** https://old-dog-systems1.onrender.com/

## Complete Deployment Workflow
```bash
# 1. Make edits to files
# 2. Commit locally
git add .
git commit -m "Your message"

# 3. Push to GitHub
git push https://x-access-token:$(cat .github-token)@github.com/ODS-WebRender/renderweb.git main

# 4. Trigger Render deploy
curl -X POST "https://api.render.com/deploy/srv-d5saf6hr0fns739h1900?key=thZJo3zu6a8"

# 5. Wait 2-3 minutes for deployment to complete
```

## Security Notes
- `.github-token` is in `.gitignore` and will never be committed
- Token has `repo` scope on GitHub
- Keep this file and credentials.md secure
- If token is compromised, rotate it immediately at https://github.com/settings/tokens

## Repositories
- **GitHub:** https://github.com/ODS-WebRender/renderweb
- **Live Site:** https://old-dog-systems1.onrender.com/
