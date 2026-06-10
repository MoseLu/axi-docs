---
id: axi-docs-zh-projects-axi-proxy-companion
title: Axi Proxy Companion
type: project
status: draft
tags: [Axi Docs, 项目, tools, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Proxy Companion
graph-tags: [项目, tools]
description: 用于控制与检查本地 proxy 后端的 macOS proxy 伴生工具。
project:
  id: axi-proxy-companion
  partition: tools
  path: /Volumes/code/workspace/tools/axi-proxy-companion
  source-section: core
---

# Axi Proxy Companion — 里程碑

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
- [ ] 若本项目会发出值得在 Axi Docs 中追踪的用户可见变更，可选地添加 `docs/content/{en,zh}/projects/axi-proxy-companion/CHANGELOG.md`。
