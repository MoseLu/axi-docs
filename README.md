# AXI Docs - 文档站点

这是一个使用 VitePress 构建的现代化文档站点，提供清晰、美观的文档展示。

> 部署测试：验证axi-deploy修复后的测试URL功能

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

# 部署参数
- --env: 环境配置 (dev/prod)
- --target: 部署目标
- --backup: 是否备份当前版本
```

#### 部署流程
1. **代码推送** → 触发 GitHub Actions
2. **自动构建** → 生成静态文件
3. **安全检查** → 验证构建结果
4. **自动部署** → 上传到目标服务器
5. **状态更新** → 更新部署状态

### 自动部署
项目配置了 GitHub Actions 工作流，支持：

- **自动构建**: 推送代码时自动构建
- **自动部署**: 构建完成后自动部署到服务器
- **连接测试**: 定期测试服务器连接状态
- **部署监控**: 实时监控部署进度和状态

### 手动部署
```bash
# 构建文档
pnpm docs:build

# 使用统一部署脚本
./deploy.sh --env prod --target server

# 或手动部署到服务器
# 具体部署步骤请参考部署配置
```

## 🔧 配置说明

### VitePress 配置
主要配置文件位于 `docs/.vitepress/config.mts`，包含：

- 站点基本信息
- 导航菜单
- 侧边栏配置
- 主题设置

### 构建配置
- **输出目录**: `docs/.vitepress/dist`
- **静态资源**: `docs/public`
- **内容目录**: `docs/content`

### 部署配置
- **部署脚本**: `deploy.sh`
- **环境配置**: 支持多环境部署
- **备份策略**: 自动备份当前版本
- **监控配置**: 部署状态实时监控

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