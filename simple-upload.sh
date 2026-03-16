#!/bin/bash

# Simple FTP Upload Script
set -e

FTP_HOST="ftp.old-dog-systems.co.za"
FTP_USER="olddofyxcg"
FTP_PASS="zk1R95Z1t3G8jS4lWKdh"
REMOTE_PATH="public_html"
LOCAL_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "Uploading Website Files to FTP"
echo "=========================================="
echo ""

# Key HTML files
HTML_FILES=(
  "index.html"
  "admin.html"
  "dashboard.html"
  "shop.html"
  "about.html"
  "checkout-success.html"
  "affiliate-dashboard.html"
  "admin-dashboard.html"
  "media.html"
  "downloads.html"
)

# Key JS files
JS_FILES=(
  "auth.js"
  "components.js"
  "constants.js"
  "db.js"
  "email.js"
  "invoice.js"
  "paymentProcessor.js"
  "server.js"
)

# Other files
OTHER_FILES=(
  "styles.css"
  "products.json"
  "olddog-erp-product.json"
)

# Build lftp command
CMD="set ftp:ssl-allow no;"
CMD="$CMD open -u $FTP_USER,$FTP_PASS $FTP_HOST;"
CMD="$CMD cd $REMOTE_PATH;"

# Upload HTML files
for file in "${HTML_FILES[@]}"; do
  if [ -f "$LOCAL_PATH/$file" ]; then
    CMD="$CMD put '$LOCAL_PATH/$file' '$file';"
  fi
done

# Upload JS files
for file in "${JS_FILES[@]}"; do
  if [ -f "$LOCAL_PATH/$file" ]; then
    CMD="$CMD put '$LOCAL_PATH/$file' '$file';"
  fi
done

# Upload other files
for file in "${OTHER_FILES[@]}"; do
  if [ -f "$LOCAL_PATH/$file" ]; then
    CMD="$CMD put '$LOCAL_PATH/$file' '$file';"
  fi
done

# Verify uploads
CMD="$CMD ls -lah | grep -E '\.html|\.js|\.css|\.json';"

echo "Connecting to FTP server..."
lftp -c "$CMD bye"

echo ""
echo "=========================================="
echo "✓ Upload completed!"
echo "=========================================="
echo ""
echo "Verifying files on server..."
lftp -c "set ftp:ssl-allow no; open -u $FTP_USER,$FTP_PASS $FTP_HOST; cd $REMOTE_PATH; ls -lah | head -40"
