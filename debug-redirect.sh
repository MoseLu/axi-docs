#!/bin/bash

echo "🔍 调试重定向问题..."

echo "📋 检查所有nginx配置文件:"
echo "=== 主配置文件 ==="
if [ -f "/www/server/nginx/conf/nginx.conf" ]; then
    grep -n "location\|rewrite\|redirect" /www/server/nginx/conf/nginx.conf || echo "主配置文件中没有重定向规则"
else
    echo "主配置文件不存在"
fi

echo "=== redamancy目录下的所有配置 ==="
ls -la /www/server/nginx/conf/conf.d/redamancy/

echo "=== 检查所有route文件 ==="
for file in /www/server/nginx/conf/conf.d/redamancy/route-*.conf; do
    if [ -f "$file" ]; then
        echo "--- $file ---"
        cat "$file"
        echo ""
    fi
done

echo "=== 检查00-main.conf ==="
if [ -f "/www/server/nginx/conf/conf.d/redamancy/00-main.conf" ]; then
    cat /www/server/nginx/conf/conf.d/redamancy/00-main.conf
else
    echo "00-main.conf不存在"
fi

echo "📋 检查是否有其他重定向规则:"
grep -r "301\|302\|redirect\|rewrite" /www/server/nginx/conf/ 2>/dev/null || echo "没有找到重定向规则"

echo "📋 测试不同的访问方式:"
echo "=== 测试HTTP访问 ==="
curl -I http://redamancy.com.cn/docs/ 2>/dev/null || echo "HTTP访问失败"

echo "=== 测试HTTPS访问 ==="
curl -I https://redamancy.com.cn/docs/ 2>/dev/null || echo "HTTPS访问失败"

echo "=== 测试带www的访问 ==="
curl -I https://www.redamancy.com.cn/docs/ 2>/dev/null || echo "www访问失败"

echo "=== 测试不带斜杠的访问 ==="
curl -I https://redamancy.com.cn/docs 2>/dev/null || echo "不带斜杠访问失败"

echo "📋 检查CDN和缓存:"
echo "=== 检查响应头 ==="
curl -I https://redamancy.com.cn/docs/ 2>/dev/null | grep -E "(Location|Cache|CDN|Via)" || echo "没有找到相关响应头"

echo "📋 检查nginx配置是否生效:"
echo "=== 检查nginx进程 ==="
ps aux | grep nginx | grep -v grep

echo "=== 检查nginx配置测试 ==="
nginx -T | grep -A 10 -B 10 "location.*docs" || echo "没有找到docs相关的location配置"

echo "📋 手动测试nginx配置:"
echo "=== 测试nginx -t ==="
nginx -t

echo "=== 检查nginx错误日志 ==="
if [ -f "/www/server/nginx/logs/error.log" ]; then
    echo "最近的错误日志:"
    tail -n 20 /www/server/nginx/logs/error.log
else
    echo "错误日志文件不存在"
fi

echo "📋 检查是否有其他服务在干扰:"
echo "=== 检查80端口 ==="
netstat -tlnp | grep :80 || echo "80端口没有服务"

echo "=== 检查443端口 ==="
netstat -tlnp | grep :443 || echo "443端口没有服务"

echo "📋 测试本地nginx:"
echo "=== 测试本地nginx配置 ==="
curl -I http://localhost/docs/ 2>/dev/null || echo "本地nginx访问失败"

echo "🔧 尝试修复重定向问题..."

# 检查是否存在其他重定向规则
echo "=== 检查是否有全局重定向规则 ==="
find /www/server/nginx/conf/ -name "*.conf" -exec grep -l "301\|302\|redirect" {} \; 2>/dev/null

echo "✅ 调试完成"
