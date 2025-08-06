#!/bin/bash

echo "🔍 验证 AXI Docs 部署状态..."

# 检查部署目录
echo "📋 检查部署目录:"
if [ -d "/srv/static/axi-docs" ]; then
    echo "✅ 部署目录存在"
    ls -la /srv/static/axi-docs/
    
    # 检查关键文件
    if [ -f "/srv/static/axi-docs/index.html" ]; then
        echo "✅ index.html 存在"
    else
        echo "❌ index.html 不存在"
    fi
else
    echo "❌ 部署目录不存在"
fi

# 检查nginx配置
echo "📋 检查nginx配置:"
if [ -f "/www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf" ]; then
    echo "✅ route-axi-docs.conf 存在"
    cat /www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf
else
    echo "❌ route-axi-docs.conf 不存在"
fi

# 测试nginx配置语法
echo "📋 测试nginx配置语法:"
if nginx -t > /dev/null 2>&1; then
    echo "✅ nginx配置语法正确"
else
    echo "❌ nginx配置语法错误"
    nginx -t
fi

# 重载nginx
echo "🔄 重载nginx配置:"
sudo systemctl reload nginx

# 等待nginx重载完成
sleep 2

# 测试本地访问
echo "📋 测试本地访问:"
if curl -f -s http://localhost/docs/ > /dev/null 2>&1; then
    echo "✅ 本地访问成功"
else
    echo "❌ 本地访问失败"
    curl -I http://localhost/docs/ 2>/dev/null || echo "curl命令失败"
fi

# 测试远程访问
echo "📋 测试远程访问:"
if curl -f -s https://redamancy.com.cn/docs/ > /dev/null 2>&1; then
    echo "✅ 远程访问成功"
else
    echo "❌ 远程访问失败"
    curl -I https://redamancy.com.cn/docs/ 2>/dev/null || echo "curl命令失败"
fi

# 检查重定向
echo "📋 检查重定向状态:"
REDIRECT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://redamancy.com.cn/docs/)
echo "HTTP状态码: $REDIRECT_STATUS"

if [ "$REDIRECT_STATUS" = "200" ]; then
    echo "✅ 访问正常，无重定向"
elif [ "$REDIRECT_STATUS" = "301" ] || [ "$REDIRECT_STATUS" = "302" ]; then
    echo "❌ 存在重定向问题"
    curl -I https://redamancy.com.cn/docs/ 2>/dev/null
else
    echo "⚠️ 未知状态码: $REDIRECT_STATUS"
fi

# 检查nginx日志
echo "📋 检查nginx错误日志:"
tail -n 5 /www/server/nginx/logs/error.log

echo "📋 检查nginx访问日志:"
tail -n 5 /www/server/nginx/logs/access.log

echo "✅ 部署验证完成"

# 如果存在问题，提供修复建议
if [ ! -f "/www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf" ]; then
    echo "🔧 建议手动创建route-axi-docs.conf:"
    echo "sudo tee /www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf <<'EOF'"
    echo "location /docs/ {"
    echo "    alias /srv/static/axi-docs/;"
    echo "    index index.html;"
    echo "    try_files \$uri \$uri/ /docs/index.html;"
    echo "}"
    echo "EOF"
fi
