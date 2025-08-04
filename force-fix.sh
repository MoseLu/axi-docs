#!/bin/bash

echo "🔧 强制修复脚本"
echo "================================"

# 1. 检查并创建 vhost 目录
echo "1. 检查并创建 vhost 目录..."
if [ ! -d "/www/server/nginx/conf/vhost" ]; then
    echo "创建 vhost 目录..."
    mkdir -p /www/server/nginx/conf/vhost
fi

# 2. 检查主配置文件是否包含 vhost
echo "2. 检查主配置文件..."
if ! grep -q "vhost" /www/server/nginx/conf/nginx.conf; then
    echo "主配置文件中未找到 vhost 配置，需要添加..."
    echo "请在 http 块中添加："
    echo "include /www/server/nginx/conf/vhost/*.conf;"
fi

# 3. 强制创建正确的配置文件
echo "3. 强制创建正确的配置文件..."
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

# 4. 检查主配置文件并添加 vhost 包含
echo "4. 检查主配置文件..."
if ! grep -q "vhost" /www/server/nginx/conf/nginx.conf; then
    echo "备份主配置文件..."
    cp /www/server/nginx/conf/nginx.conf /www/server/nginx/conf/nginx.conf.backup
    
    echo "在主配置文件的 http 块中添加 vhost 包含..."
    # 在 http 块的末尾添加 include 指令
    sed -i '/^}/i \    include /www/server/nginx/conf/vhost/*.conf;' /www/server/nginx/conf/nginx.conf
fi

# 5. 设置文件权限
echo "5. 设置文件权限..."
chown -R root:root /www/wwwroot/redamancy.com.cn/docs/
chmod -R 755 /www/wwwroot/redamancy.com.cn/docs/

# 6. 检查 Nginx 配置
echo "6. 检查 Nginx 配置..."
nginx -t

# 7. 重启 Nginx
echo "7. 重启 Nginx..."
systemctl restart nginx

# 8. 检查 Nginx 状态
echo "8. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

# 9. 等待一下让 Nginx 完全启动
echo "9. 等待 Nginx 完全启动..."
sleep 3

# 10. 测试访问
echo "10. 测试访问..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 /docs (不带斜杠):"
curl -I http://localhost/docs 2>/dev/null

echo ""
echo "测试完整页面内容:"
curl -s http://localhost/docs/ | head -10

echo ""
echo "✅ 强制修复完成！"
echo ""
echo "如果还是 404，请运行诊断脚本："
echo "./debug-404.sh" 