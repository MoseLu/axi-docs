#!/bin/bash
REPO_DIR="/www/wwwroot/axi-star-cloud"
SYNC_SCRIPT="/www/wwwroot/axi-docs/ci-sync.sh"
LOG_FILE="/www/wwwroot/axi-docs/logs/git-sync.log"

log() { echo "[$(date '+%F %T')] $1" | tee -a "$LOG_FILE"; }

check_md_changes() {
    while read -r oldrev newrev refname; do
        git diff --name-only "$oldrev" "$newrev" | grep -q '^uploads/md/' && return 0
    done
    return 1
}

main() {
    log "Git 钩子触发，检查变化..."
    check_md_changes && bash "$SYNC_SCRIPT" || log "无变化，跳过"
}

main "$@"
