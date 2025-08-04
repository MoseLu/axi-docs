#!/bin/bash

echo "🔧 彻底修复所有配置文件冲突"
echo "================================"

# 1. 显示所有冲突的配置文件
echo "1. 显示所有冲突的配置文件..."
echo "包含 server_name redamancy.com.cn 的配置文件："
find /www/server -name "*.conf" -exec grep -l "server_name redamancy.com.cn" {} \; 2>/dev/null

# 2. 备份并删除冲突的配置文件
echo ""
echo "2. 备份并删除冲突的配置文件..."
for file in $(find /www/server -name "*.conf" -exec grep -l "server_name redamancy.com.cn" {} \; 2>/dev/null); do
    if [ "$file" != "/www/server/panel/vhost/nginx/redamancy.com.cn.conf" ]; then
        echo "备份并删除: $file"
        cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
        rm "$file"
    fi
done

# 3. 检查 go_starCloudLinux.conf 文件
echo ""
echo "3. 检查 go_starCloudLinux.conf 文件..."
if [ -f "/www/server/panel/vhost/nginx/go_starCloudLinux.conf" ]; then
    echo "检查 go_starCloudLinux.conf 内容："
    grep -n "redamancy.com.cn" /www/server/panel/vhost/nginx/go_starCloudLinux.conf || echo "未找到 redamancy.com.cn"
fi

# 4. 创建唯一的配置文件
echo ""
echo "4. 创建唯一的配置文件..."
cat > /www/server/panel/vhost/nginx/redamancy.com.cn.conf << 'EOF'
server {
    listen 80;
    listen 443 ssl;
    http2 on;
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

# 5. 检查配置文件语法
echo ""
echo "5. 检查配置文件语法..."
nginx -t

# 6. 重启 Nginx
echo ""
echo "6. 重启 Nginx..."
systemctl restart nginx

# 7. 检查 Nginx 状态
echo ""
echo "7. 检查 Nginx 状态..."
systemctl status nginx --no-pager -l

# 8. 等待启动
echo ""
echo "8. 等待 Nginx 启动..."
sleep 5

# 9. 测试访问
echo ""
echo "9. 测试访问..."
echo "测试 /docs/ (带斜杠):"
curl -I http://localhost/docs/ 2>/dev/null

echo ""
echo "测试 /docs/index.html:"
curl -I http://localhost/docs/index.html 2>/dev/null

echo ""
echo "测试页面内容:"
curl -s http://localhost/docs/ | head -10

# 10. 检查是否还有冲突
echo ""
echo "10. 检查是否还有冲突..."
echo "检查当前所有包含 server_name 的配置文件："
find /www/server -name "*.conf" -exec grep -l "server_name" {} \; 2>/dev/null | xargs grep "redamancy.com.cn" 2>/dev/null || echo "没有找到冲突"

echo ""
echo "✅ 彻底修复完成！"
echo ""
echo "如果还是 404，请检查："
echo "1. 文件路径: /www/wwwroot/redamancy.com.cn/docs/dist/index.html"
echo "2. 文件权限: ls -la /www/wwwroot/redamancy.com.cn/docs/dist/"
echo "3. Nginx 配置: cat /www/server/panel/vhost/nginx/redamancy.com.cn.conf" 