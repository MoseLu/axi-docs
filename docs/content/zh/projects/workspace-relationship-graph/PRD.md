---
id: axi-docs-zh-projects-workspace-relationship-graph
title: Workspace Relationship Graph
type: project
status: draft
tags: [Axi Docs, 项目, workspace.graph.json, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Workspace Relationship Graph
graph-tags: [项目, workspace.graph.json]
description: 描述项目 provider、consumer、契约、启动配置、健康检查以及验证命令的机器可读图谱。
project:
  id: workspace-relationship-graph
  partition: workspace.graph.json
  path: /Volumes/code/workspace/workspace.graph.json
  source-section: shared
---

# Workspace Relationship Graph —— PRD 分片

> Workspace Relationship Graph 在 Axi Docs 中的 PRD 分片。这*不是*项目自身的 PRD；它只记录 Axi Docs 呈现该项目时的自身需求。

## REQ-PROJ-WORKSPACE-RELATIONSHIP-GRAPH-001

| 字段 | 值 |
| --- | --- |
| 需求 | 为 Workspace Relationship Graph 维护一份可被发现的 Axi Docs 档案。 |
| 验收 | `docs/content/{en,zh}/projects/workspace-relationship-graph/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` 均存在，且 frontmatter 有效。 |
| 依据 | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-WORKSPACE-RELATIONSHIP-GRAPH-002

| 字段 | 值 |
| --- | --- |
| 需求 | 档案反映权威的工作区路径、分区与用途说明。 |
| 验收 | `pnpm --dir app projects:check --project=workspace-relationship-graph` 通过。 |
| 依据 | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目；它只索引该项目。
- Axi Docs 不复制项目内部的设计、测试或路线图。
