#!/bin/bash

echo "🔧 修复 AXI Docs 部署问题..."

# 检查当前状态
echo "📋 检查当前部署状态..."

# 检查部署目录
if [ -d "/srv/static/axi-docs" ]; then
    echo "✅ 部署目录存在: /srv/static/axi-docs"
    ls -la /srv/static/axi-docs/
else
    echo "❌ 部署目录不存在: /srv/static/axi-docs"
    echo "请先运行部署流程"
    exit 1
fi

# 检查nginx配置目录
NGINX_CONF_DIR="/www/server/nginx/conf/conf.d/redamancy"
if [ -d "$NGINX_CONF_DIR" ]; then
    echo "✅ Nginx配置目录存在: $NGINX_CONF_DIR"
else
    echo "❌ Nginx配置目录不存在: $NGINX_CONF_DIR"
    exit 1
fi

# 检查主配置文件
MAIN_CONF="$NGINX_CONF_DIR/00-main.conf"
if [ -f "$MAIN_CONF" ]; then
    echo "✅ 主配置文件存在: $MAIN_CONF"
    echo "📋 主配置文件内容:"
    cat "$MAIN_CONF"
else
    echo "❌ 主配置文件不存在: $MAIN_CONF"
    exit 1
fi

# 检查现有的route-axi-docs.conf
ROUTE_CONF="$NGINX_CONF_DIR/route-axi-docs.conf"
if [ -f "$ROUTE_CONF" ]; then
    echo "📋 现有的route-axi-docs.conf内容:"
    cat "$ROUTE_CONF"
    
    # 备份现有配置
    BACKUP_FILE="$ROUTE_CONF.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$ROUTE_CONF" "$BACKUP_FILE"
    echo "✅ 已备份现有配置到: $BACKUP_FILE"
else
    echo "📋 route-axi-docs.conf不存在，将创建新文件"
fi

# 创建正确的route-axi-docs.conf
echo "🔧 创建route-axi-docs.conf..."

cat > "$ROUTE_CONF" << 'EOF'
    # AXI Docs 文档站点配置
    location /docs/ {
        alias /srv/static/axi-docs/;
        index index.html;
        try_files $uri $uri/ /docs/index.html;
        
        # 确保不缓存HTML文件
        location ~* \.html$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # 安全头
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options DENY;
        add_header X-XSS-Protection "1; mode=block";
    }
EOF

echo "✅ route-axi-docs.conf已创建"

# 验证配置
echo "📋 验证新配置:"
cat "$ROUTE_CONF"

# 测试nginx配置语法
echo "🔍 测试nginx配置语法..."
if nginx -t > /dev/null 2>&1; then
    echo "✅ nginx配置语法正确"
else
    echo "❌ nginx配置语法错误"
    nginx -t
    exit 1
fi

# 重载nginx
echo "🔄 重载nginx配置..."
if sudo systemctl reload nginx; then
    echo "✅ nginx重载成功"
else
    echo "❌ nginx重载失败"
    sudo systemctl status nginx --no-pager -l
    exit 1
fi

# 等待nginx重载完成
sleep 3

# 测试访问
echo "📋 测试本地访问..."
if curl -f -s http://localhost/docs/ > /dev/null 2>&1; then
    echo "✅ 本地访问成功"
else
    echo "❌ 本地访问失败"
    curl -I http://localhost/docs/ 2>/dev/null || echo "curl命令失败"
fi

echo "📋 测试远程访问..."
if curl -f -s https://redamancy.com.cn/docs/ > /dev/null 2>&1; then
    echo "✅ 远程访问成功"
else
    echo "❌ 远程访问失败"
    curl -I https://redamancy.com.cn/docs/ 2>/dev/null || echo "curl命令失败"
fi

# 检查nginx日志
echo "📋 检查nginx错误日志:"
tail -n 5 /www/server/nginx/logs/error.log

echo "📋 检查nginx访问日志:"
tail -n 5 /www/server/nginx/logs/access.log

echo "✅ 部署修复完成！"

# 提供后续建议
echo ""
echo "🔧 后续建议:"
echo "1. 检查GitHub Actions执行日志，确保部署流程正常"
echo "2. 如果问题持续存在，可能需要检查axi-deploy的配置"
echo "3. 确保服务器上的文件权限正确"
echo "4. 定期运行此脚本验证部署状态" 