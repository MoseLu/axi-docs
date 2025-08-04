#!/bin/bash

echo "🔍 详细 404 诊断脚本"
echo "================================"

# 1. 检查文件是否存在
echo "1. 检查文件是否存在..."
if [ -f "/www/wwwroot/redamancy.com.cn/docs/dist/index.html" ]; then
    echo "✅ index.html 存在"
    ls -la /www/wwwroot/redamancy.com.cn/docs/dist/index.html
else
    echo "❌ index.html 不存在"
    echo "检查 dist 目录内容："
    ls -la /www/wwwroot/redamancy.com.cn/docs/dist/
fi

# 2. 检查 Nginx 配置文件
echo ""
echo "2. 检查 Nginx 配置文件..."
if [ -f "/www/server/nginx/conf/vhost/redamancy.com.cn.conf" ]; then
    echo "✅ Nginx 配置文件存在"
    echo "配置文件内容："
    cat /www/server/nginx/conf/vhost/redamancy.com.cn.conf
else
    echo "❌ Nginx 配置文件不存在"
fi

# 3. 检查 Nginx 是否加载了配置文件
echo ""
echo "3. 检查 Nginx 主配置..."
if [ -f "/www/server/nginx/conf/nginx.conf" ]; then
    echo "检查主配置是否包含 vhost 目录："
    grep -n "vhost" /www/server/nginx/conf/nginx.conf || echo "未找到 vhost 配置"
fi

# 4. 检查 Nginx 进程
echo ""
echo "4. 检查 Nginx 进程..."
ps aux | grep nginx | grep -v grep

# 5. 检查 Nginx 错误日志
echo ""
echo "5. 检查 Nginx 错误日志..."
if [ -f "/www/server/nginx/logs/error.log" ]; then
    echo "最近的错误日志："
    tail -10 /www/server/nginx/logs/error.log
else
    echo "❌ 错误日志文件不存在"
fi

# 6. 检查访问日志
echo ""
echo "6. 检查访问日志..."
if [ -f "/www/server/nginx/logs/access.log" ]; then
    echo "最近的访问日志："
    tail -5 /www/server/nginx/logs/access.log
else
    echo "❌ 访问日志文件不存在"
fi

# 7. 测试文件权限
echo ""
echo "7. 测试文件权限..."
echo "测试 Nginx 进程用户："
NGINX_USER=$(ps aux | grep nginx | grep -v grep | head -1 | awk '{print $1}')
echo "Nginx 用户: $NGINX_USER"

echo "测试文件可读性："
if [ -r "/www/wwwroot/redamancy.com.cn/docs/dist/index.html" ]; then
    echo "✅ index.html 可读"
else
    echo "❌ index.html 不可读"
fi

# 8. 测试不同的访问方式
echo ""
echo "8. 测试不同的访问方式..."
echo "测试直接文件访问："
curl -I file:///www/wwwroot/redamancy.com.cn/docs/dist/index.html 2>/dev/null || echo "无法直接访问文件"

echo ""
echo "测试本地 HTTP 访问："
curl -I http://localhost/docs/ 2>/dev/null || echo "本地访问失败"

echo ""
echo "测试本地 HTTP 访问（不带斜杠）："
curl -I http://localhost/docs 2>/dev/null || echo "本地访问失败"

# 9. 检查 Nginx 配置语法
echo ""
echo "9. 检查 Nginx 配置语法..."
nginx -t

# 10. 检查是否有其他配置文件冲突
echo ""
echo "10. 检查其他配置文件..."
echo "查找所有包含 redamancy.com.cn 的配置文件："
find /www/server/nginx/conf -name "*.conf" -exec grep -l "redamancy.com.cn" {} \; 2>/dev/null

echo ""
echo "🔧 可能的解决方案："
echo "1. 如果配置文件不存在，需要创建"
echo "2. 如果主配置未包含 vhost，需要添加"
echo "3. 如果文件权限有问题，需要修复"
echo "4. 如果有配置文件冲突，需要解决" 