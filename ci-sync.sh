#!/bin/bash
# CI/CD 自动同步
SOURCE_DIR="/www/wwwroot/axi-star-cloud/uploads/md"
TARGET_DIR="/www/wwwroot/axi-docs/docs/content"
LOG_FILE="/www/wwwroot/axi-docs/logs/ci-sync.log"
TRIGGER_FILE="/www/wwwroot/axi-star-cloud/uploads/md/.sync_trigger"
PNPM_PATH="/www/server/nodejs/v22.13.1/bin/pnpm"

log() { echo "[$(date '+%F %T')] $1" | tee -a "$LOG_FILE"; }

[[ ! -d $SOURCE_DIR || ! -d $TARGET_DIR ]] && { log "目录不存在"; exit 1; }

check_sync_needed() {
    [[ -f $TRIGGER_FILE ]] && return 0
    local latest
    latest=$(find "$SOURCE_DIR" -name '*.md' -newer "$TARGET_DIR" 2>/dev/null | head -n1)
    [[ -n $latest ]] && return 0
    return 1
}

perform_sync() {
    log "开始同步..."
    local backup_dir="/www/wwwroot/axi-docs/backup/$(date '+%Y%m%d_%H%M%S')"
    mkdir -p "$backup_dir"

    # 备份同名文件
    find "$TARGET_DIR" -name '*.md' -print0 | while IFS= read -r -d '' file; do
        local fname
        fname=$(basename "$file")
        [[ -f "$SOURCE_DIR/$fname" ]] && cp "$file" "$backup_dir/"
    done

    # rsync 同步
    rsync -av --delete --include='*.md' --exclude='*' "$SOURCE_DIR/" "$TARGET_DIR/"

    # 恢复非同步文件
    if [[ -d $backup_dir ]]; then
        for file in "$backup_dir"/*.md; do
            [[ ! -f $file ]] && continue
            fname=$(basename "$file")
            [[ ! -f "$SOURCE_DIR/$fname" ]] && cp "$file" "$TARGET_DIR/"
        done
    fi

    # 清理旧备份（保留最近 5 个）
    find /www/wwwroot/axi-docs/backup -maxdepth 1 -type d -name '20*' | sort | head -n -5 | xargs rm -rf 2>/dev/null

    # 重新构建文档
    if [[ -f /www/wwwroot/axi-docs/package.json ]]; then
        log "重新构建文档..."
        cd /www/wwwroot/axi-docs
        [[ ! -f $PNPM_PATH ]] && { log "pnpm 未找到: $PNPM_PATH"; return 1; }
        "$PNPM_PATH" install --frozen-lockfile 2>&1 | tee -a "$LOG_FILE"
        "$PNPM_PATH" docs:build 2>&1 | tee -a "$LOG_FILE"
        [[ $? -eq 0 ]] && log "文档构建成功" || log "文档构建失败"
    fi

    rm -f "$TRIGGER_FILE"
    log "同步完成"
}

main() {
    check_sync_needed && perform_sync || log "无变化，跳过"
}

main "$@"
