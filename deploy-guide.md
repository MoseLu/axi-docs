# 阿里云宝塔面板部署指南

## 部署方案概述

本项目是一个基于 VitePress 的静态文档网站，可以轻松部署到阿里云宝塔面板。

## 方案一：手动部署（推荐新手）

### 1. 本地构建
```bash
# 在本地项目目录执行
pnpm docs:build
```

###2. 上传文件
- 将 `docs/.vitepress/dist` 目录中的所有文件
- 上传到宝塔面板网站根目录（通常是 `/www/wwwroot/yourdomain.com/`）

### 3 配置网站
- 在宝塔面板中创建网站
- 域名：`docs.yourdomain.com`
- PHP版本：选择纯静态"
- 伪静态：选择"Vue"规则

## 方案二：Git自动部署（推荐）

###1. 宝塔面板配置
1 登录宝塔面板
2. 创建网站，选择纯静态"
3. 在网站设置中找到"Git"4仓库：`https://github.com/MoseLu/axi-docs.git`
5设置自动拉取

### 2. 服务器环境准备
```bash
# 安装 Node.js18装 pnpm
npm install -g pnpm

# 进入网站目录
cd /www/wwwroot/yourdomain.com

# 克隆项目
git clone https://github.com/MoseLu/axi-docs.git .

# 安装依赖
pnpm install

# 构建项目
pnpm docs:build

# 复制构建文件
cp -r docs/.vitepress/dist/* ./
```

###3. 自动化脚本
使用项目根目录的 `deploy.sh` 脚本：

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 在宝塔面板定时任务中添加
bash /path/to/your/project/deploy.sh
```

## 方案三：宝塔面板定时任务

### 1 创建部署脚本
在宝塔面板中创建定时任务：

```bash
#!/bin/bash
cd /www/wwwroot/yourdomain.com
git pull origin main
pnpm install
pnpm docs:build
cp -r docs/.vitepress/dist/* ./
chmod -R755 /www/wwwroot/yourdomain.com
```

### 2 设置定时任务
- 进入宝塔面板 → 计划任务
- 添加定时任务
- 选择Shell脚本
- 设置执行时间（如：每天凌晨2点）

## 注意事项

### 1 环境要求
- Node.js 18
- pnpm8+
- Git

### 2 文件权限
确保网站目录有正确的读写权限：
```bash
chown -R www:www /www/wwwroot/yourdomain.com
chmod -R755 /www/wwwroot/yourdomain.com
```

### 3伪静态配置
在宝塔面板网站设置中添加伪静态规则：
```nginx
location /[object Object]    try_files $uri $uri/ /index.html;
}
```

### 4域名解析
确保域名已正确解析到服务器IP。

## 验证部署

部署完成后，访问您的域名即可看到文档网站。

## 更新部署

### 手动更新1 在本地修改代码2 推送到GitHub
3. 在服务器执行部署脚本

### 自动更新
设置宝塔面板定时任务，定期自动拉取最新代码并重新构建。

## 常见问题

### Q: 构建失败
A: 检查Node.js版本和pnpm是否正确安装

### Q: 网站无法访问
A: 检查域名解析、防火墙设置、网站配置

### Q: 静态资源404: 确保伪静态规则配置正确

### Q: 权限问题
A: 检查文件和目录权限设置 