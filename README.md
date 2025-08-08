# AXI Docs - 文档站点

这是一个使用 VitePress 构建的现代化文档站点，提供清晰、美观的文档展示。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览构建结果
pnpm docs:preview
```

### 开发环境

- **Node.js**: 18+
- **包管理器**: pnpm
- **框架**: VitePress
- **端口**: 9000

## 📋 项目特性

### 文档功能
- 📝 Markdown 支持
- 🎨 自定义主题
- 🔍 全文搜索
- 📱 响应式设计
- ⚡ 快速构建

### 开发体验
- 🚀 热重载开发
- 📦 依赖管理
- 🔧 类型支持
- 📋 脚本自动化

### 部署支持
- 🌐 统一部署支持
- 🔄 自动构建部署
- 📊 部署状态监控
- 🛡️ 部署安全检查

## 📁 项目结构

```
axi-docs/
├── docs/                    # 文档源文件
│   ├── .vitepress/         # VitePress 配置
│   │   ├── config.mts     # 站点配置
│   │   ├── theme/         # 自定义主题
│   │   └── dist/          # 构建输出
│   ├── content/           # 文档内容
│   └── public/            # 静态资源
├── .github/workflows/     # GitHub Actions
│   ├── deploy.yml         # 部署工作流
│   ├── sync-docs.yml      # 文档同步
│   └── test-connection.yml # 连接测试
├── package.json           # 项目配置
├── pnpm-lock.yaml        # 依赖锁定
└── pnpm-workspace.yaml   # 工作区配置
```

## 🛠️ 技术栈

### 核心依赖
- **VitePress**: 静态站点生成器
- **Vue**: 前端框架
- **TypeScript**: 类型支持
- **pnpm**: 包管理器

### 开发工具
- **Node.js**: 运行时环境
- **GitHub Actions**: CI/CD
- **SSH**: 远程部署

## 🚀 部署

### 统一部署支持

本项目已集成统一部署系统，支持以下功能：

#### 部署状态
- ✅ **自动构建**: 代码推送时自动触发构建
- ✅ **自动部署**: 构建成功后自动部署到目标服务器
- ✅ **状态监控**: 实时监控部署状态和服务器连接
- ✅ **回滚支持**: 支持快速回滚到之前的版本

#### 部署配置
```bash
# 部署脚本
./deploy.sh
```

## 🔄 部署触发

### 自动部署

当代码推送到 `main` 或 `master` 分支时，会自动触发以下流程：

1. **构建阶段**：
   - 安装依赖 (`pnpm install`)
   - 构建文档 (`pnpm docs:build`)
   - 上传构建产物到 GitHub Actions

2. **部署阶段**：
   - 触发 axi-deploy 工作流
   - 下载构建产物
   - 部署到目标服务器
   - 配置 Nginx 路由
   - 验证部署结果

### 手动触发

可以通过以下方式手动触发部署：

1. **GitHub Actions 页面**：在 Actions 页面手动触发 `Build & Deploy AXI Docs` 工作流
2. **API 调用**：使用 GitHub API 触发 repository_dispatch 事件

### 部署参数

部署时需要以下参数（通过 GitHub Secrets 配置）：

- `DEPLOY_CENTER_PAT`: GitHub Token (用于下载构建产物)
- `SERVER_HOST`: 服务器地址
- `SERVER_USER`: 服务器用户名
- `SERVER_KEY`: 服务器SSH私钥
- `SERVER_PORT`: 服务器SSH端口

### 部署验证

部署完成后，可以通过以下方式验证：

1. **网站访问**：访问 `https://your-domain.com/docs/`
2. **状态检查**：查看 GitHub Actions 执行日志
3. **服务器验证**：检查服务器上的文件是否正确部署

---

**最后更新**: 2024-12-19 - 集成新的 axi-deploy 部署系统

## 📖 文档编写

### Markdown 语法
支持标准 Markdown 语法，以及 VitePress 扩展功能：

```markdown
# 标题
## 二级标题

- 列表项
- 另一个列表项

**粗体文本**
*斜体文本*

[链接文本](URL)

```代码块```
```

### 自定义组件
可以在文档中使用 Vue 组件和自定义样式。

## 📞 获取帮助

- 📖 查看 [VitePress 文档](https://vitepress.dev/)
- 🐛 报告问题
- 💬 讨论改进建议
- 🚀 部署相关问题

## 📄 许可证

本项目采用 MIT 许可证。

<!-- 更新时间戳: 2025-08-06 15:05:00 -->