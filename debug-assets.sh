#!/bin/bash

echo "🔍 资源加载诊断脚本"
echo "================================"

# 1. 检查文件结构
echo "1. 检查文件结构..."
echo "dist 目录内容："
ls -la /www/wwwroot/redamancy.com.cn/docs/dist/

echo ""
echo "assets 目录内容："
ls -la /www/wwwroot/redamancy.com.cn/docs/dist/assets/

# 2. 检查 index.html 内容
echo ""
echo "2. 检查 index.html 内容..."
echo "index.html 前 20 行："
head -20 /www/wwwroot/redamancy.com.cn/docs/dist/index.html

# 3. 检查资源路径
echo ""
echo "3. 检查资源路径..."
echo "查找 index.html 中的资源引用："
grep -o 'src="[^"]*"' /www/wwwroot/redamancy.com.cn/docs/dist/index.html | head -5
grep -o 'href="[^"]*"' /www/wwwroot/redamancy.com.cn/docs/dist/index.html | head -5

# 4. 测试不同的访问路径
echo ""
echo "4. 测试不同的访问路径..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 /docs/index.html:"
curl -I http://localhost/docs/index.html 2>/dev/null

echo ""
echo "测试 /docs/dist/index.html:"
curl -I http://localhost/docs/dist/index.html 2>/dev/null

# 5. 检查 Nginx 配置中的路径
echo ""
echo "5. 检查 Nginx 配置..."
if [ -f "/www/server/panel/vhost/nginx/redamancy.com.cn.conf" ]; then
    echo "当前配置文件："
    cat /www/server/panel/vhost/nginx/redamancy.com.cn.conf
else
    echo "❌ 配置文件不存在"
fi

# 6. 测试文件直接访问
echo ""
echo "6. 测试文件直接访问..."
echo "测试 index.html 内容："
curl -s http://localhost/docs/index.html | head -10

# 7. 检查 Nginx 错误日志
echo ""
echo "7. 检查 Nginx 错误日志..."
if [ -f "/www/server/nginx/logs/error.log" ]; then
    echo "最近的错误日志："
    tail -5 /www/server/nginx/logs/error.log
else
    echo "❌ 错误日志文件不存在"
fi

# 8. 检查访问日志
echo ""
echo "8. 检查访问日志..."
if [ -f "/www/server/nginx/logs/access.log" ]; then
    echo "最近的访问日志："
    tail -5 /www/server/nginx/logs/access.log
else
    echo "❌ 访问日志文件不存在"
fi

echo ""
echo "🔧 可能的解决方案："
echo "1. 检查 alias 路径是否正确"
echo "2. 检查 try_files 指令是否正确"
echo "3. 检查文件权限"
echo "4. 检查资源路径映射" 