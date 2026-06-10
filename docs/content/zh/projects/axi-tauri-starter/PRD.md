---
id: axi-docs-zh-projects-axi-tauri-starter
title: Axi Tauri Starter
type: project
status: draft
tags: [Axi Docs, 项目, shared, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Tauri Starter
graph-tags: [项目, shared]
description: 工作区级参考：桌面外壳使用的共享 Tauri 2 壳层结构与缓存引导。
project:
  id: axi-tauri-starter
  partition: shared
  path: /Volumes/code/workspace/shared/axi-tauri-starter
  source-section: shared
---

# Axi Tauri Starter —— PRD 分片

> Axi Tauri Starter 在 Axi Docs 中的 PRD 分片。这*不是*项目自身的 PRD；它只记录 Axi Docs 呈现该项目时的自身需求。

## REQ-PROJ-AXI-TAURI-STARTER-001

| 字段 | 值 |
| --- | --- |
| 需求 | 为 Axi Tauri Starter 维护一份可被发现的 Axi Docs 档案。 |
| 验收 | `docs/content/{en,zh}/projects/axi-tauri-starter/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在，且 frontmatter 有效。 |
| 依据 | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-AXI-TAURI-STARTER-002

| 字段 | 值 |
| --- | --- |
| 需求 | 档案反映权威的工作区路径、分区与用途说明。 |
| 验收 | `pnpm --dir app projects:check --project=axi-tauri-starter` 通过。 |
| 依据 | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目；它只索引该项目。
- Axi Docs 不复制项目内部的设计、测试或路线图。
