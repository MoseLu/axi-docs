# Axi-Docs 部署诊断指南

## 502 错误排查步骤

### 1. 检查部署路径
确保文件已正确部署到服务器：
```bash
# 检查部署目录是否存在
ls -la /www/wwwroot/redamancy.com.cn/docs/

# 检查是否有 index.html 文件
ls -la /www/wwwroot/redamancy.com.cn/docs/index.html
```

### 2. 检查 Nginx 配置
```bash
# 检查 Nginx 配置文件
cat /www/server/nginx/conf/vhost/redamancy.com.cn.conf

# 检查 Nginx 语法
nginx -t

# 重启 Nginx
systemctl restart nginx
```

### 3. 检查 Nginx 错误日志
```bash
# 查看 Nginx 错误日志
tail -f /www/server/nginx/logs/error.log

# 查看访问日志
tail -f /www/server/nginx/logs/access.log
```

### 4. 检查文件权限
```bash
# 确保 Nginx 用户可以读取文件
chown -R www-data:www-data /www/wwwroot/redamancy.com.cn/docs/
chmod -R 755 /www/wwwroot/redamancy.com.cn/docs/
```

### 5. 检查 SELinux 状态（如果适用）
```bash
# 检查 SELinux 状态
sestatus

# 如果启用了 SELinux，设置正确的上下文
semanage fcontext -a -t httpd_exec_t "/www/wwwroot/redamancy.com.cn/docs(/.*)?"
restorecon -Rv /www/wwwroot/redamancy.com.cn/docs/
```

## 常见问题解决方案

### 问题 1: 文件不存在
- 检查 GitHub Actions 构建是否成功
- 检查部署路径是否正确
- 检查构建产物是否正确上传

### 问题 2: 权限问题
- 确保 Nginx 进程有读取权限
- 检查目录和文件权限

### 问题 3: Nginx 配置错误
- 检查配置文件语法
- 确保 location 块配置正确
- 检查 alias 路径是否正确

### 问题 4: 路径不匹配
- 确保部署路径与 Nginx 配置中的路径一致
- 检查 URL 路径映射

## 正确的配置

### 部署路径
```
/www/wwwroot/redamancy.com.cn/docs/
```

### Nginx 配置路径
```
/www/server/nginx/conf/vhost/redamancy.com.cn.conf
```

### 测试 URL
```
https://redamancy.com.cn/docs/
```

## 手动部署步骤

1. 确保构建成功
2. 下载构建产物
3. 上传到服务器指定路径
4. 配置 Nginx
5. 重启 Nginx
6. 测试访问 