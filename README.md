# 星际文档系统

一个基于 VitePress 构建的现代化文档网站项目。

## 项目结构

```
btc-docs/
├── docs/                    # VitePress 文档目录
│   ├── content/            # 文档内容
│   ├── en/                 # 英文文档
│   ├── examples/           # 示例文档
│   ├── public/             # 静态资源
│   ├── root/               # 根目录文档
│   └── utils/              # 工具函数
├── package.json            # 项目配置
└── tsconfig.json          # TypeScript 配置
```

## 开发环境

### 环境要求

- Node.js 18
- pnpm8
### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
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