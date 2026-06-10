---
id: axi-docs-zh-projects-axi-agent-platform
title: Axi Agent Platform
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Agent Platform
graph-tags: [项目, projects]
description: Axi Agent 规范的 monorepo，承载运行时/API 表面、MCP 服务、终端传输、Codex remote bridge，以及 Axi Todo。
project:
  id: axi-agent-platform
  partition: projects
  path: /Volumes/code/workspace/projects/axi-agent-platform
  source-section: core
---

# Axi Agent Platform — 里程碑

> 档案里程碑。追踪 Axi Docs 视角下本项目的**公共展示面**。

## 当前状态

- 工作区状态：**active**（来源：WORKSPACE_INDEX.md）。
- 档案状态：draft（由 `app/scripts/build-projects-index.mjs` 生成的初始脚手架）。

## 退出标准（从 draft → published）

- [ ] 档案 `README.md` 总结项目时，不应宣称项目本身未文档化的实现细节。
- [ ] `pnpm --dir app projects:check` 通过。
- [ ] 对 `WORKSPACE_INDEX.md` 与项目根目录 `AGENTS.md` 的交叉引用准确无误。

## 长期目标

- [ ] 内容评审完成后，从 `status: draft` 提升为 `status: published`。
- [ ] 若本项目会发出值得在 Axi Docs 中追踪的用户可见变更，可选地添加 `docs/content/{en,zh}/projects/axi-agent-platform/CHANGELOG.md`。
