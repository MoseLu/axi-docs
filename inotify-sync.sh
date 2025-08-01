#!/bin/bash
SRC="/www/wwwroot/axi-star-cloud/uploads/md"
LOG="/www/wwwroot/axi-docs/logs/inotify.log"
LOCK="/tmp/vitepress-build.lock"

log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }

build() {
  [[ -f $LOCK ]] && { log "构建进行中，跳过"; return; }
  touch "$LOCK"
  log "开始构建..."
  cd /www/wwwroot/axi-docs
  /www/server/nodejs/v22.13.1/bin/pnpm docs:build 2>&1 | tee -a "$LOG"
  log "构建完成"
  rm -f "$LOCK"
}

exec inotifywait -mrq -e close_write --format '%w%f' "$SRC" |
while IFS= read -r FILE; do
  [[ "$FILE" =~ \.md$ ]] || continue
  log "CLOSE_WRITE -> $FILE"
  build
done
