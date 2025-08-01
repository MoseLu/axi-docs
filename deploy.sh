#!/bin/bash
set -e

echo "🚀 开始部署 Axi Docs..."

# 进入项目目录
cd /www/wwwroot/axi-docs

# 备份当前版本
if [ -d "dist" ]; then
    echo "📦 备份当前版本..."
    cp -r dist dist_backup_$(date +%Y%m%d_%H%M%S)
fi

# 拉取最新代码
echo "📥 拉取最新代码..."
git fetch origin
git reset --hard origin/main

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm docs:build

# 停止现有服务
echo "🛑 停止现有服务..."
pm2 stop axi-docs 2>/dev/null || true
pkill -f "vitepress preview" 2>/dev/null || true

# 启动新服务
echo "▶️ 启动新服务..."
pm2 start "pnpm docs:preview --host 0.0.0.0 --port 9000" --name axi-docs || pm2 restart axi-docs

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 健康检查
if curl -f -s http://127.0.0.1:9000 > /dev/null 2>&1; then
    echo "✅ 部署成功！"
    # 清理旧备份（保留最近3个）
    ls -dt dist_backup_* 2>/dev/null | tail -n +4 | xargs -r rm -rf
    echo "🎉 Axi Docs 已成功部署到 http://your-domain:9000"
else
    echo "❌ 部署失败，尝试回滚..."
    pm2 stop axi-docs 2>/dev/null || true
    if [ -d "dist_backup_$(date +%Y%m%d_%H%M%S)" ]; then
        rm -rf dist
        cp -r dist_backup_$(date +%Y%m%d_%H%M%S) dist
        pm2 start "pnpm docs:preview --host 0.0.0.0 --port 9000" --name axi-docs
        echo "🔄 已回滚到备份版本"
    fi
    exit 1
fi 