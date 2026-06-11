# Axi Docs Project — 待办事项 (TODO)

> 代码审计日期: 2026-03-24
> 审计范围: 前端 (React/Vite)、后端 (MCP Server)、配置、依赖、安全
> 状态复核日期: 2026-06-11（仅勾选有当前代码或测试证据的完成项）

---

## 当前路线 — Axi Knowledge Hub

> 更新日期: 2026-06-04

### 已推进

- [x] 将 Axi Docs 定位为多文档库 Knowledge Hub，而不是单一 Markdown 站点
- [x] 新增文档项目 registry 与 adapter 概念
- [x] 首批接入 workspace registry、Axi Skills、Obsidian、Blinko
- [x] 为 `axi-skills` 保留原生 `SKILL.md` 格式，通过 adapter 生成 Web/MCP 可用索引
- [x] MCP 新增 `axi_docs_*` 语义化工具

### 下一轮重点

- [ ] 把 `axi-skills` 以 `sources/axi-skills` 子库/submodule 形式纳入 `axi-docs` 仓库工作流
- [ ] 继续打磨 Web 文档阅读页的左侧树、右侧 TOC 和项目详情页体验
- [ ] 将旧审计清单逐项复核为“已修/仍需修/已被新架构替代”

---

## P0 — 紧急 (本周内必须修复)

### [SECURITY] 移除源码中硬编码的 JWT Token
- **文件:** `app/src/mcp/server.ts:227`, `app/vite.config.plugin.ts:75`
- **问题:** Blinko API Token 以明文 JWT 硬编码在源码中，有效期至 2027-03，任何有仓库访问权限的人可冒充 admin
- **措施:**
  - [x] 删除两处硬编码 token，改为 `process.env.BLINKO_TOKEN || ''`
  - [ ] 吊销已泄露的 JWT token
  - [ ] 添加 pre-commit hook 检测 token/secret 泄露 (如 gitleaks)

### [SECURITY] Blinko API 代理缺少认证
- **文件:** `app/src/mcp/server.ts:1104-1108`
- **问题:** `/api/*?source=blinko` 请求绕过 `authMiddleware`，任何人可枚举全部笔记
- **措施:**
  - [x] 在 `handleBlinkoApi` 调用前添加 `authMiddleware(req)` 检查
  - [x] 确保速率限制覆盖此端点

### [BUG] server.ts 中存在重复的 switch case
- **文件:** `app/src/mcp/server.ts` — `case 'read'` 出现两次 (约 L1126 和 L1142)
- **问题:** 第二个 `case 'read'` 永远不会执行，属于死代码
- **措施:**
  - [x] 移除重复的 `case 'read'` 代码块

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
  - [x] 改用 `path.relative()` 并检查结果不以 `..` 开头
  - [x] 直接拒绝包含 `..` 的路径参数
  - [x] 白名单限制允许的文件扩展名 (仅 `.md`, `.markdown`)

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
  - [x] 创建 `ErrorBoundary` 组件包裹 App
  - [ ] 为搜索、文件加载、图谱、AI 分析添加错误 UI 状态
  - [ ] 添加 toast 通知组件
  - [ ] 为失败操作提供重试按钮

### [SECURITY] 请求体大小无限制
- **文件:** `app/src/mcp/server.ts` — `for await (const chunk of req) body += chunk`
- **问题:** POST body 无大小限制，可被利用为内存耗尽攻击
- **措施:**
  - [x] 添加 `MAX_BODY_SIZE` 常量 (如 10MB)
  - [x] 累积超限时返回 413 Payload Too Large

---

## P2 — 中优先级 (排入 Backlog)

### [BUG] 快速切换文件时的竞态条件
- **文件:** `app/src/App.tsx:49-69` — `loadFile` 函数
- **问题:** 快速点击多个文件时，旧请求的响应可能覆盖新请求的 UI 状态
- **措施:**
  - [x] 使用 `AbortController` 取消旧请求
  - [x] 在 ref 中维护 abort controller: `abortRef.current?.abort()`
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
  - [x] 改为 `key={\`${result.sourceId}:${result.path}\`}`

### [SECURITY] 搜索查询存在 ReDoS 风险
- **文件:** `app/src/mcp/server.ts:470`
- **问题:** 用户搜索输入被构造为正则表达式，可能触发指数级回溯
- **措施:**
  - [x] 移除动态正则频率统计，改用 `indexOf`/字面量匹配
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
  - [x] 创建 `.env.example` 包含所有环境变量及说明:
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
  - [x] 确认 `gray-matter` 正由 `knowledgeBase.ts` 使用，保留依赖
  - [ ] 将 `chokidar` 移至 `devDependencies`（仅开发模式用）

### [TEST] 测试覆盖率不足
- **当前:** 仅 5 个测试文件，覆盖率估计 < 30%
- **措施:**
  - [x] 添加 `App.tsx` 集成测试
  - [ ] 添加 API 端点错误场景测试
  - [ ] 添加竞态条件测试
  - [ ] 添加路径穿越攻击测试
  - [ ] 配置 CI 中的覆盖率门槛 (最低 60%)

### [OPS] 缺少生产部署基础设施
- **措施:**
  - [x] 创建 `Dockerfile` (多阶段构建: build → prod)
  - [x] 创建 `docker-compose.yml` (axi-docs + blinko + reverse proxy)
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

---

## 文档覆盖补齐计划（2026-06-10 审计）

> 完整审计报告：[`docs/axi-workspace-governance/audits/axi-docs-coverage-2026-06-10.md`](docs/axi-workspace-governance/audits/axi-docs-coverage-2026-06-10.md)
> 触发问题：用户问"axi-docs 文档仓库对于整个工作区来说，文档齐全吗？" → 经全工作区目录树 vs 镜像目录对比，发现 3 类缺口（缺失项目、7 件套不全、governance 根级未镜像）。

### 缺口摘要

| 维度 | 现状 | 目标 |
|---|---|---|
| 工作区真实 Axi 项目数 | 19 + 7 reference + 2 虚拟 = 28 | 28 全覆盖 |
| 镜像覆盖率 | 25/28（**漏 dbskill / codex-plus-app**）| 27/28（axi-registry 走 governance 镜像） |
| 镜像 7 件套 → 11 件套 | 7 件套 | 11 件套（含 CHANGELOG/SECURITY/CHANGE/CLAUDE/README.zh-CN/AGENTS.zh-CN）|
| governance 根级门面 | 5 报告 + ADR（**漏 9 个根级门面**）| 9 个根级门面补齐 |
| 三合一 → 四合一声明 | 文档枢纽/知识图谱/MCP 三合一 | 加"工作区项目门面镜像"第 4 项职责 |

### P0：补 2 个缺失项目镜像（dbskill + codex-plus-app）

- [x] 创建 `docs/content/{en,zh}/projects/dbskill/` 镜像目录：7 件套 + 实际存在的 `README.zh-CN.md`（共 8 件）
- [x] 创建 `docs/content/{en,zh}/projects/codex-plus-app/` 镜像目录：README + AGENTS + INDEX 3 件最小目录（README 标注"项目待填充"）
- [x] 更新 `docs/projects.index.json` 加 2 条记录（绕开 build 脚本，手工补） + 新增 `preservedAddenda` 字段防 build 冲掉
- [x] 改 `app/scripts/build-projects-index.mjs` 保留 hand-curated addenda（status 含 'hand-curated' 的条目不被覆盖）
- [x] 注：这两个项目不在 `WORKSPACE_INDEX.md` 表格里，build 脚本不会自动接管；下次 WORKSPACE_INDEX.md 收编时再切到自动生成

### P1：把 7 件套扩展为 11 件套镜像

- [x] 修改 `app/scripts/build-projects-index.mjs` 的 `PIECES` 列表，加 `OPTIONAL_PIECES = ['CHANGELOG.md', 'SECURITY.md', 'README.zh-CN.md', 'AGENTS.zh-CN.md']`
- [x] 加 `PASSTHROUGH_FILES = ['CHANGE.md', 'CLAUDE.md']`（verbatim 复制 + frontmatter 注入）
- [x] 加源文件存在检测：源文件不存在时跳过该 piece、不报缺
- [x] 重新跑 `pnpm --dir app projects:build` 生成新件套
- [x] 更新 `pnpm --dir app projects:check` 校验逻辑（必选件 7 件硬错、optional/passthrough 软警告）
- [x] 验证 `pnpm --dir app projects:check` 通过（322 required dossier files present）

### P1：补 governance 根级门面镜像

- [x] 在 `docs/axi-workspace-governance/` 下补 9 个根级门面（AGENTS / CHANGELOG / INDEX / MILESTONES / PRD / README.zh-CN / SECURITY / TDD / TODO）—— 从 `infra/axi-workspace-governance/` 复制
- [x] 镜像 `README.md` 追加说明"包含 governance 根级门面（10 件）" + 引用新加的 9 个文件
- [x] 注：build 脚本对 governance 显式 skip 保持不变，governance 走镜像目录

### P1：根级 AGENTS.md 加第 4 项职责

- [x] 改 `AGENTS.md` 第 19-23 行："三合一" → "四合一"，加"工作区项目门面镜像（Project Dossier Mirror）"作为第 4 项职责
- [x] 指向 `app/scripts/build-projects-index.mjs` 与本次 audit 报告
- [x] 更新文件尾"最后更新"日期

### 验证

- [x] `pnpm --dir app projects:check` 通过
- [x] `pnpm --dir app docs:check` 通过
- [x] `pnpm --dir app verify` 通过（tsc + vite build，1m 23s）
- [ ] `pnpm --dir app source:check` 通过 — **preexisting, owner action**：axi-skills 上游漂移，与本次改动无关
- [x] `pnpm --dir app typecheck` — **N/A**：无独立 typecheck 脚本；`verify` 包含 `tsc`

### P2 收尾

- [x] 写 `docs/content/{en,zh}/guide/project-dossiers.md` 11 件套使用指南（追加 11 件套与 hand-curated addenda 节）
- [x] 起草 dbskill 收编到 WORKSPACE_INDEX.md 提案：`docs/axi-workspace-governance/audits/proposal-add-dbskill-to-workspace-index-2026-06-10.md`
- [x] 起草 codex-plus-app 处置建议：`docs/axi-workspace-governance/audits/proposal-dispose-codex-plus-app-2026-06-10.md`
- [x] 评估 PIECE_TEMPLATES 重构（结论：不做，详见 `docs/axi-workspace-governance/audits/eval-piecetemplates-refactor-2026-06-10.md`）

---

*追加于 2026-06-10 — 由 axi-docs 维护者从工作区状态现场整理。*

## Zero-context handoff governance

- [x] Migrate `docs/project-docs.manifest.json` to schema v2 with verified
      read order, entrypoints, commands, environment metadata, contracts, and
      troubleshooting guidance.
- [ ] Revalidate the manifest after source-adapter, MCP, build, document-suite,
      or ownership changes so repository evidence remains sufficient for a
      zero-context handoff.

## Zero-context architecture follow-up（2026-06-11 复探）

> 范围：只记录 `axi-docs` 与 `axi-rules` 在零上下文接手架构中的后续任务。
> 本节不实施架构改动；每项任务都应能被新 Agent 独立领取、验证和关闭。

### ZC-DOCS-001 | 将项目 dossier 生成源切到 handoff snapshot | TODO

Priority: P0

Problem:
`app/scripts/build-projects-index.mjs` 和 `app/src/lib/knowledgeBase.ts`
仍从 `/Volumes/code/workspace/WORKSPACE_INDEX.md` 解析项目列表并生成
project dossier。零上下文治理已经产生
`.workspace/project-handoff.json` 与 `workspace-project handoff --json`，
继续保留 `WORKSPACE_INDEX.md` 作为生成权威会形成双源。

Solution:
新增 handoff snapshot 读取层，优先从
`/Volumes/code/workspace/.workspace/project-handoff.json` 或
`workspace-project handoff --json` 读取项目 readiness、manifest、命令、
当前任务和已知故障。`WORKSPACE_INDEX.md` 只保留为降级输入和历史引用。

Expected Result:
Axi Docs 的 project dossier、`docs/projects.index.json`、workspace source
虚拟文档与治理 handoff 输出一致，不再出现项目数量、状态或命令来源漂移。

Acceptance:
- [ ] `projects:build` 或后续等价命令从 handoff snapshot 生成项目索引。
- [ ] 单测覆盖缺失 snapshot、过期 snapshot、reference/cockpit 排除、local-only
      项目四种情况。
- [ ] `pnpm --dir app docs:check` 与 `pnpm --dir app verify` 通过。
- [ ] 生成结果中 15 个活跃项目的 readiness 与
      `workspace-project handoff --json` 一致。

Evidence:
- `app/scripts/build-projects-index.mjs` 顶部注释和常量当前声明解析
  `WORKSPACE_INDEX.md`。
- `app/src/lib/knowledgeBase.ts` 的 workspace source 仍构造
  `WORKSPACE_INDEX.md` 项目文档。
- 本轮治理验证已产生 15 个 `verified 10/10` handoff 条目。

Dependencies:
- `infra/axi-workspace-governance` 的 `.workspace/project-handoff.json`
  生成契约保持稳定。

Status: TODO

### ZC-DOCS-002 | 把 axi-rules 纳入一级文档源与 source lock | TODO

Priority: P0

Problem:
`app/src/config/documentSources.ts` 当前有 workspace、axi-skills、
axi-skills-zh、axi-docs-en、axi-docs-zh、dbskill、obsidian、blinko，
但没有 `axi-rules` source。Axi Rules 只能作为项目 dossier 被读到，
不是规则索引、规则文本和 TODO 契约的一级知识源。

Solution:
新增 `axi-rules` 本地只读 source，读取
`/Volumes/code/workspace/projects/axi-rules`，并在
`docs/sources.lock.json` 固定提交。适配器应优先索引
`index/docs-source.json`（由 axi-rules 任务生成），再补充
`rules/*/AGENTS.md`、`index/*.json`、`todo/*.md`。

Expected Result:
Web 搜索、知识图谱和 MCP 都能直接回答“某条 agent 规则来自哪里、优先级是什么、
如何验证”，而不需要先进入项目 dossier 再人工拼接。

Acceptance:
- [ ] `axi_docs_list_sources` 返回 `axi-rules`。
- [ ] `source:check` 校验 `axi-rules` 的锁定提交。
- [ ] 搜索 `AR-ROUTING-001` 或 `TD-HDOC-001` 能返回 `axi-rules` source。
- [ ] `pnpm --dir app test:run` 覆盖 source 注册、锁定和搜索路径。

Evidence:
- `app/src/config/documentSources.ts` 未注册 `axi-rules`。
- `axi-rules` 已有 `index/rules.json`、`index/sources.json` 和
  `todo/index.json`，但 Axi Docs 未按规则源消费。

Dependencies:
- Axi Rules `TD-HDOC-002` 发布 `index/docs-source.json`。

Status: TODO

### ZC-DOCS-003 | 在项目页渲染 HANDOFF 卡片 | TODO

Priority: P1

Problem:
Axi Docs 已保存 `app/public/workspace-project-handoff.json`，但项目页的核心
dossier 仍围绕 README/AGENTS/PRD/TDD/TODO 等镜像文件。新 Agent 进入项目页
时不能直接看到 read order、entrypoints、commands、current work、known failures
和 verification evidence 的统一接手卡片。

Solution:
在项目详情页和 knowledge catalog 中加入 `HANDOFF` 卡片数据模型，读取
handoff snapshot 的项目条目并渲染两分钟接手视图。MCP 的
`axi_docs_project_summary` 也返回同一字段。

Expected Result:
人类和 Agent 在 Axi Docs 中打开任一活跃项目，即可看到与
`workspace-project onboard <id>` 同源的接手摘要。

Acceptance:
- [ ] `axi-docs` 和 `axi-rules` 项目页展示 readiness、score、read order、
      entrypoints、smoke command、current work 和 known failures。
- [ ] `axi_docs_project_summary` JSON/文本输出包含 handoff 字段。
- [ ] 快照缺失时 UI 显示可诊断的 stale/missing 状态，而不是空白。
- [ ] 组件测试覆盖正常、缺失、stale 三种状态。

Evidence:
- `app/public/workspace-project-handoff.json` 已由治理同步生成。
- MCP 当前只有 `axi_docs_project_summary`，未显式输出 onboard/handoff 字段。

Dependencies:
- ZC-DOCS-001。

Status: TODO

### ZC-DOCS-004 | 暴露 workspace-project onboard / handoff-check MCP 工具 | TODO

Priority: P1

Problem:
Axi Docs MCP 当前提供 `axi_docs_list_sources`、`axi_docs_search`、
`axi_docs_read`、`axi_docs_skill_search`、`axi_docs_workspace_status`、
`axi_docs_project_summary`。Agent 若想执行零上下文接手检查，仍需离开
MCP 再调用本地 `workspace-project` CLI。

Solution:
新增只读 MCP 工具：`axi_docs_project_onboard` 与
`axi_docs_handoff_check`。工具内部调用治理 CLI 或读取 snapshot；默认不执行
破坏性命令，`--smoke` 需显式参数并只运行 manifest 声明的 smoke。

Expected Result:
MCP 客户端可以通过 Axi Docs 完成“定位项目、读取接手摘要、检查 handoff、
可选 smoke”的闭环。

Acceptance:
- [ ] `tools/list` 暴露两个新工具及输入 schema。
- [ ] `axi_docs_project_onboard` 输出与
      `workspace-project onboard <id> --json` 字段兼容。
- [ ] `axi_docs_handoff_check` 默认不运行 smoke；传入 `smoke: true` 才运行。
- [ ] 单测覆盖未知项目、snapshot 缺失、smoke=false、smoke=true 四种路径。

Evidence:
- `app/src/mcp/server.ts` 当前未出现 `handoff` 或 `onboard` 工具名。

Dependencies:
- ZC-DOCS-001。

Status: TODO

### ZC-DOCS-005 | 拆分旧审计 TODO 与当前架构 backlog | TODO

Priority: P2

Problem:
根 `TODO.md` 混合了 2026-03 代码审计、2026-06 文档覆盖补齐计划、零上下文
handoff 治理和后续架构任务。新 Agent 很难区分真实当前架构缺口、已完成审计
项、owner action 和历史归档。

Solution:
保留根 `TODO.md` 作为 facade，新增 `todo/` 目录或分节索引，把旧审计、
文档覆盖、zero-context architecture follow-up、security/ops backlog 分开。
每个 P0/P1 任务必须包含 Problem、Solution、Expected Result、Acceptance、
Evidence、Dependencies、Status。

Expected Result:
Agent 可以在 2 分钟内判断当前最高优先级任务，而不会被已完成审计清单或历史
统计误导。

Acceptance:
- [ ] 根 `TODO.md` 不再超过约 120 行，主要作为任务索引。
- [ ] 历史审计项迁入 archive 或 legacy 文件。
- [ ] 当前 P0/P1 任务都包含统一原子字段。
- [ ] `docs/project-docs.manifest.json.currentWork.active` 指向当前任务组。

Evidence:
- 当前 `TODO.md` 同时包含旧审计统计、完成项、owner action 和新 handoff
  governance 项。
- `axi-rules` 已有 `todo/` 分类目录，可作为结构参考。

Dependencies:
- 无。

Status: TODO
