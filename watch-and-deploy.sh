#!/bin/bash

##############################################################################
# File Watcher - Auto-Deploy on File Changes to LIVE Site (FTP only)
# Monitors the project directory and automatically deploys to FTP when files change
# Target: old-dog-systems.co.za (LIVE site)
##############################################################################

set -e

# Configuration
PROJECT_DIR="/mnt/Master_Storage/Project Folders/Old_Dog_Web"
DEPLOY_SCRIPT="$PROJECT_DIR/deploy.sh"
LOG_FILE="$PROJECT_DIR/.deploy-watcher.log"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Debounce timer (seconds) - prevents multiple deploys for rapid changes
DEBOUNCE_SECONDS=5
LAST_DEPLOY_TIME=0

print_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

print_deploy() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] DEPLOYING${NC} $1" | tee -a "$LOG_FILE"
}

# Function to deploy
auto_deploy() {
    local current_time=$(date +%s)
    local time_since_last=$((current_time - LAST_DEPLOY_TIME))
    
    # Check if enough time has passed since last deploy
    if [ $time_since_last -lt $DEBOUNCE_SECONDS ]; then
        print_info "Deploy debounced (wait ${DEBOUNCE_SECONDS}s between deploys)"
        return
    fi
    
    LAST_DEPLOY_TIME=$current_time
    print_deploy "Files changed, starting deployment..."
    
    if cd "$PROJECT_DIR" && "$DEPLOY_SCRIPT" --ftp-only >> "$LOG_FILE" 2>&1; then
        print_info "✓ Deployment successful"
    else
        print_info "✗ Deployment failed - check log"
    fi
}

print_info "Starting file watcher for Old Dog Systems..."
print_info "Monitoring: $PROJECT_DIR"
print_info "Watch files: *.html, *.css, *.js, *.json, images/*"
print_info "Press Ctrl+C to stop"

# Use inotifywait to monitor file changes
if command -v inotifywait &> /dev/null; then
    inotifywait \
        -m \
        --exclude '(\.git|node_modules|\.vscode|\.deploy-watcher\.log)' \
        -e modify,create,delete \
        -r "$PROJECT_DIR" | while read path action file; do
            # Filter for relevant file types
            case "$file" in
                *.html|*.css|*.js|*.json|*.png|*.jpg|*.jpeg|*.gif|*.svg|*.md)
                    print_info "File changed: $file"
                    auto_deploy
                    ;;
            esac
        done
else
    # Fallback: use find with mtime if inotifywait not available
    print_info "inotifywait not found, using polling mode (less efficient)"
    
    while true; do
        # Look for files modified in last 2 seconds
        if find "$PROJECT_DIR" -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" \) -mmin -1 | grep -q .; then
            auto_deploy
            sleep 2  # Cooldown to avoid rapid re-triggers
        fi
        sleep 1
    done
fi
