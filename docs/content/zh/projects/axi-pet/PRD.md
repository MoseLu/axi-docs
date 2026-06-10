---
id: axi-docs-zh-projects-axi-pet
title: Axi Pet
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Pet
graph-tags: [项目, projects]
description: 本地 Axi 宠物/虚拟伴侣项目，从 moeru-ai/airi 迁移而来，包含 stage-web、Live2D、provider 配置以及本地 STT 实验。
project:
  id: axi-pet
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet
  source-section: core
---

# Axi Pet — PRD 切片

> Axi Docs 针对 **Axi Pet** 的 PRD 切片。这*不是*项目本身的 PRD，它记录的是 Axi Docs 用于呈现该项目自身的需求。

## REQ-PROJ-AXI-PET-001

| 字段 | 值 |
| --- | --- |
| Requirement | 为 Axi Pet 维护一份可被发现的 Axi Docs 档案。 |
| Acceptance | `docs/content/{en,zh}/projects/axi-pet/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在且 frontmatter 合法。 |
| Source | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-AXI-PET-002

| 字段 | 值 |
| --- | --- |
| Requirement | 档案反映权威的工作区路径、分区与用途陈述。 |
| Acceptance | `pnpm --dir app projects:check --project=axi-pet` 执行成功。 |
| Source | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目，只对其进行索引。
- Axi Docs 不复制项目内部的设计、测试或路线图。
