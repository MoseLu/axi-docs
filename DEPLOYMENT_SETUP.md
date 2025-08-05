# AXI Docs 部署配置

## 🔧 必需的 GitHub Secrets

在 axi-docs 仓库的 Settings → Secrets and variables → Actions 中配置以下 secret：

### DEPLOY_CENTER_PAT
**描述**: GitHub Personal Access Token，用于调用 axi-deploy 中央部署仓库

**权限要求**:
- `repo` - 访问私有仓库
- `workflow` - 触发工作流

**获取步骤**:
1. 访问 [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择权限：
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
4. 生成 token 并复制
5. 在 axi-docs 仓库的 Settings → Secrets and variables → Actions 中添加：
   - Name: `DEPLOY_CENTER_PAT`
   - Value: 粘贴刚才生成的 token

## 🚀 部署流程

### 自动部署
- 推送代码到 `main` 或 `master` 分支时自动触发
- 构建 VitePress 文档站点
- 自动部署到 `https://redamancy.com.cn/docs/`

### 手动部署
- 在 GitHub Actions 页面手动触发 "Build & Deploy AXI Docs" 工作流

## 📋 部署配置

### 构建配置
- **构建命令**: `pnpm run docs:build`
- **构建输出**: `docs/.vitepress/dist/`
- **部署类型**: `static`
- **部署路径**: `/srv/static/axi-docs/`

### Nginx 配置
```nginx
location /docs/ {
    alias /srv/static/axi-docs/;
    try_files $uri $uri/ /docs/index.html;
    add_header X-Robots-Tag "noindex, nofollow";
    location ~* \\.html$ {
        add_header Content-Type "text/html; charset=utf-8";
    }
}
```

### 测试 URL
- **测试地址**: `https://redamancy.com.cn/docs/`
- **访问路径**: `/docs/`

## 🔍 故障排查

### 常见问题

1. **构建失败**
   - 检查 Node.js 版本 (需要 18+)
   - 确认 pnpm 依赖安装正确
   - 查看构建日志获取详细错误

2. **部署失败**
   - 确认 `DEPLOY_CENTER_PAT` 配置正确
   - 检查 token 权限是否足够
   - 查看 axi-deploy 仓库的 Actions 日志

3. **网站无法访问**
   - 确认 axi-deploy 中央仓库部署成功
   - 检查服务器 Nginx 配置
   - 验证域名解析是否正确

### 调试方法

1. 查看 axi-docs 仓库的 Actions 日志
2. 检查 axi-deploy 中央仓库的部署日志
3. 验证构建产物是否正确上传
4. 确认服务器文件传输情况

## 📚 相关文档

- [AXI Deploy 部署指南](https://github.com/MoseLu/axi-deploy)
- [VitePress 官方文档](https://vitepress.dev/)
- [GitHub Actions 文档](https://docs.github.com/en/actions) 