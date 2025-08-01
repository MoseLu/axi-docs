# AXI Docs - 文档站点

这是一个使用 VitePress 构建的文档站点，用于测试 AXI Deploy SSH 部署架构。

## 🚀 快速开始

### 本地开发

```bash
<<<<<<< HEAD
# 安装依赖
pnpm install

# 启动开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build
```

### 部署测试

这个项目用于测试 AXI Deploy 公共仓库的 SSH 部署功能：

1. **构建测试**: 验证 VitePress 构建过程
2. **部署测试**: 测试 SSH 连接和文件传输
3. **架构验证**: 验证公共仓库工作流的调用

## 📋 部署配置

### 当前配置

- **构建输出**: `./docs/.vitepress/dist`
- **目标路径**: `/www/wwwroot/axi-docs`
- **部署命令**: 
  ```bash
  cd /www/wwwroot/axi-docs
  chmod -R 755 .
  sudo systemctl reload nginx
  ```

### 测试步骤

1. **推送代码** - 触发构建和部署
2. **检查构建** - 验证 VitePress 构建成功
3. **测试连接** - 验证 SSH 连接正常
4. **验证部署** - 检查文件传输和命令执行

## 🔧 工作流

### 部署工作流

- **触发条件**: 推送到 `main` 或 `master` 分支
- **构建步骤**: Node.js + pnpm + VitePress
- **部署步骤**: SSH 文件传输 + 命令执行

### 测试工作流

- **手动触发**: 测试 SSH 连接
- **验证功能**: 检查服务器状态和权限

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
│   └── test-connection.yml # 测试工作流
└── package.json           # 项目配置
```

## 🎯 测试目标

1. **验证 AXI Deploy 架构**
   - 公共仓库工作流调用
   - SSH 连接管理
   - 文件传输功能

2. **测试部署流程**
   - 构建过程稳定性
   - 部署命令执行
   - 服务重启验证

3. **架构优化**
   - 简化配置流程
   - 提高部署效率
   - 增强错误处理

## 📞 获取帮助

- 📖 查看 AXI Deploy 文档
- �� 报告部署问题
- 💬 讨论架构改进 
=======
pnpm docs:dev
```

开发服务器将在 http://localhost:9000 启动。

### 构建项目

```bash
pnpm docs:build
```

### 预览构建结果

```bash
pnpm docs:preview
```

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue 3](https://vuejs.org/) - 前端框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [pnpm](https://pnpm.io/) - 包管理器

## 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 
>>>>>>> 005c0941d4daca6c9108d91149b92c0b25764ff5
