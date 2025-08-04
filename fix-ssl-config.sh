#!/bin/bash

echo "🔧 修复 SSL 配置"
echo "================================"

# 1. 检查 SSL 证书文件
echo "1. 检查 SSL 证书文件..."
echo "查找 SSL 证书文件："
find /www/server -name "*.pem" -o -name "*.crt" -o -name "*.key" 2>/dev/null | grep -i redamancy || echo "未找到 SSL 证书文件"

# 2. 创建不包含 SSL 的配置文件
echo ""
echo "2. 创建不包含 SSL 的配置文件..."
cat > /www/server/panel/vhost/nginx/redamancy.com.cn.conf << 'EOF'
server {
    listen 80;
    server_name redamancy.com.cn;
    
    # 主站点配置
    location / {
        root /www/wwwroot/redamancy.com.cn;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    # Axi-Docs 配置 - 使用 alias
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

# 3. 检查配置文件语法
echo ""
echo "3. 检查配置文件语法..."
nginx -t

# 4. 重启 Nginx
echo ""
echo "4. 重启 Nginx..."
systemctl restart nginx

# 5. 检查 Nginx 状态
echo ""
echo "5. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

# 6. 等待启动
echo ""
echo "6. 等待 Nginx 启动..."
sleep 5

# 7. 测试访问
echo ""
echo "7. 测试访问..."
echo "测试 HTTP 访问 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 HTTP 访问 /docs/index.html:"
curl -I http://localhost/docs/index.html 2>/dev/null

echo ""
echo "测试页面内容:"
curl -s http://localhost/docs/ | head -10

# 8. 如果有 SSL 证书，创建带 SSL 的配置
echo ""
echo "8. 检查是否需要 SSL 配置..."
if [ -f "/www/server/panel/vhost/openlitespeed/detail/ssl/redamancy.com.cn.conf" ]; then
    echo "找到 SSL 配置文件，检查证书路径..."
    SSL_CERT=$(grep "ssl_certificate" /www/server/panel/vhost/openlitespeed/detail/ssl/redamancy.com.cn.conf | awk '{print $2}' | sed 's/;$//')
    SSL_KEY=$(grep "ssl_certificate_key" /www/server/panel/vhost/openlitespeed/detail/ssl/redamancy.com.cn.conf | awk '{print $2}' | sed 's/;$//')
    
    if [ -f "$SSL_CERT" ] && [ -f "$SSL_KEY" ]; then
        echo "找到有效的 SSL 证书，创建带 SSL 的配置..."
        cat > /www/server/panel/vhost/nginx/redamancy.com.cn.conf << EOF
server {
    listen 80;
    listen 443 ssl;
    http2 on;
    server_name redamancy.com.cn;
    
    ssl_certificate $SSL_CERT;
    ssl_certificate_key $SSL_KEY;
    
    # 主站点配置
    location / {
        root /www/wwwroot/redamancy.com.cn;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Axi-Docs 配置 - 使用 alias
    location /docs/ {
        alias /www/wwwroot/redamancy.com.cn/docs/dist/;
        index index.html;
        try_files \$uri \$uri/ /docs/index.html;
        
        # 设置正确的 MIME 类型
        location ~* \\.js\$ {
            add_header Content-Type application/javascript;
        }
        
        location ~* \\.css\$ {
            add_header Content-Type text/css;
        }
        
        location ~* \\.html\$ {
            add_header Content-Type text/html;
        }
        
        # 静态资源缓存
        location ~* \\.(png|jpg|jpeg|gif|ico|svg)\$ {
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
        
        echo "重新检查配置..."
        nginx -t
        
        echo "重启 Nginx..."
        systemctl restart nginx
        
        echo "测试 HTTPS 访问..."
        curl -I https://localhost/docs/ 2>/dev/null || echo "HTTPS 访问失败，请检查证书"
    else
        echo "SSL 证书文件不存在，使用 HTTP 配置"
    fi
else
    echo "未找到 SSL 配置文件，使用 HTTP 配置"
fi

echo ""
echo "✅ SSL 配置修复完成！"
echo ""
echo "现在可以访问:"
echo "- HTTP: http://redamancy.com.cn/docs/"
echo "- HTTPS: https://redamancy.com.cn/docs/ (如果证书配置正确)" 