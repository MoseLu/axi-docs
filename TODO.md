# Axi Docs Project — 待办事项 (TODO)

> 代码审计日期: 2026-03-24
> 审计范围: 前端 (React/Vite)、后端 (MCP Server)、配置、依赖、安全

---

## P0 — 紧急 (本周内必须修复)

### [SECURITY] 移除源码中硬编码的 JWT Token
- **文件:** `app/src/mcp/server.ts:227`, `app/vite.config.plugin.ts:75`
- **问题:** Blinko API Token 以明文 JWT 硬编码在源码中，有效期至 2027-03，任何有仓库访问权限的人可冒充 admin
- **措施:**
  - [ ] 删除两处硬编码 token，改为 `process.env.BLINKO_TOKEN || ''`
  - [ ] 吊销已泄露的 JWT token
  - [ ] 添加 pre-commit hook 检测 token/secret 泄露 (如 gitleaks)

### [SECURITY] Blinko API 代理缺少认证
- **文件:** `app/src/mcp/server.ts:1104-1108`
- **问题:** `/api/*?source=blinko` 请求绕过 `authMiddleware`，任何人可枚举全部笔记
- **措施:**
  - [ ] 在 `handleBlinkoApi` 调用前添加 `authMiddleware(req)` 检查
  - [ ] 确保速率限制覆盖此端点

### [BUG] server.ts 中存在重复的 switch case
- **文件:** `app/src/mcp/server.ts` — `case 'read'` 出现两次 (约 L1126 和 L1142)
- **问题:** 第二个 `case 'read'` 永远不会执行，属于死代码
- **措施:**
  - [ ] 移除重复的 `case 'read'` 代码块

### [PERF] 将同步文件 I/O 改为异步
- **文件:** `app/src/mcp/server.ts` — 6处 `readFileSync` + 2处 `writeFileSync`
- **问题:** 同步 I/O 阻塞 HTTP 服务器事件循环，大型 Obsidian vault 下导致请求超时
- **措施:**
  - [ ] 将 `readFileSync` → `fs.promises.readFile`
  - [ ] 将 `writeFileSync` → `fs.promises.writeFile`
  - [ ] 将 `readdirSync` → `fs.promises.readdir`
  - [ ] 添加请求超时保护

---

## P1 — 高优先级 (本迭代内修复)

### [SECURITY] CORS 配置过于宽松
- **文件:** `app/src/mcp/server.ts:1085`, `app/vite.config.plugin.ts` 多处
- **问题:** `Access-Control-Allow-Origin: *` 允许任意跨域请求访问敏感文档端点
- **措施:**
  - [ ] 限定 `Access-Control-Allow-Origin` 为指定域名 (`process.env.ALLOWED_ORIGINS`)
  - [ ] 限制 `Access-Control-Allow-Headers` 为 `Content-Type, Authorization`
  - [ ] 添加 `Access-Control-Max-Age: 86400` 减少预检请求

### [SECURITY] 路径穿越防护不完整
- **文件:** `app/src/mcp/server.ts:332-335`
- **问题:** `path.normalize + startsWith` 不防范 symlink 攻击和 Windows 混合路径
- **措施:**
  - [ ] 改用 `path.relative()` 并检查结果不以 `..` 开头
  - [ ] 直接拒绝包含 `..` 的路径参数
  - [ ] 白名单限制允许的文件扩展名 (仅 `.md`, `.markdown`)

### [ARCH] 抽取 Vite 插件与 Server 的重复逻辑
- **文件:** `app/vite.config.plugin.ts` vs `app/src/mcp/server.ts`
- **问题:** 标签提取、文件扫描、搜索、图谱构建、Blinko 代理等逻辑完全重复 (~2000 行)
- **措施:**
  - [ ] 新建 `app/src/lib/document-ops.ts` 共享模块
  - [ ] 将文件扫描、标签提取、搜索、图谱构建等逻辑迁移到共享模块
  - [ ] Vite 插件和 MCP Server 均从共享模块导入

### [UX] 添加错误边界与用户错误反馈
- **文件:** `app/src/App.tsx`, `app/src/components/KnowledgePanel.tsx`
- **问题:** `catch` 块仅 `console.error` 或完全静默，用户无法得知请求失败
- **措施:**
  - [ ] 创建 `ErrorBoundary` 组件包裹 App
  - [ ] 为搜索、文件加载、图谱、AI 分析添加错误 UI 状态
  - [ ] 添加 toast 通知组件
  - [ ] 为失败操作提供重试按钮

### [SECURITY] 请求体大小无限制
- **文件:** `app/src/mcp/server.ts` — `for await (const chunk of req) body += chunk`
- **问题:** POST body 无大小限制，可被利用为内存耗尽攻击
- **措施:**
  - [ ] 添加 `MAX_BODY_SIZE` 常量 (如 10MB)
  - [ ] 累积超限时返回 413 Payload Too Large

---

## P2 — 中优先级 (排入 Backlog)

### [BUG] 快速切换文件时的竞态条件
- **文件:** `app/src/App.tsx:49-69` — `loadFile` 函数
- **问题:** 快速点击多个文件时，旧请求的响应可能覆盖新请求的 UI 状态
- **措施:**
  - [ ] 使用 `AbortController` 取消旧请求
  - [ ] 在 ref 中维护 abort controller: `abortRef.current?.abort()`
  - [ ] 检查响应对应的文件路径是否仍为当前选中文件

### [PERF] React 组件缺少 memoization
- **文件:** `app/src/components/KnowledgeGraph.tsx`, `DocumentView.tsx`
- **问题:** 力导向图 tick 函数在每次 render 时重建；样式计算无缓存
- **措施:**
  - [ ] `KnowledgeGraph` 组件添加 `React.memo()` 包裹
  - [ ] `nodeFill`, `nodeRadius`, `nodeOpacity` 改为组件外常量映射
  - [ ] 考虑使用 `useTransition()` 处理渲染密集型更新

### [BUG] SearchResults 使用数组索引作为 React key
- **文件:** `app/src/components/SearchResults.tsx`
- **问题:** `key={i}` 在列表重新排序时导致 DOM 复用错误
- **措施:**
  - [ ] 改为 `key={\`${result.sourceId}:${result.path}\`}`

### [SECURITY] 搜索查询存在 ReDoS 风险
- **文件:** `app/src/mcp/server.ts:470`
- **问题:** 用户搜索输入被构造为正则表达式，可能触发指数级回溯
- **措施:**
  - [ ] 将频率统计改为 `.split(lowerQuery).length - 1`
  - [ ] 添加查询长度限制 (最大 100 字符)

### [TYPE] TypeScript 类型安全性不足
- **文件:** `app/vite.config.plugin.ts:38`, `app/src/types/index.ts`
- **问题:** 存在 `as` 类型断言和过于宽松的 `unknown[]` 类型
- **措施:**
  - [ ] 定义 `BlinkoFileItem extends FileItem` 代替类型断言
  - [ ] 移除 `as FileItem & { blinkoData: BlinkoNote }` 断言
  - [ ] 清理 `DocFile` 遗留类型

### [I18N] 硬编码中文缺少国际化支持
- **文件:** 全局
- **问题:** 所有 UI 文本均硬编码中文，无法切换语言
- **措施:**
  - [ ] 引入 `react-i18next`
  - [ ] 抽取文本到 `locales/zh-CN.json`, `locales/en.json`
  - [ ] 添加语言切换器

---

## P3 — 低优先级 (改善项)

### [DX] 缺少 .env.example 文件
- **措施:**
  - [ ] 创建 `.env.example` 包含所有环境变量及说明:
    ```
    OBSIDIAN_PATH=./docs
    BLINKO_URL=http://localhost:1111
    BLINKO_TOKEN=
    ANTHROPIC_API_KEY=
    ANTHROPIC_BASE_URL=
    AI_MODEL=claude-3-5-haiku-20241022
    BIND_ADDRESS=127.0.0.1
    MCP_AUTH_TOKEN=
    VITE_PORT=3005
    ```

### [DX] 环境变量缺少启动时校验
- **文件:** `app/src/mcp/server.ts`, `app/vite.config.plugin.ts`
- **措施:**
  - [ ] 添加启动时检查 `ANTHROPIC_API_KEY` 等必选变量
  - [ ] 缺失时打印清晰警告而非静默降级

### [DEPS] 清理未使用的依赖
- **文件:** `app/package.json`
- **措施:**
  - [ ] 确认 `gray-matter` 是否使用，否则移除
  - [ ] 将 `chokidar` 移至 `devDependencies`（仅开发模式用）

### [TEST] 测试覆盖率不足
- **当前:** 仅 5 个测试文件，覆盖率估计 < 30%
- **措施:**
  - [ ] 添加 `App.tsx` 集成测试
  - [ ] 添加 API 端点错误场景测试
  - [ ] 添加竞态条件测试
  - [ ] 添加路径穿越攻击测试
  - [ ] 配置 CI 中的覆盖率门槛 (最低 60%)

### [OPS] 缺少生产部署基础设施
- **措施:**
  - [ ] 创建 `Dockerfile` (多阶段构建: build → prod)
  - [ ] 创建 `docker-compose.yml` (axi-docs + blinko + reverse proxy)
  - [ ] 添加优雅关闭 (SIGTERM/SIGINT handler)
  - [ ] 添加结构化日志 (JSON 格式 + 时间戳)
  - [ ] 接入错误监控 (Sentry 或同类服务)

### [A11Y] 辅助功能缺失
- **措施:**
  - [ ] 为交互元素添加 ARIA labels
  - [ ] 确保键盘导航可用
  - [ ] 检查颜色对比度 (WCAG AA)
  - [ ] 为图谱组件添加 `role="img"` 和 `aria-label`

### [STYLE] 错误消息语言不一致
- **问题:** 同一文件中混用中英文错误消息
- **措施:**
  - [ ] 服务端日志统一使用英文
  - [ ] 面向用户的消息统一使用中文 (或结合 i18n)

---

## 架构改进路线图

```
阶段一 (安全加固)
├── 移除硬编码 token
├── 修复 Blinko 代理认证
├── CORS 限制
└── 路径穿越防护完善

阶段二 (代码健康)
├── 抽取共享模块消除重复
├── 同步 I/O → 异步
├── 错误边界 + 用户反馈
└── 请求体大小限制

阶段三 (质量提升)
├── 竞态条件修复
├── React 性能优化
├── TypeScript 严格模式
└── 测试覆盖率 ≥ 60%

阶段四 (可扩展)
├── 国际化框架
├── Docker 化部署
├── 结构化日志 + 监控
└── 辅助功能合规
```

---

## 审计统计

| 维度 | 数值 |
|------|------|
| 扫描文件数 | 40+ |
| 代码行数 | ~4,000+ |
| 安全问题 (P0) | 4 |
| 高优先级 (P1) | 6 |
| 中优先级 (P2) | 6 |
| 低优先级 (P3) | 8 |
| 重复代码量 | ~2,000 行 |
| 测试文件数 | 5 |
| 测试覆盖率 (估) | < 30% |
