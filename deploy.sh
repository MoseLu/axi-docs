#!/bin/bash

# 部署脚本 - 用于宝塔面板自动化部署
# 使用方法：在宝塔面板的定时任务中添加此脚本

echo "开始部署 BTC Docs..."

# 进入项目目录
cd /www/wwwroot/yourdomain.com

# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install

# 构建项目
pnpm docs:build

# 复制构建文件到网站根目录
cp -r docs/.vitepress/dist/* ./

# 设置文件权限
chmod -R755 /www/wwwroot/yourdomain.com

echo "部署完成！" 