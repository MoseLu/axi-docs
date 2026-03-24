# Info Hub - 文档同步与查看平台

> 基于 Vite + React 的文档站点，用于同步和查看本地文档（Obsidian/坚果云）

## 技术栈

- **构建工具**: Vite 5.x
- **前端框架**: React 18 + TypeScript
- **文档解析**: react-markdown + remark-gfm
- **文件监听**: chokidar (文件变化监听)
- **样式**: CSS Modules + CSS Variables

## 文档来源

默认同步路径：`F:/docs/obsidian/`

可在 `src/config/sources.ts` 中配置多个文档源。

## 开发

```bash
pnpm install
pnpm dev    # 开发模式，监听文件变化
pnpm build # 生产构建
pnpm preview # 预览生产构建
```

## 端口

- 开发服务器: `http://localhost:3009`
- Nginx 已代理此端口

## 项目结构

```
info-hub/
├── src/
│   ├── components/     # React 组件
│   ├── hooks/          # 自定义 Hooks
│   ├── services/       # 文件服务、同步服务
│   ├── types/          # TypeScript 类型
│   ├── config/         # 配置文件
│   ├── styles/         # 全局样式
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```
