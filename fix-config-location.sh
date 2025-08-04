#!/bin/bash

echo "🔧 修复配置文件位置"
echo "================================"

# 1. 检查正确的配置文件位置
echo "1. 检查正确的配置文件位置..."
echo "主配置文件包含的路径："
grep -n "include.*\.conf" /www/server/nginx/conf/nginx.conf

# 2. 创建正确的配置文件位置
echo ""
echo "2. 创建正确的配置文件位置..."
if [ ! -d "/www/server/panel/vhost/nginx" ]; then
    echo "创建目录..."
    mkdir -p /www/server/panel/vhost/nginx
fi

# 3. 复制配置文件到正确位置
echo "3. 复制配置文件到正确位置..."
cat > /www/server/panel/vhost/nginx/redamancy.com.cn.conf << 'EOF'
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

# 4. 检查配置文件是否创建成功
echo "4. 检查配置文件是否创建成功..."
if [ -f "/www/server/panel/vhost/nginx/redamancy.com.cn.conf" ]; then
    echo "✅ 配置文件创建成功"
    ls -la /www/server/panel/vhost/nginx/redamancy.com.cn.conf
else
    echo "❌ 配置文件创建失败"
    exit 1
fi

# 5. 检查 Nginx 配置
echo "5. 检查 Nginx 配置..."
nginx -t

# 6. 重启 Nginx
echo "6. 重启 Nginx..."
systemctl restart nginx

# 7. 检查 Nginx 状态
echo "7. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

# 8. 等待 Nginx 启动
echo "8. 等待 Nginx 启动..."
sleep 3

# 9. 测试访问
echo "9. 测试访问..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 /docs (不带斜杠):"
curl -I http://localhost/docs 2>/dev/null

echo ""
echo "测试完整页面内容:"
curl -s http://localhost/docs/ | head -10

echo ""
echo "✅ 配置文件位置修复完成！"
echo ""
echo "关键修复："
echo "- 将配置文件放到 /www/server/panel/vhost/nginx/redamancy.com.cn.conf"
echo "- 这个路径被主配置文件包含"
echo "- 现在应该可以正常访问了" 