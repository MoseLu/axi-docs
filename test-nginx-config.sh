#!/bin/bash

echo "🔍 检查nginx配置状态..."

# 检查nginx配置文件
echo "📋 检查nginx配置文件:"
ls -la /www/server/nginx/conf/conf.d/redamancy/

echo "📋 检查主配置文件:"
if [ -f "/www/server/nginx/conf/conf.d/redamancy/00-main.conf" ]; then
    cat /www/server/nginx/conf/conf.d/redamancy/00-main.conf
else
    echo "❌ 主配置文件不存在"
fi

echo "📋 检查route-axi-docs.conf:"
if [ -f "/www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf" ]; then
    cat /www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf
else
    echo "❌ route-axi-docs.conf不存在"
fi

echo "📋 检查所有route文件:"
ls -la /www/server/nginx/conf/conf.d/redamancy/route-*.conf 2>/dev/null || echo "没有找到route文件"

echo "📋 检查包含docs的配置:"
grep -r "docs" /www/server/nginx/conf/ 2>/dev/null || echo "没有找到包含docs的配置"

echo "📋 检查重定向规则:"
grep -r "301\|302\|redirect" /www/server/nginx/conf/ 2>/dev/null || echo "没有找到重定向规则"

echo "📋 检查部署目录:"
ls -la /srv/static/axi-docs/ 2>/dev/null || echo "部署目录不存在"

echo "📋 测试nginx配置语法:"
nginx -t

echo "🔧 手动创建route-axi-docs.conf..."

# 创建正确的route-axi-docs.conf
sudo tee /www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf <<'EOF'
    # 文档站点
    location /docs/ {
        alias /srv/static/axi-docs/;
        index index.html;
        try_files $uri $uri/ /docs/index.html;
        
        # 确保不缓存HTML文件
        location ~* \.html$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
            add_header Expires "0";
        }
        
        # 静态资源缓存
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
EOF

echo "✅ route-axi-docs.conf已创建"

echo "📋 验证配置:"
cat /www/server/nginx/conf/conf.d/redamancy/route-axi-docs.conf

echo "🔄 重载nginx:"
sudo systemctl reload nginx

echo "📋 测试访问:"
curl -I https://redamancy.com.cn/docs/

echo "✅ 配置修复完成"

# 添加额外的诊断信息
echo "🔍 额外诊断信息:"
echo "📋 检查nginx进程状态:"
systemctl status nginx --no-pager -l

echo "📋 检查nginx错误日志:"
tail -n 20 /www/server/nginx/logs/error.log

echo "📋 检查nginx访问日志:"
tail -n 10 /www/server/nginx/logs/access.log

echo "📋 测试本地访问:"
curl -I http://localhost/docs/ 2>/dev/null || echo "本地访问失败"

echo "📋 检查防火墙状态:"
systemctl status firewalld --no-pager -l 2>/dev/null || echo "防火墙未运行"

echo "✅ 诊断完成"
