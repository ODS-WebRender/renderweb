#!/bin/bash

##############################################################################
# Old Dog Systems - Simple FTP Deployment to LIVE Site
# Target: old-dog-systems.co.za (FTP only)
# Optimized to upload only essential files quickly
##############################################################################

set -e

# Configuration
FTP_HOST="ftp.old-dog-systems.co.za"
FTP_USER="olddofyxcg"
FTP_PASS="zk1R95Z1t3G8jS4lWKdh"
FTP_REMOTE_PATH="public_html"
LOCAL_PATH="/mnt/Master_Storage/Project Folders/Old_Dog_Web"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_header "Old Dog Systems - FTP Deployment (LIVE SITE)"
echo "Target: https://old-dog-systems.co.za"
echo "Method: FTP upload of essential files only"
echo ""

# Check lftp
if ! command -v lftp &> /dev/null; then
    print_error "lftp not installed"
    echo "Install: sudo apt-get install lftp"
    exit 1
fi

print_success "lftp available"
print_info "Connecting to FTP and uploading files..."
print_info "This may take 30-60 seconds..."
echo ""

# Deploy with proper exclusions
# Only upload essential website files, exclude all development/temporary files
lftp -e "
set ftp:ssl-allow no
set net:timeout 60
set net:max-retries 2
set net:connection-limit 1
open -u $FTP_USER:$FTP_PASS $FTP_HOST
cd $FTP_REMOTE_PATH
mirror -R --verbose \
  --exclude-glob '.git/*' \
  --exclude-glob '.git' \
  --exclude-glob 'node_modules/*' \
  --exclude-glob '*.md' \
  --exclude-glob '.env*' \
  --exclude-glob '*.code-workspace' \
  --exclude-glob 'WEB*' \
  --exclude-glob 'web-dev*' \
  --exclude-glob 'rough-diamond*' \
  --exclude-glob 'plugins' \
  --exclude-glob 'data' \
  --exclude-glob '.~lock*' \
  --exclude-glob '.DS_Store' \
  --exclude-glob 'Thumbs.db' \
  --exclude-glob '.deploy-watcher.log' \
  --exclude-glob 'deploy-live.sh' \
  --exclude-glob 'deploy.sh' \
  --exclude-glob 'watch-and-deploy.sh' \
  --exclude-glob '.github*' \
  --exclude-glob '{DEPLOYMENT,FTP,PHASE,CHECKLIST,GUIDE,AUDIT,REPORT}*' \
  '$LOCAL_PATH' .
bye
"

RESULT=$?

echo ""
print_header "Deployment Complete"

if [ $RESULT -eq 0 ]; then
    print_success "Files uploaded successfully to FTP"
    print_success "Website updated at: https://old-dog-systems.co.za"
    echo ""
    print_info "Changes will be visible within seconds"
    print_info "Backup site: https://old-dog-systems1.onrender.com"
else
    print_error "FTP deployment had issues (exit code: $RESULT)"
    echo ""
    print_info "This might be due to:"
    echo "  • Network timeout (FTP server responding slowly)"
    echo "  • Large .git directory being processed"
    echo "  • Lock files from editor (safe to ignore)"
    echo ""
    print_info "Some files may have uploaded successfully."
    print_info "Check: https://old-dog-systems.co.za"
fi

exit $RESULT
