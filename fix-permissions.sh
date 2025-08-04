#!/bin/bash

echo "🔧 修复文件权限"
echo "================================"

# 1. 检查 Nginx 进程用户
echo "1. 检查 Nginx 进程用户..."
NGINX_USER=$(ps aux | grep nginx | grep -v grep | head -1 | awk '{print $1}')
echo "Nginx 进程用户: $NGINX_USER"

# 2. 检查系统用户
echo "2. 检查系统用户..."
if id "nginx" &>/dev/null; then
    echo "✅ nginx 用户存在"
    NGINX_USER="nginx"
elif id "www-data" &>/dev/null; then
    echo "✅ www-data 用户存在"
    NGINX_USER="www-data"
else
    echo "⚠️  未找到标准用户，使用 root"
    NGINX_USER="root"
fi

# 3. 设置文件权限
echo "3. 设置文件权限..."
echo "使用用户: $NGINX_USER"

# 设置目录权限
chown -R $NGINX_USER:$NGINX_USER /www/wwwroot/redamancy.com.cn/docs/
chmod -R 755 /www/wwwroot/redamancy.com.cn/docs/

# 4. 检查权限设置结果
echo "4. 检查权限设置结果..."
ls -la /www/wwwroot/redamancy.com.cn/docs/dist/

# 5. 测试文件访问
echo "5. 测试文件访问..."
if [ -r "/www/wwwroot/redamancy.com.cn/docs/dist/index.html" ]; then
    echo "✅ index.html 可读"
else
    echo "❌ index.html 不可读"
fi

echo "✅ 权限修复完成" 