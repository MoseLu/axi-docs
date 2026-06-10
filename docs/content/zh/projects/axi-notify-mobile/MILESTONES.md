---
id: axi-docs-zh-projects-axi-notify-mobile
title: Axi Notify / Mobile
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Notify / Mobile
graph-tags: [项目, projects]
description: Axi notify/mobile 规范的 monorepo，承载 relay、Android 客户端、事件收件箱、移动工作台，以及 donor 迁移资料。
project:
  id: axi-notify-mobile
  partition: projects
  path: /Volumes/code/workspace/projects/axi-notify
  source-section: core
---

# Axi Notify / Mobile — 里程碑

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
- [ ] 若本项目会发出值得在 Axi Docs 中追踪的用户可见变更，可选地添加 `docs/content/{en,zh}/projects/axi-notify-mobile/CHANGELOG.md`。
