---
name: info-hub
description: 文档同步与查看平台的架构规则和 Agent 指南
---

# Info-Hub AGENTS.md

> 本文件定义 info-hub 项目的架构规则。所有代码变更必须符合本文件的模块划分和技术选型。

---

## 项目概述

Info-Hub 是一个文档同步与查看平台，提供以下功能：
- 从 Blinko API 同步笔记到本地
- 提供 Web 界面浏览和搜索文档
- 提供 MCP (Model Context Protocol) 服务器供 AI 访问
- 支持知识图谱可视化

---

## 模块划分

| 模块 | 路径 | 职责 | 技术栈 |
|------|------|------|--------|
| `src/App.tsx` | 主应用 | 应用入口和路由 | React 18 / TypeScript |
| `src/components/` | UI 组件 | 可复用组件库 | React / TSX |
| `src/config/` | 配置管理 | 文档源配置 | TypeScript |
| `src/mcp/` | MCP 服务器 | MCP 协议实现 | Node.js / Anthropic SDK |
| `src/services/` | 服务层 | 文档处理和同步 | TypeScript |
| `src/types/` | 类型定义 | 共享类型定义 | TypeScript |
| `src/test/` | 测试代码 | 单元测试和集成测试 | Vitest / Testing Library |

---

## 技术栈约束

| 约束类型 | 规则 |
|---------|------|
| 语言版本 | TypeScript 5.5+ / Node.js 20+ |
| 包管理 | npm（本项目使用 npm） |
| 代码格式 | Vite + TypeScript |
| 测试框架 | Vitest（单元/集成）+ Testing Library（组件测试） |
| 构建工具 | Vite 5+ |
| UI 框架 | React 18 / React Router 7 |
| 数据格式 | Markdown / JSON |

---

## 核心功能模块

### 1. 文档源配置 (`src/config/`)

**职责**：管理多个文档源的配置（Obsidian、Blinko 等）

**关键文件**：
- `sources.ts` - 文档源定义和注册
- `sources.test.ts` - 配置测试

**规则**：
- 每个文档源必须有唯一的 `id`
- 文档源接口必须实现 `DocSource` 接口
- 支持环境变量覆盖配置

### 2. MCP 服务器 (`src/mcp/`)

**职责**：实现 MCP 协议，提供文档访问工具

**关键文件**：
- `server.ts` - MCP 服务器主逻辑
- 工具：`obsidian_scan`, `obsidian_read`, `obsidian_write`, `obsidian_search`

**规则**：
- 遵循 MCP JSON-RPC 2.0 规范
- 提供标准错误响应格式
- 支持认证 Token 验证（生产环境）
- 提供健康检查端点 `/health`

### 3. 组件库 (`src/components/`)

**职责**：UI 组件，支持可复用和组合

**关键组件**：
- `Header.tsx` - 应用头部导航
- `FileTree.tsx` - 文件树视图
- `KnowledgeGraph.tsx` - 知识图谱可视化
- `Sidebar.tsx` - 侧边栏导航
- `SearchResults.tsx` - 搜索结果展示

**规则**：
- 每个组件必须有对应的测试文件
- 使用 TypeScript 严格模式
- 组件接受 `className` prop 用于样式定制
- 使用 React Hooks 管理状态

---

## API 规范

### MCP 工具响应格式

```typescript
interface McpToolResponse {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}
```

### REST API 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 代码组织规则

| 规则 | 说明 |
|------|------|
| 单一职责 | 每个文件只做一件事 |
| 类型优先 | 先写类型定义，再写实现 |
| 测试覆盖 | 核心功能必须有测试 |
| 错误处理 | 使用 try-catch 并提供有意义的错误消息 |

---

## 同步机制

### Blinko 同步流程

```
sync-blinko.js
    ↓
调用 Blinko API
    ↓
解析 Markdown 内容
    ↓
写入 blinko-notes/ 目录
    ↓
触发前端更新
```

**关键文件**：
- `sync-blinko.js` - Blinko 同步脚本
- `blinko-notes/` - 同步后的笔记目录

**规则**：
- 同步前检查 API 可用性
- 使用幂等操作，支持重复同步
- 记录同步日志
- 处理网络错误和重试

---

## 安全约束

| 约束 | 说明 |
|------|------|
| API Token | 存储在 `.env` 文件，不提交到 Git |
| 认证 | MCP 服务器使用 Token 认证（生产环境） |
| 文件访问 | 限制访问路径，防止路径遍历攻击 |
| CORS | 配置合适的 CORS 策略 |

---

## 性能约束

| 指标 | 目标 |
|------|------|
| 首屏加载 | < 2s (3G) |
| API 响应 | < 200ms (p95) |
| 测试覆盖率 | > 60% |
| Bundle 大小 | < 500KB |

---

## 开发工作流

### 启动开发服务器

```bash
npm install
npm run dev
```

### 启动 MCP 服务器

```bash
npm run mcp:http
```

### 运行测试

```bash
npm test              # 监听模式
npm run test:run      # 单次运行
npm run test:coverage # 覆盖率报告
```

### 构建

```bash
npm run build
npm run preview
```

---

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|---------|------|
| `OBSIDIAN_PATH` | `./obsidian` | Obsidian Vault 路径 |
| `BLINKO_URL` | `http://localhost:1111` | Blinko 服务地址 |
| `BLINKO_TOKEN` | 空 | Blinko API Token |
| `MCP_AUTH_TOKEN` | 自动生成 | MCP 访问 Token |
| `ANTHROPIC_API_KEY` | 空 | Anthropic API Key |

---

## 常见任务

### 添加新的文档源

1. 在 `src/config/sources.ts` 中定义新文档源
2. 实现 `DocSource` 接口
3. 在 MCP 服务器中注册新工具
4. 添加测试用例

### 添加新的 UI 组件

1. 在 `src/components/` 创建组件文件
2. 编写对应的测试文件
3. 在主应用中导入并使用
4. 确保类型安全

### 修复 Bug

1. 找到相关文件
2. 编写测试用例重现问题
3. 修复代码
4. 验证测试通过
5. 检查覆盖率

---

## 参考文档

- [MCP 协议规范](https://modelcontextprotocol.io)
- [React 文档](https://react.dev)
- [Vite 文档](https://vitejs.dev)
- [Vitest 文档](https://vitest.dev)

---

*最后更新：2026-03-26*
