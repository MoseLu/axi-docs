---
id: axi-docs-zh-projects-axi-docs
title: Axi Docs
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Docs
graph-tags: [项目, projects]
description: 活跃的 Axi 文档枢纽，承载文档浏览、同步表面、知识图谱 UI，以及 MCP 文档访问。
project:
  id: axi-docs
  partition: projects
  path: /Volumes/code/workspace/projects/axi-docs
  source-section: core
---

# Axi Docs — PRD 切片

> Axi Docs 针对 **Axi Docs** 的 PRD 切片。这*不是*项目本身的 PRD，它记录的是 Axi Docs 用于呈现该项目自身的需求。

## REQ-PROJ-AXI-DOCS-001

| 字段 | 值 |
| --- | --- |
| Requirement | 为 Axi Docs 维护一份可被发现的 Axi Docs 档案。 |
| Acceptance | `docs/content/{en,zh}/projects/axi-docs/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在且 frontmatter 合法。 |
| Source | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-AXI-DOCS-002

| 字段 | 值 |
| --- | --- |
| Requirement | 档案反映权威的工作区路径、分区与用途陈述。 |
| Acceptance | `pnpm --dir app projects:check --project=axi-docs` 执行成功。 |
| Source | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目，只对其进行索引。
- Axi Docs 不复制项目内部的设计、测试或路线图。
