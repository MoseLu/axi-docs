#!/bin/bash

echo "🔧 快速修复重定向问题..."

echo "📋 检查当前重定向状态:"
curl -I https://redamancy.com.cn/docs/ 2>/dev/null | head -5

echo "📋 检查是否有CDN缓存问题:"
# 添加缓存清除头
echo "=== 测试带缓存清除头的访问 ==="
curl -H "Cache-Control: no-cache" -H "Pragma: no-cache" -I https://redamancy.com.cn/docs/ 2>/dev/null

echo "📋 检查nginx配置优先级:"
echo "=== 检查location匹配顺序 ==="
nginx -T 2>/dev/null | grep -A 5 -B 5 "location.*docs" || echo "没有找到docs location"

echo "🔧 尝试修复方法1: 检查是否有其他重定向规则覆盖"
# 检查是否有全局重定向规则
if grep -r "return 301\|return 302" /www/server/nginx/conf/ 2>/dev/null; then
    echo "⚠️ 发现全局重定向规则，可能需要调整优先级"
    grep -r "return 301\|return 302" /www/server/nginx/conf/ 2>/dev/null
else
    echo "✅ 没有发现全局重定向规则"
fi

echo "🔧 尝试修复方法2: 检查location匹配"
# 检查是否有更具体的location规则
nginx -T 2>/dev/null | grep -E "location.*docs|location.*/" | head -10

echo "🔧 尝试修复方法3: 检查server块配置"
# 检查server块中是否有重定向
nginx -T 2>/dev/null | grep -A 10 -B 5 "server.*redamancy" || echo "没有找到redamancy server配置"

echo "📋 检查是否有其他配置文件干扰:"
ls -la /www/server/nginx/conf/conf.d/ | grep -v redamancy

echo "🔧 尝试修复方法4: 强制重载nginx并清除缓存"
echo "=== 重载nginx配置 ==="
systemctl reload nginx

echo "=== 等待nginx重载完成 ==="
sleep 3

echo "=== 测试访问 ==="
curl -H "Cache-Control: no-cache" -I https://redamancy.com.cn/docs/ 2>/dev/null

echo "🔧 尝试修复方法5: 检查是否有其他服务在443端口"
netstat -tlnp | grep :443

echo "📋 最终测试:"
echo "=== 测试本地访问 ==="
curl -I http://localhost/docs/ 2>/dev/null || echo "本地访问失败"

echo "=== 测试远程访问 ==="
curl -I https://redamancy.com.cn/docs/ 2>/dev/null || echo "远程访问失败"

echo "✅ 修复尝试完成"

echo "💡 如果问题仍然存在，可能需要:"
echo "1. 检查CDN配置，清除CDN缓存"
echo "2. 检查是否有其他nginx配置文件包含重定向规则"
echo "3. 检查域名DNS解析是否正确"
echo "4. 联系CDN服务商清除缓存"
