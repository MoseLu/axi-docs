#!/bin/bash

echo "🔍 路径测试脚本"
echo "================================"

# 1. 检查文件是否存在
echo "1. 检查文件是否存在..."
if [ -f "/www/wwwroot/redamancy.com.cn/docs/dist/index.html" ]; then
    echo "✅ index.html 存在"
    ls -la /www/wwwroot/redamancy.com.cn/docs/dist/index.html
else
    echo "❌ index.html 不存在"
fi

# 2. 检查目录结构
echo ""
echo "2. 检查目录结构..."
echo "docs 目录内容："
ls -la /www/wwwroot/redamancy.com.cn/docs/
echo ""
echo "dist 目录内容："
ls -la /www/wwwroot/redamancy.com.cn/docs/dist/ | head -10

# 3. 测试不同的 Nginx 配置
echo ""
echo "3. 测试不同的 Nginx 配置..."

# 配置 A: /docs/ (带斜杠)
echo "配置 A: location /docs/ {"
echo "  alias /www/wwwroot/redamancy.com.cn/docs/dist/;"
echo "  try_files \$uri \$uri/ /docs/index.html;"
echo "}"

# 配置 B: /docs (不带斜杠)
echo ""
echo "配置 B: location /docs {"
echo "  alias /www/wwwroot/redamancy.com.cn/docs/dist;"
echo "  try_files \$uri \$uri/ /docs/index.html;"
echo "}"

# 4. 测试本地访问
echo ""
echo "4. 测试本地访问..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null || echo "404 - /docs/ 失败"

echo ""
echo "测试 /docs (不带斜杠):"
curl -I http://localhost/docs 2>/dev/null || echo "404 - /docs 失败"

# 5. 检查 Nginx 配置
echo ""
echo "5. 当前 Nginx 配置:"
if [ -f "/www/server/nginx/conf/vhost/redamancy.com.cn.conf" ]; then
    cat /www/server/nginx/conf/vhost/redamancy.com.cn.conf
else
    echo "❌ Nginx 配置文件不存在"
fi

echo ""
echo "🔧 建议的修复方案："
echo "1. 如果 VitePress base 是 '/docs/'，Nginx 应该用 '/docs/'"
echo "2. 如果 VitePress base 是 '/docs'，Nginx 应该用 '/docs'"
echo "3. 确保 try_files 指令正确" 