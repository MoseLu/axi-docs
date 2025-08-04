#!/bin/bash

echo "🔧 使用正确路径的修复脚本"
echo "================================"

# 1. 修复 Nginx 配置错误
echo "1. 修复 Nginx 配置错误..."
if [ -f "/www/server/panel/vhost/nginx/go_starCloudLinux.conf" ]; then
    echo "备份原始配置文件..."
    cp /www/server/panel/vhost/nginx/go_starCloudLinux.conf /www/server/panel/vhost/nginx/go_starCloudLinux.conf.backup
    
    echo "修复重复的 http2 指令..."
    sed -i '/http2/d' /www/server/panel/vhost/nginx/go_starCloudLinux.conf
fi

# 2. 创建正确的 Nginx 配置文件（匹配 VitePress base: '/docs/'）
echo "2. 创建正确的 Nginx 配置文件..."
cat > /www/server/nginx/conf/vhost/redamancy.com.cn.conf << 'EOF'
server {
    listen 80;
    listen 443 ssl http2;
    server_name redamancy.com.cn;
    
    # 主站点配置
    location / {
        root /www/wwwroot/redamancy.com.cn;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Axi-Docs 配置 - 匹配 VitePress base: '/docs/'
    location /docs/ {
        alias /www/wwwroot/redamancy.com.cn/docs/dist/;
        index index.html;
        try_files $uri $uri/ /docs/index.html;
        
        # 设置正确的 MIME 类型
        location ~* \.js$ {
            add_header Content-Type application/javascript;
        }
        
        location ~* \.css$ {
            add_header Content-Type text/css;
        }
        
        location ~* \.html$ {
            add_header Content-Type text/html;
        }
        
        # 静态资源缓存
        location ~* \.(png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 处理不带斜杠的 /docs 重定向到 /docs/
    location = /docs {
        return 301 /docs/;
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 3. 检查文件结构
echo "3. 检查文件结构..."
if [ -d "/www/wwwroot/redamancy.com.cn/docs/dist" ]; then
    echo "✅ dist 目录存在"
    ls -la /www/wwwroot/redamancy.com.cn/docs/dist/ | head -5
else
    echo "❌ dist 目录不存在"
    exit 1
fi

# 4. 设置文件权限
echo "4. 设置文件权限..."
# 检查系统用户
if id "nginx" &>/dev/null; then
    NGINX_USER="nginx"
elif id "www-data" &>/dev/null; then
    NGINX_USER="www-data"
else
    NGINX_USER="root"
fi

echo "使用用户: $NGINX_USER"
chown -R $NGINX_USER:$NGINX_USER /www/wwwroot/redamancy.com.cn/docs/
chmod -R 755 /www/wwwroot/redamancy.com.cn/docs/

# 5. 检查 Nginx 配置
echo "5. 检查 Nginx 配置..."
nginx -t

# 6. 重启 Nginx
echo "6. 重启 Nginx..."
systemctl restart nginx

# 7. 检查 Nginx 状态
echo "7. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

# 8. 测试访问
echo "8. 测试访问..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 /docs (不带斜杠，应该重定向):"
curl -I http://localhost/docs 2>/dev/null

echo ""
echo "✅ 修复完成！"
echo "现在可以访问: https://redamancy.com.cn/docs/"
echo ""
echo "关键配置："
echo "- VitePress base: '/docs/'"
echo "- Nginx location: '/docs/'"
echo "- 文件路径: /www/wwwroot/redamancy.com.cn/docs/dist/" 