#!/bin/bash

echo "🔧 修复 Nginx 配置错误"
echo "================================"

# 1. 备份原始配置文件
echo "1. 备份原始配置文件..."
cp /www/server/panel/vhost/nginx/go_starCloudLinux.conf /www/server/panel/vhost/nginx/go_starCloudLinux.conf.backup

# 2. 修复重复的 http2 指令
echo "2. 修复重复的 http2 指令..."
sed -i '/http2/d' /www/server/panel/vhost/nginx/go_starCloudLinux.conf

# 3. 检查修复后的配置
echo "3. 检查修复后的配置..."
nginx -t

# 4. 重启 Nginx
echo "4. 重启 Nginx..."
systemctl restart nginx

# 5. 检查 Nginx 状态
echo "5. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

echo "✅ Nginx 配置修复完成" 