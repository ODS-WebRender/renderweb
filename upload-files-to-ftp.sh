#!/bin/bash

# FTP File Upload Script - Uploads files individually
# This bypasses the mirror directory structure issues

set -e

FTP_HOST="ftp.old-dog-systems.co.za"
FTP_USER="olddofyxcg"
FTP_PASS="zk1R95Z1t3G8jS4lWKdh"
FTP_PORT="21"
REMOTE_PATH="public_html"
LOCAL_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "FTP File Upload - old-dog-systems.co.za"
echo "=========================================="
echo "FTP Host: $FTP_HOST"
echo "Remote Path: $REMOTE_PATH"
echo "Local Path: $LOCAL_PATH"
echo ""

# Files to upload (in priority order)
declare -a FILES=(
  # HTML Files
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
  "erp-download.html"
  "erp-phase2.html"
  "cpm-ai.html"
  "cpm-ai-phase2.html"
  "buildenv-ai-academy.html"
  "nextgen-contractor-coach.html"
  "propaI-pro.html"
  "propaI-pro-phase2.html"
  "small-ai-toolkit.html"
  "small-ai-toolkit-complete.html"
  "revenue-engine.html"
  "old-dog-erp.html"
  "studio.html"
  "PHASE2_PRODUCT_TEMPLATE.html"
  "PRODUCT_PAGE_TEMPLATE.html"

  # JavaScript Files  
  "auth.js"
  "components.js"
  "constants.js"
  "db.js"
  "email.js"
  "invoice.js"
  "lemon-squeezy.js"
  "paymentProcessor.js"
  "shop-filter.js"
  "server.js"
  
  # JSON Files
  "products.json"
  "olddog-erp-product.json"
  
  # CSS Files
  "styles.css"
)

# Create FTP command file
FTP_COMMANDS=$(mktemp)

{
  echo "open -u $FTP_USER,$FTP_PASS ftp://$FTP_HOST:$FTP_PORT"
  echo "cd $REMOTE_PATH"
  
  # Add put commands for each file
  for file in "${FILES[@]}"; do
    if [ -f "$LOCAL_PATH/$file" ]; then
      echo "put '$LOCAL_PATH/$file' '$file'"
      echo "echo Uploaded: $file"
    fi
  done
  
  # Upload directories (mput)
  echo "# Upload images directory if it exists"
  [ -d "$LOCAL_PATH/images" ] && echo "mput -r $LOCAL_PATH/images/ images/"
  
  # List final directory
  echo "ls -lah"
  echo "bye"
  
} > "$FTP_COMMANDS"

echo "Uploading files..."
echo ""

# Execute FTP commands
lftp < "$FTP_COMMANDS"

RESULT=$?

echo ""
echo "=========================================="
if [ $RESULT -eq 0 ]; then
    echo "✓ Upload completed successfully!"
    echo "Your site should now be accessible at:"
    echo "  http://old-dog-systems.co.za"
    echo "  https://old-dog-systems.co.za"
else
    echo "✗ Upload failed with exit code: $RESULT"
fi
echo "=========================================="

rm -f "$FTP_COMMANDS"
exit $RESULT
