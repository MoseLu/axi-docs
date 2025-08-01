#!/bin/bash
SOURCE_DIR="/www/wwwroot/axi-star-cloud/uploads/md"
TRIGGER_FILE="/www/wwwroot/axi-star-cloud/uploads/md/.sync_trigger"
SYNC_SCRIPT="/www/wwwroot/axi-docs/ci-sync.sh"

echo "$(date +%s)" > "$TRIGGER_FILE"
echo "触发器已创建，时间戳: $(cat "$TRIGGER_FILE")"
[[ "$1" == "--now" ]] && bash "$SYNC_SCRIPT"
