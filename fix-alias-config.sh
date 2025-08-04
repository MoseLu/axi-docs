#!/bin/bash

echo "🔧 修复 alias 配置脚本"
echo "================================"

# 1. 备份当前配置
echo "1. 备份当前配置..."
if [ -f "/www/server/panel/vhost/nginx/redamancy.com.cn.conf" ]; then
    cp /www/server/panel/vhost/nginx/redamancy.com.cn.conf /www/server/panel/vhost/nginx/redamancy.com.cn.conf.backup
fi

# 2. 创建新的配置文件（使用 root 而不是 alias）
echo "2. 创建新的配置文件（使用 root 配置）..."
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
    
    # Axi-Docs 配置 - 使用 root 而不是 alias
    location /docs/ {
        root /www/wwwroot/redamancy.com.cn/docs/dist;
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

# 3. 检查配置
echo "3. 检查配置..."
nginx -t

# 4. 重启 Nginx
echo "4. 重启 Nginx..."
systemctl restart nginx

# 5. 等待启动
echo "5. 等待 Nginx 启动..."
sleep 3

# 6. 测试访问
echo "6. 测试访问..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 /docs/index.html:"
curl -I http://localhost/docs/index.html 2>/dev/null

echo ""
echo "测试页面内容:"
curl -s http://localhost/docs/ | head -10

echo ""
echo "✅ 使用 root 配置完成！"
echo ""
echo "如果还是不行，尝试 alias 配置..."

# 7. 如果 root 不行，尝试 alias 配置
echo "7. 尝试 alias 配置..."
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

# 8. 重启并测试
echo "8. 重启并测试 alias 配置..."
nginx -t
systemctl restart nginx
sleep 3

echo "测试 alias 配置:"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "✅ 两种配置都测试完成！" 