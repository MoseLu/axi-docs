# Axi-Docs 502 错误快速修复指南

## 立即执行的步骤

### 1. 在服务器上运行诊断脚本
```bash
# 上传并运行诊断脚本
chmod +x server-diagnosis.sh
./server-diagnosis.sh
```

### 2. 检查文件权限
```bash
# 设置正确的文件权限
chown -R www-data:www-data /www/wwwroot/redamancy.com.cn/docs/
chmod -R 755 /www/wwwroot/redamancy.com.cn/docs/
```

### 3. 检查 Nginx 配置
```bash
# 检查 Nginx 配置文件是否存在
ls -la /www/server/nginx/conf/vhost/redamancy.com.cn.conf

# 如果不存在，创建配置文件
sudo nano /www/server/nginx/conf/vhost/redamancy.com.cn.conf
```

### 4. 添加正确的 Nginx 配置
将以下内容添加到 `/www/server/nginx/conf/vhost/redamancy.com.cn.conf`：

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name redamancy.com.cn;
    
    # SSL 配置（如果有的话）
    # ssl_certificate /path/to/cert.pem;
    # ssl_certificate_key /path/to/key.pem;
    
    # 主站点配置
    location / {
        # 你的主站点配置
    }
    
    # Axi-Docs 配置
    location /docs/ {
        alias /www/wwwroot/redamancy.com.cn/docs/;
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
}
```

### 5. 重启 Nginx
```bash
# 检查配置语法
nginx -t

# 重启 Nginx
systemctl restart nginx

# 检查 Nginx 状态
systemctl status nginx
```

### 6. 测试访问
```bash
# 测试本地访问
curl -I http://localhost/docs/

# 或者直接访问
curl http://localhost/docs/
```

## 常见问题解决

### 问题 1: 文件不存在
```bash
# 检查文件是否存在
ls -la /www/wwwroot/redamancy.com.cn/docs/index.html
```

### 问题 2: 权限问题
```bash
# 检查 Nginx 进程用户
ps aux | grep nginx

# 设置正确的权限
chown -R nginx:nginx /www/wwwroot/redamancy.com.cn/docs/
# 或者
chown -R www-data:www-data /www/wwwroot/redamancy.com.cn/docs/
```

### 问题 3: Nginx 配置错误
```bash
# 检查错误日志
tail -f /www/server/nginx/logs/error.log

# 检查访问日志
tail -f /www/server/nginx/logs/access.log
```

### 问题 4: SELinux 问题（CentOS/RHEL）
```bash
# 检查 SELinux 状态
sestatus

# 如果启用了 SELinux
semanage fcontext -a -t httpd_exec_t "/www/wwwroot/redamancy.com.cn/docs(/.*)?"
restorecon -Rv /www/wwwroot/redamancy.com.cn/docs/
```

## 验证步骤

1. 运行诊断脚本
2. 检查文件权限
3. 验证 Nginx 配置
4. 重启 Nginx
5. 测试访问 https://redamancy.com.cn/docs/

## 如果还是 502 错误

1. 检查 Nginx 错误日志：`tail -f /www/server/nginx/logs/error.log`
2. 检查防火墙设置
3. 确认域名 DNS 解析正确
4. 检查 SSL 证书（如果使用 HTTPS） 