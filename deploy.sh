#!/bin/bash

##############################################################################
# Old Dog Systems - Automatic Deployment Script
# PRIMARY: Deploys to FTP (old-dog-systems.co.za) - LIVE SITE
# BACKUP: Optionally deploys to Render (old-dog-systems1.onrender.com) - Testing
##############################################################################

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FTP_HOST="ftp.old-dog-systems.co.za"
FTP_USER="olddofyxcg"
FTP_PASS="zk1R95Z1t3G8jS4lWKdh"
FTP_REMOTE_PATH="/public_html"
LOCAL_PATH="/mnt/Master_Storage/Project Folders/Old_Dog_Web"

RENDER_WEBHOOK="https://api.render.com/deploy/srv-d5saf6hr0fns739h1900?key=thZJo3zu6a8"
GITHUB_REPO="https://github.com/ODS-WebRender/renderweb"

##############################################################################
# Functions
##############################################################################

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if lftp is installed
check_dependencies() {
    print_header "Checking Dependencies"
    
    if ! command -v lftp &> /dev/null; then
        print_warning "lftp not found. Installing..."
        sudo apt-get update && sudo apt-get install -y lftp || {
            print_error "Failed to install lftp"
            exit 1
        }
    fi
    print_success "lftp is available"
}

# Deploy via FTP
deploy_ftp() {
    print_header "Deploying to FTP (old-dog-systems.co.za - LIVE SITE)"
    
    cd "$LOCAL_PATH"
    
    # Use lftp with strict exclusions for FTP server compatibility
    # Must exclude: .git, node_modules, lock files, symlinks, etc.
    if lftp -c "
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
set net:connection-limit 1
open -u $FTP_USER:$FTP_PASS $FTP_HOST
cd $FTP_REMOTE_PATH
mirror -R --verbose --exclude-glob '.git*' --exclude-glob '.github*' --exclude-glob 'node_modules' --exclude-glob '*.md' --exclude-glob '.env*' --exclude-glob '*.code-workspace' --exclude-glob 'WEB*' --exclude-glob 'web-dev*' --exclude-glob 'rough-diamond*' --exclude-glob 'plugins' --exclude-glob 'data' --exclude-glob '.~lock*' --exclude-glob '*.tmp' --exclude-glob '.DS_Store' --exclude-glob 'Thumbs.db' --exclude-glob '.deploy-watcher.log' --exclude-glob 'deploy*.sh' --exclude-glob 'watch-and-deploy.sh' '$LOCAL_PATH' .
bye
" 2>&1; then
        print_success "FTP deployment completed successfully"
        print_success "Website LIVE at: https://old-dog-systems.co.za"
        return 0
    else
        print_error "FTP deployment failed"
        return 1
    fi
}

# Deploy to Render (BACKUP - Optional)
deploy_render() {
    print_header "Deploying to Render.com (BACKUP for testing only)"
    
    # Check if GitHub token exists
    if [ ! -f "$LOCAL_PATH/.github-token" ]; then
        print_warning "GitHub token not found (.github-token file missing)"
        print_warning "Skipping Render deployment"
        return 0
    fi
    
    local token=$(cat "$LOCAL_PATH/.github-token")
    
    # Git operations
    cd "$LOCAL_PATH"
    
    if [ -z "$(git status --short)" ]; then
        print_warning "No changes to commit"
    else
        print_warning "Committing changes..."
        git add .
        git commit -m "Auto-deployment: $(date '+%Y-%m-%d %H:%M:%S')"
        
        print_warning "Pushing to GitHub..."
        if git push https://x-access-token:${token}@github.com/ODS-WebRender/renderweb.git main 2>/dev/null; then
            print_success "Pushed to GitHub"
        else
            print_warning "Git push failed or no changes to push"
        fi
    fi
    
    # Trigger Render webhook
    print_warning "Triggering Render deployment..."
    if curl -s -X POST "$RENDER_WEBHOOK" > /dev/null 2>&1; then
        print_success "Render deployment triggered"
        print_warning "Render will deploy in 2-3 minutes"
        print_success "Check live at: https://old-dog-systems1.onrender.com/"
    else
        print_error "Failed to trigger Render deployment"
        return 1
    fi
}

# Show status
show_status() {
    print_header "Deployment Status"
    echo -e "${GREEN}LIVE SITE:${NC}  https://old-dog-systems.co.za (FTP)"
    echo -e "${YELLOW}BACKUP:${NC}     https://old-dog-systems1.onrender.com (Render - Testing)"
    echo ""
}

##############################################################################
# Main
##############################################################################

main() {
    print_header "Old Dog Systems - Automatic Deployment"
    
    # Parse arguments
    local deploy_ftp_only=false
    local deploy_render_only=false
    
    for arg in "$@"; do
        case $arg in
            --ftp-only)
                deploy_ftp_only=true
                shift
                ;;
            --render-only)
                deploy_render_only=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
        esac
    done
    
    # Check dependencies
    check_dependencies
    
    # Deploy
    if [ "$deploy_render_only" = true ]; then
        deploy_render
    elif [ "$deploy_ftp_only" = true ]; then
        deploy_ftp
    else
        # Default: FTP ONLY (the live site)
        deploy_ftp
    fi
    
    # Show status
    show_status
    print_success "Deployment process complete!"
}

show_help() {
    cat <<EOF
${BLUE}Old Dog Systems - Deployment Script${NC}

${GREEN}Usage:${NC}
    ./deploy.sh [OPTIONS]

${GREEN}Default Behavior:${NC}
    Deploys to FTP (old-dog-systems.co.za) - Your LIVE site

${GREEN}Options:${NC}
    --ftp-only              Deploy ONLY to FTP (default, LIVE site)
    --render-only           Deploy ONLY to Render (backup/testing - use rarely)
    --help, -h              Show this help message

${GREEN}Examples:${NC}
    ./deploy.sh                 # Deploy to FTP (LIVE)
    ./deploy.sh --ftp-only      # Same as above - FTP deployment
    ./deploy.sh --render-only   # Deploy to Render backup (testing only)

${GREEN}Deployment Targets:${NC}
    LIVE (FTP):  https://old-dog-systems.co.za
    BACKUP (Render): https://old-dog-systems1.onrender.com (testing/backup)

EOF
}

# Run main function
main "$@"
