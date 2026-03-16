#!/bin/bash

# Upload Images & Assets to FTP
set -e

FTP_HOST="ftp.old-dog-systems.co.za"
FTP_USER="olddofyxcg"
FTP_PASS="zk1R95Z1t3G8jS4lWKdh"
REMOTE_PATH="public_html"
LOCAL_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "Uploading Images & Assets to FTP"
echo "=========================================="
echo ""

# Create FTP batch commands
CMD="set ftp:ssl-allow no;"
CMD="$CMD open -u $FTP_USER,$FTP_PASS $FTP_HOST;"
CMD="$CMD cd $REMOTE_PATH;"

# Upload images directory recursively
if [ -d "$LOCAL_PATH/images" ]; then
  echo "Uploading images directory..."
  CMD="$CMD mkdir -p images;"
  for file in "$LOCAL_PATH/images"/*; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      CMD="$CMD put '$file' 'images/$filename';"
    fi
  done
  echo "Images to upload: $(ls -1 "$LOCAL_PATH/images" | wc -l) files"
fi

# Upload styles.css if exists (backup)
if [ -f "$LOCAL_PATH/styles.css" ]; then
  CMD="$CMD put '$LOCAL_PATH/styles.css' 'styles.css';"
fi

# Upload render.yaml if exists (for deployment reference)
if [ -f "$LOCAL_PATH/render.yaml" ]; then
  CMD="$CMD put '$LOCAL_PATH/render.yaml' 'render.yaml';"
fi

# Verify upload
CMD="$CMD ls -lah images/ | head -10;"
CMD="$CMD echo 'Verification: Images uploaded';"

echo "Connecting to FTP and uploading..."
lftp -c "$CMD bye"

RESULT=$?

echo ""
echo "=========================================="
if [ $RESULT -eq 0 ]; then
    echo "✓ Assets uploaded successfully!"
    echo ""
    echo "Verifying on server..."
    lftp -c "set ftp:ssl-allow no; open -u $FTP_USER,$FTP_PASS $FTP_HOST; cd $REMOTE_PATH; echo 'Images directory:'; ls -lah images/ | head -15; echo ''; echo 'Total files in public_html:'; ls -1 | wc -l"
else
    echo "✗ Upload failed"
fi
echo "=========================================="

exit $RESULT
