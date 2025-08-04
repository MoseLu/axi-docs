#!/bin/bash

echo "🔍 Axi-Docs 服务器诊断脚本"
echo "================================"

# 1. 检查部署目录
echo "1. 检查部署目录..."
if [ -d "/www/wwwroot/redamancy.com.cn/docs" ]; then
    echo "✅ 部署目录存在"
    ls -la /www/wwwroot/redamancy.com.cn/docs/
else
    echo "❌ 部署目录不存在"
    exit 1
fi

# 2. 检查 index.html
echo ""
echo "2. 检查 index.html..."
if [ -f "/www/wwwroot/redamancy.com.cn/docs/index.html" ]; then
    echo "✅ index.html 存在"
    ls -la /www/wwwroot/redamancy.com.cn/docs/index.html
else
    echo "❌ index.html 不存在"
fi

# 3. 检查文件权限
echo ""
echo "3. 检查文件权限..."
ls -la /www/wwwroot/redamancy.com.cn/docs/ | head -5

# 4. 检查 Nginx 配置
echo ""
echo "4. 检查 Nginx 配置..."
if [ -f "/www/server/nginx/conf/vhost/redamancy.com.cn.conf" ]; then
    echo "✅ Nginx 配置文件存在"
    echo "配置文件内容："
    cat /www/server/nginx/conf/vhost/redamancy.com.cn.conf
else
    echo "❌ Nginx 配置文件不存在"
fi

# 5. 检查 Nginx 语法
echo ""
echo "5. 检查 Nginx 语法..."
nginx -t

# 6. 检查 Nginx 状态
echo ""
echo "6. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

# 7. 检查错误日志
echo ""
echo "7. 检查最近的错误日志..."
if [ -f "/www/server/nginx/logs/error.log" ]; then
    echo "最近的错误日志："
    tail -10 /www/server/nginx/logs/error.log
else
    echo "❌ 错误日志文件不存在"
fi

# 8. 检查访问日志
echo ""
echo "8. 检查最近的访问日志..."
if [ -f "/www/server/nginx/logs/access.log" ]; then
    echo "最近的访问日志："
    tail -5 /www/server/nginx/logs/access.log
else
    echo "❌ 访问日志文件不存在"
fi

echo ""
echo "🔧 修复建议："
echo "1. 如果文件权限有问题，运行："
echo "   chown -R www-data:www-data /www/wwwroot/redamancy.com.cn/docs/"
echo "   chmod -R 755 /www/wwwroot/redamancy.com.cn/docs/"
echo ""
echo "2. 如果 Nginx 配置有问题，重启 Nginx："
echo "   systemctl restart nginx"
echo ""
echo "3. 如果配置文件不存在，需要创建正确的 Nginx 配置" 