---
id: axi-docs-zh-projects-axi-workbench
title: Axi Workbench
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Workbench
graph-tags: [项目, projects]
description: Axi 工作台规范的 monorepo，承载工作站控制平面、DevSvc 仪表盘、Axi Coder、验证收件箱、应用/文档搜索、舰队控制台、Ollama 菜单助手，以及 Axi App CLI。
project:
  id: axi-workbench
  partition: projects
  path: /Volumes/code/workspace/projects/axi-workbench
  source-section: core
---

# Axi Workbench — 里程碑

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
- [ ] 若本项目会发出值得在 Axi Docs 中追踪的用户可见变更，可选地添加 `docs/content/{en,zh}/projects/axi-workbench/CHANGELOG.md`。
