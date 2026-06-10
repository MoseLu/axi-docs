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

# Axi Video Downloader —— PRD 分片

> Axi Video Downloader 在 Axi Docs 中的 PRD 分片。这*不是*项目自身的 PRD；它只记录 Axi Docs 呈现该项目时的自身需求。

## REQ-PROJ-AXI-VIDEO-DOWNLOADER-001

| 字段 | 值 |
| --- | --- |
| 需求 | 为 Axi Video Downloader 维护一份可被发现的 Axi Docs 档案。 |
| 验收 | `docs/content/{en,zh}/projects/axi-video-downloader/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在，且 frontmatter 有效。 |
| 依据 | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-AXI-VIDEO-DOWNLOADER-002

| 字段 | 值 |
| --- | --- |
| 需求 | 档案反映权威的工作区路径、分区与用途说明。 |
| 验收 | `pnpm --dir app projects:check --project=axi-video-downloader` 通过。 |
| 依据 | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目；它只索引该项目。
- Axi Docs 不复制项目内部的设计、测试或路线图。
