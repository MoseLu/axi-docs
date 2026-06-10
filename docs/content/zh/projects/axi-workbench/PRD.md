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

# Axi Workbench — PRD 切片

> Axi Docs 针对 **Axi Workbench** 的 PRD 切片。这*不是*项目本身的 PRD，它记录的是 Axi Docs 用于呈现该项目自身的需求。

## REQ-PROJ-AXI-WORKBENCH-001

| 字段 | 值 |
| --- | --- |
| Requirement | 为 Axi Workbench 维护一份可被发现的 Axi Docs 档案。 |
| Acceptance | `docs/content/{en,zh}/projects/axi-workbench/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在且 frontmatter 合法。 |
| Source | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-AXI-WORKBENCH-002

| 字段 | 值 |
| --- | --- |
| Requirement | 档案反映权威的工作区路径、分区与用途陈述。 |
| Acceptance | `pnpm --dir app projects:check --project=axi-workbench` 执行成功。 |
| Source | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目，只对其进行索引。
- Axi Docs 不复制项目内部的设计、测试或路线图。
