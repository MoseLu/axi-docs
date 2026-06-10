---
id: axi-docs-zh-projects-axi-video-downloader
title: Axi Video Downloader
type: project
status: draft
tags: [Axi Docs, 项目, tools, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Video Downloader
graph-tags: [项目, tools]
description: 本地视频下载工具。
project:
  id: axi-video-downloader
  partition: tools
  path: /Volumes/code/workspace/tools/axi-video-downloader
  source-section: shared
---

# Axi Video Downloader —— 里程碑

> 档案里程碑。跟踪 Axi Docs 所见的该项目的**公共呈现面**。

## 当前状态

- 工作区状态：**local active**（来自 `WORKSPACE_INDEX.md`）。
- 档案状态：草稿（由 `app/scripts/build-projects-index.mjs` 生成的初始脚手架）。

## 退出标准（从 draft 推进到 published）

- [ ] 档案的 `README.md` 概括了该项目，且没有捏造项目自身未记录的实现细节。
- [ ] `pnpm --dir app projects:check` 通过。
- [ ] 对 `WORKSPACE_INDEX.md` 以及项目根目录 `AGENTS.md` 的交叉引用准确无误。

## 长期目标

- [ ] 在内容经过审阅后，把 `status: draft` 提升为 `status: published`。
- [ ] 如果该项目发布了值得在 Axi Docs 中跟踪的用户可见变更，可选地新增 `docs/content/{en,zh}/projects/axi-video-downloader/CHANGELOG.md`。
