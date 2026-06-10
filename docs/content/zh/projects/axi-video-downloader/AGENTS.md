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

# Axi Video Downloader —— 代理契约

> 本档案是 **Axi Video Downloader**（工作区路径：`/Volumes/code/workspace/tools/axi-video-downloader`）在 Axi Docs 中的代理契约。
> 它不取代项目根目录的 `AGENTS.md`。项目级规则始终以项目根目录的 `AGENTS.md` 为准；本文件仅记录 Axi Docs 如何*呈现*该项目。

## 阅读顺序

1. 本文件（档案）。
2. `docs/content/{en,zh}/projects/axi-video-downloader/README.md`（档案摘要）。
3. 项目根目录的 `AGENTS.md`：`/Volumes/code/workspace/tools/axi-video-downloader/AGENTS.md`。
4. 项目根目录的 `README.md`：`/Volumes/code/workspace/tools/axi-video-downloader/README.md`。

## 边界

- Axi Docs 将本项目视为**只读的内容来源**。
- Axi Docs 绝不编辑 `/Volumes/code/workspace/tools/axi-video-downloader` 下的任何文件。
- 任何修改都必须以 PR、issue 或所有者交接的方式回写到归属项目。

## 更新节奏

- 每当 `WORKSPACE_INDEX.md` 发生变化时，重新运行 `pnpm --dir app projects:build`。
- 仅当 Axi Docs 是该变更的*主要*呈现面（例如跨项目摘要、MCP 工具映射）时，才手工编辑本档案。
