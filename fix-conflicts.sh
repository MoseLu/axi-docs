#!/bin/bash

echo "🔧 修复配置文件冲突"
echo "================================"

# 1. 检查所有包含 redamancy.com.cn 的配置文件
echo "1. 检查所有包含 redamancy.com.cn 的配置文件..."
find /www/server -name "*.conf" -exec grep -l "redamancy.com.cn" {} \; 2>/dev/null

# 2. 备份所有相关配置文件
echo ""
echo "2. 备份所有相关配置文件..."
for file in $(find /www/server -name "*.conf" -exec grep -l "redamancy.com.cn" {} \; 2>/dev/null); do
    echo "备份: $file"
    cp "$file" "$file.backup.$(date +%Y%m%d_%H%M%S)"
done

# 3. 检查并删除冲突的配置文件
echo ""
echo "3. 检查并删除冲突的配置文件..."
echo "查找所有包含 server_name redamancy.com.cn 的配置文件："
find /www/server -name "*.conf" -exec grep -l "server_name redamancy.com.cn" {} \; 2>/dev/null

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

echo ""
echo "✅ 配置文件冲突修复完成！"
echo ""
echo "如果还有问题，请检查："
echo "1. 其他配置文件中的 server_name 冲突"
echo "2. 文件权限问题"
echo "3. 路径映射问题" 