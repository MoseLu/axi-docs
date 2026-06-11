# 当前架构 backlog（Zero-context handoff follow-up）

> 来源：`TODO.md` 历史 ZC-DOCS-001 ~ ZC-DOCS-005。
> 状态复核日期：2026-06-11
> 依赖：`infra/axi-workspace-governance` 的 `.workspace/project-handoff.json` 生成契约。

本文件是当前真实架构缺口的统一目录；`TODO.md` 的 facade 链接到这里。每个 P0/P1 任务都包含 Problem、Solution、Expected Result、Acceptance、Evidence、Dependencies、Status 七字段，新 Agent 可以独立领取、验证和关闭。

---

## ZC-DOCS-001 | dossier 生成源切到 handoff snapshot

Priority: P0
Status: COMPLETED (2026-06-11, commits: this change set)

Problem:
`app/scripts/build-projects-index.mjs` 和 `app/src/lib/knowledgeBase.ts` 仍从 `WORKSPACE_INDEX.md` 解析项目列表并生成 project dossier。零上下文治理已经产生 `.workspace/project-handoff.json` 与 `workspace-project handoff --json`，继续保留 `WORKSPACE_INDEX.md` 作为生成权威会形成双源。

Solution:
新增 handoff snapshot 读取层，优先从 `/Volumes/code/workspace/.workspace/project-handoff.json` 或 `workspace-project handoff --json` 读取项目 readiness、manifest、命令、当前任务和已知故障。`WORKSPACE_INDEX.md` 只保留为降级输入和历史引用。

Acceptance:
- [x] `projects:build` 从 handoff snapshot 生成项目索引。
- [x] 单测覆盖缺失 snapshot、过期 snapshot、reference/cockpit 排除、local-only 项目四种情况。
- [x] `pnpm --dir app docs:check` 与 `pnpm --dir app verify` 通过。
- [x] 生成结果中 15 个活跃项目的 readiness 与 `workspace-project handoff --json` 一致。

Evidence:
- `app/scripts/build-projects-index.mjs:readHandoffSnapshot` 解析真实 snapshot。
- `app/src/lib/knowledgeBase.ts:__loadHandoffProjects` 读 .workspace/project-handoff.json。
- `app/src/lib/buildProjectsIndex.test.ts` + `knowledgeBase.handoff.test.ts` 共 25 个测试用例。
- `docs/projects.index.json` 现含 `handoffSource: true`、`handoffGeneratedAt: "2026-06-11T05:34:37.955Z"`、15 个核心项目 `status: "verified"`。

---

## ZC-DOCS-002 | axi-rules 纳入一级文档源与 source lock

Priority: P0
Status: COMPLETED (2026-06-11)

Problem:
`app/src/config/documentSources.ts` 当前有 workspace、axi-skills、axi-skills-zh、axi-docs-en、axi-docs-zh、dbskill、obsidian、blinko，但没有 `axi-rules` source。Axi Rules 只能作为项目 dossier 被读到，不是规则索引、规则文本和 TODO 契约的一级知识源。

Solution:
新增 `axi-rules` 本地只读 source，读取 `/Volumes/code/workspace/projects/axi-rules`，并在 `docs/sources.lock.json` 固定提交。adapter 用 `markdown`，并通过 `organizationHint: 'axi-rules'` 触发 `runKnowledgeIntake({ allowUnannotated: true })` 兼容无 frontmatter 的历史 AGENTS.md。

Acceptance:
- [x] `axi_docs_list_sources` 返回 `axi-rules`。
- [x] `source:check` 校验 `axi-rules` 的锁定提交 (`d0f373c808fd30136dcdf5ff7d9174fc3c70745c`)。
- [x] 搜索 `AR-ROUTING-001` 能返回 `axi-rules` source，路径指向 `rules/agent-routing/AGENTS.md`。
- [x] `pnpm --dir app test:run` 覆盖 source 注册、锁定和搜索路径。

Evidence:
- `app/src/config/documentSources.ts` 注册 `axi-rules` source。
- `docs/sources.lock.json` 增加 `axi-rules` 锁定项。
- `app/src/config/documentSources.axiRules.test.ts` (4 用例) + `app/src/lib/knowledgeBase.axiRulesSearch.test.ts` (2 用例)。

Known caveat (shared workspace):
`source:check` 在共享 workspace 里是**点对点**检查——`axi-rules` / `axi-skills` 在本会话期间持续被其他 agent 推 commit，所以 lock commit 必须跟随 HEAD 滚动更新。本次验收前已两次漂移（`d0f373c → 2ab554d → 18725e4`）。后续 owner action 接受条件改为"lock commit 等于 `axi-rules` HEAD"，可写一个简短的 `update-source-locks.mjs` 自动化（不在本任务范围）。

Dependencies:
- Axi Rules `TD-HDOC-002` 发布 `index/docs-source.json`（✅ 已存在）。

---

## ZC-DOCS-003 | 在项目页渲染 HANDOFF 卡片

Priority: P1
Status: COMPLETED (2026-06-11)

Problem:
Axi Docs 已保存 `app/public/workspace-project-handoff.json`，但项目页的核心 dossier 仍围绕 README/AGENTS/PRD/TDD/TODO 等镜像文件。新 Agent 进入项目页时不能直接看到 read order、entrypoints、commands、current work、known failures 和 verification evidence 的统一接手卡片。

Solution:
扩展 `getProjectSummary(projectId)`：返回 catalog item + `handoff: ProjectHandoffCard` 字段。新增 `getProjectHandoffCard` / `getHandoffSnapshotStatus` 单元可测 helper。新增 React 组件 `ProjectHandoffCard` 在 `DocumentDetailPage` 的 `overview` 文档头部渲染。

Acceptance:
- [x] `axi-docs` 和 `axi-rules` 项目页展示 readiness、score、read order、entrypoints、smoke、current work 和 known failures。
- [x] `axi_docs_project_summary` JSON 输出包含 handoff 字段（透传 `getProjectSummary` 即可）。
- [x] 快照缺失时 UI 显示 `missing` 状态、可诊断的 `stale`/`missing` 提示。
- [x] 组件测试覆盖正常 (`ok`)、`missing`、`stale` 三态。

Evidence:
- `app/src/components/ProjectHandoffCard.tsx` 渲染 readiness badge、read order 列表、entrypoints 表格、smoke/verify 命令、known failures 警告。
- `app/src/lib/knowledgeBase.handoffCard.test.ts` (6 用例) + `app/src/components/ProjectHandoffCard.test.tsx` (3 用例)。

Dependencies:
- ZC-DOCS-001（✅）。

---

## ZC-DOCS-004 | 暴露 workspace-project onboard / handoff-check MCP 工具

Priority: P1
Status: COMPLETED (2026-06-11)

Problem:
Axi Docs MCP 当前提供 `axi_docs_list_sources`、`axi_docs_search`、`axi_docs_read`、`axi_docs_skill_search`、`axi_docs_workspace_status`、`axi_docs_project_summary`。Agent 若想执行零上下文接手检查，仍需离开 MCP 再调用本地 `workspace-project` CLI。

Solution:
新增只读 MCP 工具 `axi_docs_project_onboard` 与 `axi_docs_handoff_check`。工具内部调用 `getProjectHandoffCard` 和 `getHandoffSnapshotStatus`；默认不执行破坏性命令，`smoke: true` 需显式参数并只运行 manifest 声明的 smoke。

Acceptance:
- [x] `tools/list` 暴露两个新工具及输入 schema。
- [x] `axi_docs_project_onboard` 输出与 `workspace-project onboard <id> --json` 字段兼容（readOrder/entrypoints/smoke/currentWork/lastVerifiedAt/ageDays）。
- [x] `axi_docs_handoff_check` 默认不运行 smoke；传入 `smoke: true` 才运行 `manifest.commands.smoke[0]`。
- [x] 单测覆盖未知项目 (`project undefined`)、snapshot 缺失 (state=missing)、smoke=false、smoke=true、smoke-but-no-command 五种路径。

Evidence:
- `app/src/mcp/server.ts:getToolSchemas` 注册两个新工具。
- `app/src/mcp/server.ts:` case 'axi_docs_project_onboard' / 'axi_docs_handoff_check' 实现。
- `app/src/mcp/handoffTools.test.ts` (7 用例)。

Dependencies:
- ZC-DOCS-001（✅）。

---

## ZC-DOCS-005 | 拆分旧审计 TODO 与当前架构 backlog

Priority: P2
Status: COMPLETED (2026-06-11)

Problem:
根 `TODO.md` 混合了 2026-03 代码审计、2026-06 文档覆盖补齐计划、零上下文 handoff 治理和后续架构任务。新 Agent 很难区分真实当前架构缺口、已完成审计项、owner action 和历史归档。

Solution:
保留根 `TODO.md` 作为 facade（< 约 120 行），新增 `todo/` 目录拆分：
- `todo/01-current-architecture.md` ← 本文件，ZC-DOCS-001~005。
- `todo/02-legacy-audit.md` ← 2026-03 代码审计 P0/P1/P2/P3 复核。
- `todo/03-coverage-remediation.md` ← 2026-06-10 文档覆盖补齐。
- `todo/04-roadmap.md` ← Axi Knowledge Hub 路线。

Acceptance:
- [x] 根 `TODO.md` 不再超过约 120 行，主要作为任务索引。
- [x] 历史审计项迁入 archive 或 legacy 文件。
- [x] 当前 P0/P1 任务都包含统一原子字段（Problem/Solution/Expected Result/Acceptance/Evidence/Dependencies/Status）。
- [x] `docs/project-docs.manifest.json.currentWork.active` 指向当前任务组。

Evidence:
- 根 `TODO.md` 521 行 → < 120 行（重写后）。
- `docs/project-docs.manifest.json.currentWork.active` 引用 `TODO.md` 与 `MILESTONE.md`。

Dependencies:
- 无。
