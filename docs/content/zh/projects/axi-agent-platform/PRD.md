---
id: axi-docs-zh-projects-axi-agent-platform
title: Axi Agent Platform
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Agent Platform
graph-tags: [项目, projects]
description: Axi Agent 规范的 monorepo，承载运行时/API 表面、MCP 服务、终端传输、Codex remote bridge，以及 Axi Todo。
project:
  id: axi-agent-platform
  partition: projects
  path: /Volumes/code/workspace/projects/axi-agent-platform
  source-section: core
---

# Axi Agent Platform — PRD 切片

> Axi Docs 针对 **Axi Agent Platform** 的 PRD 切片。这*不是*项目本身的 PRD，它记录的是 Axi Docs 用于呈现该项目自身的需求。

## REQ-PROJ-AXI-AGENT-PLATFORM-001

| 字段 | 值 |
| --- | --- |
| Requirement | 为 Axi Agent Platform 维护一份可被发现的 Axi Docs 档案。 |
| Acceptance | `docs/content/{en,zh}/projects/axi-agent-platform/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在且 frontmatter 合法。 |
| Source | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-AXI-AGENT-PLATFORM-002

| 字段 | 值 |
| --- | --- |
| Requirement | 档案反映权威的工作区路径、分区与用途陈述。 |
| Acceptance | `pnpm --dir app projects:check --project=axi-agent-platform` 执行成功。 |
| Source | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目，只对其进行索引。
- Axi Docs 不复制项目内部的设计、测试或路线图。
