---
id: axi-docs-zh-projects-axi-workbench
title: Axi Workbench
type: project
status: active
tags: [Axi Docs, Projects, projects, core]
created: 2026-08-07
modified: 2026-08-07
graph-title: Axi Workbench
graph-tags: [Projects, projects]
description: Canonical AxiomaticWorld workbench for the six-layer control plane, two independent user applications (Web admin apps/workbench and mobile app apps/workbench-mobile), shared contracts, local services, AI integrations, fleet tooling, and app scaffolding.
project:
  id: axi-workbench
  partition: projects
  path: /Volumes/code/workspace/projects/axi-workbench
  source-section: core
---
## 2026-08-07 同步记录

项目根 `MILESTONE.md` 为 builder-friendly stub。权威里程碑位于 `docs/state/MILESTONE.md`（4 个里程碑，含证据与出口条件）。当前工作台状态为 verified，最近一次验证于 2026-08-07。


# Axi Workbench — Milestone

> Dossier milestone. Tracks the **public surface** of this project as seen from Axi Docs.



## Current State

- 工作区状态：**verified**（依据项目根 `docs/state/MILESTONE.md` 与 `docs/HANDOFF.md`；最近一次验证于 2026-08-07）。
- 档案：active，2026-08-07 刷新至 v3 双应用工作台（Web 管理端 `apps/workbench` + 移动端 `apps/workbench-mobile`）。
- 现存两个独立的用户应用：`apps/workbench`（Web 管理端 SPA）与 `apps/workbench-mobile`（移动应用）；共享会话 / locale 由 `@axi/workbench-foundation` 提供。

## Exit Criteria（保持档案准确）

- [x] 档案 `README.md` 准确概括项目，未声明项目自身未记录的实现细节。
- [ ] `pnpm --dir app projects:check` 通过。
- [ ] 与 `WORKSPACE_INDEX.md` 及项目根 `AGENTS.md` 的交叉引用在每次 batch 后仍然准确。

## Long-Term

- [ ] 经 Axi Docs owner 审阅后从 `status: active` 提升至 `status: published`。
- [ ] 若项目产生 Axi Docs 值得追踪的用户可见变更，再添加 `docs/content/{en,zh}/projects/axi-workbench/CHANGELOG.md`。
