# Info Hub - 文档同步与查看平台

> 基于 Vite + React 的文档站点，用于同步和查看本地文档（Obsidian/Blinko）

## 技术栈

- **构建工具**: Vite 5.x
- **前端框架**: React 18 + TypeScript
- **文档解析**: react-markdown + remark-gfm
- **文件监听**: chokidar (文件变化监听)
- **样式**: CSS Modules + CSS Variables

## 文档来源

| 源 | 类型 | 说明 |
|----|------|------|
| Obsidian | 本地目录 | 本地 Obsidian Vault |
| Blinko | API | 闪念笔记 & 灵感捕捉 |

可在 `src/config/sources.ts` 中配置多个文档源。

## 快速开始

### 本地开发

```bash
# 安装依赖
pnpm install

# 初始化 Git 运维规范
pnpm git:bootstrap
pnpm hooks:install

# 复制环境变量模板
cp .env.example .env

# 启动开发服务器
pnpm dev
```

### 生产部署（Docker）

```bash
# 1. 复制环境变量模板
cp .env.example .env

# 2. 编辑 .env 文件，配置 Blinko Token（如 Blinko 开启认证）
BLINKO_TOKEN=your-blinko-api-token

# 3. 启动 Docker 容器
docker-compose up -d

# 4. 访问服务
http://localhost:5173
```

### 生产部署（Node.js + systemd）

```bash
# 1. 安装依赖并构建
npm ci
npm run build

# 2. 准备服务环境
cp .env.example .env.server

# 3. 启动统一的 HTTP + MCP 服务
MCP_HTTP_PORT=3010 BIND_ADDRESS=0.0.0.0 npm run mcp:http
```

和 Hermes 同机部署时，推荐至少补这两个环境变量：

- `OBSIDIAN_PATH=/root/.hermes/knowledge`
- `INFO_HUB_EXTRA_SOURCES_JSON=[{"id":"hermes-system","name":"Hermes System","path":"/root/.hermes/memories","type":"local","enabled":true,"description":"Hermes 长期记忆与系统文档","icon":"folder"}]`

这样 Info-Hub 的前端和 MCP 都能直接读取 Hermes 的知识目录与长期记忆目录。

## 环境变量说明

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `VITE_API_BASE` | 否 | API 基础路径，默认 `/docs/api` |
| `BLINKO_URL` | 否 | Blinko API 地址，默认 `http://localhost:3006` |
| `BLINKO_TOKEN` | 条件 | Blinko API Token（Blinko 开启认证时必填） |
| `OBSIDIAN_PATH` | 条件 | Obsidian Vault 路径（本地开发时需要） |
| `INFO_HUB_EXTRA_SOURCES_JSON` | 否 | 追加本地/API 知识源的 JSON 数组，可用于挂载 Hermes 目录 |

### Token 优先级

```
1. BLINKO_TOKEN 环境变量（Docker/生产环境推荐）
2. 空字符串（Blinko 关闭认证时）
```

## 开发命令

```bash
pnpm install            # 安装依赖
pnpm git:bootstrap      # 初始化 dev/main 治理基线
pnpm hooks:install      # 安装 commit-msg / pre-commit / pre-push
pnpm commit             # 交互式约定式提交
pnpm quality:check      # 治理 + lint + coverage
pnpm verify             # 构建验证
pnpm dev                # 开发模式
pnpm build              # 生产构建
pnpm preview            # 预览生产构建
pnpm test               # 运行测试
pnpm mcp                # 运行 MCP 服务器
pnpm mcp:http           # MCP HTTP 模式
```

## 运维规范

Info-Hub 已对齐 Axi 的统一运维基线：

- `dev` 是默认集成分支
- `main` 是生产发布分支
- 所有工作通过 Pull Request 合入
- commit message 和 PR 标题统一使用 Conventional Commits

运维入口文档：

- `docs/OPERATIONS.md`
- `docs/GITHUB_FLOW.md`
- `docs/BRANCH_PROTECTION.md`
- `docs/COMMIT_CONVENTION.md`
- `docs/RELEASE_OPERATIONS.md`
- `docs/QUALITY_GATE.md`

## 端口

- 开发服务器：`http://localhost:5173`
- Vite 代理：`/docs/api` → `http://localhost:3009`
- MCP HTTP 服务：`http://localhost:3010`

## Docker 部署 Blinko + Info-Hub

完整的 Blinko + Info-Hub 部署：

```yaml
version: '3.8'

networks:
  blinko-network:
    driver: bridge

services:
  blinko:
    container_name: blinko
    image: blinko:latest
    ports:
      - "3006:3006"
    environment:
      - BLINKO_TOKEN=your-secure-token
    networks:
      - blinko-network

  info-hub:
    container_name: info-hub
    build: .
    ports:
      - "5173:5173"
    environment:
      - BLINKO_URL=http://blinko:3006
      - BLINKO_TOKEN=your-secure-token
    depends_on:
      - blinko
    networks:
      - blinko-network
```

## 项目结构

```
info-hub/
├── src/
│   ├── components/     # React 组件
│   ├── hooks/          # 自定义 Hooks
│   ├── services/       # 文件服务、同步服务
│   ├── mcp/            # MCP 服务器
│   ├── types/          # TypeScript 类型
│   ├── config/         # 配置文件
│   ├── styles/         # 全局样式
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example        # 环境变量模板
├── .env                # 本地环境变量（不提交）
├── docker-compose.yml  # Docker 编排
├── Dockerfile          # Docker 镜像
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 常见问题

### Q: Blinko Token 在哪里获取？

A: 在 Blinko 的用户设置或 API 设置页面获取 JWT Token。

### Q: Docker 容器无法访问 Blinko？

A:
- 方案 1：配置 `BLINKO_URL=http://host.docker.internal:3006`（访问宿主机）
- 方案 2：将 Blinko 和 Info-Hub 放在同一 Docker 网络中

### Q: 如何持久化同步的笔记？

A: `docker-compose.yml` 中已配置 `info-hub-data` 卷，数据会自动持久化。
