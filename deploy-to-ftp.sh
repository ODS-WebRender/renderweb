#!/bin/bash

# FTP Deployment Script for old-dog-systems.co.za
# This script uploads the website to the FTP server

set -e

# FTP Credentials
FTP_HOST="ftp.old-dog-systems.co.za"
FTP_USER="olddofyxcg"
FTP_PASS="zk1R95Z1t3G8jS4lWKdh"
FTP_PORT="21"
REMOTE_PATH="public_html"

# Local path
LOCAL_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "FTP Deployment to old-dog-systems.co.za"
echo "=========================================="
echo "FTP Host: $FTP_HOST"
echo "Remote Path: $REMOTE_PATH"
echo "Local Path: $LOCAL_PATH"
echo ""

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "ERROR: lftp is not installed."
    echo "Install lftp with: sudo apt-get install lftp"
    exit 1
fi

# Create exclude list file
EXCLUDE_FILE="/tmp/ftp_exclude_$$.txt"
cat > "$EXCLUDE_FILE" << 'EOF'
.git
.github-token
node_modules
.env
.env.example
.gitignore
.~lock*
.DS_Store
*.md
WEB Instruct Etc
WEB PROMPT.txt
OLD DOD SYSTEMS FTP.txt
*.code-workspace
rough-diamond-studio
web-dev1
plugins
data
deploy-to-ftp.sh
EOF

echo "Creating FTP connection and uploading files..."
echo ""

# Create temporary exclude file
EXCLUDE_FILE=$(mktemp)
cat > "$EXCLUDE_FILE" << 'EXCLUDES'
.git
.github-token
node_modules
.env
.env.example
.gitignore
.~lock*
.DS_Store
*.md
WEB Instruct Etc
WEB PROMPT.txt
OLD DOD SYSTEMS FTP.txt
*.code-workspace
rough-diamond-studio
web-dev1
plugins
data
deploy-to-ftp.sh
.git_*
EXCLUDES

# Use lftp for secure FTP connection
lftp -c "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
open -u $FTP_USER,$FTP_PASS $FTP_HOST
cd $REMOTE_PATH
mirror -R --verbose \
  --exclude-glob '.*' \
  --exclude-glob 'node_modules' \
  --exclude-glob '.git' \
  --exclude-glob '*.md' \
  --exclude-glob '.~lock*' \
  --exclude-glob 'WEB*' \
  --exclude-glob '*.code-workspace' \
  --exclude-glob 'rough-diamond*' \
  --exclude-glob 'web-dev*' \
  --exclude-glob 'plugins' \
  --exclude-glob '.env*' \
  --exclude-glob 'deploy-to-ftp.sh' \
  $LOCAL_PATH/ .
bye
"

RESULT=$?
rm -f "$EXCLUDE_FILE"

RESULT=$?

echo ""
echo "=========================================="
if [ $RESULT -eq 0 ]; then
    echo "✓ Deployment completed successfully!"
    echo "Your site should now be accessible at:"
    echo "  http://old-dog-systems.co.za"
    echo "  https://old-dog-systems.co.za"
else
    echo "✗ Deployment failed with exit code: $RESULT"
    echo "Please check:"
    echo "  1. FTP credentials are correct"
    echo "  2. Your internet connection"
    echo "  3. The public_html directory exists on the server"
fi
echo "=========================================="

# Clean up
rm -f "$EXCLUDE_FILE"

exit $RESULT
