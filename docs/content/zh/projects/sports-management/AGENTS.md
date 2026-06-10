---
id: axi-docs-zh-projects-sports-management
title: Sports Management
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Sports Management
graph-tags: [项目, projects]
description: 体育管理应用，承载 Web/移动/后端表面。
project:
  id: sports-management
  partition: projects
  path: /Volumes/code/workspace/projects/axi-sports-management-app
  source-section: core
---

# Sports Management — Agent 契约

> 本档案是 **Sports Management**（工作区路径：`/Volumes/code/workspace/projects/axi-sports-management-app`）的 Axi Docs agent 契约。
> 它不替代项目根目录的 `AGENTS.md`。项目根目录始终是项目级规则的唯一权威；本文件只记录 Axi Docs *如何呈现* 该项目。

## 阅读顺序

1. 本文件（档案）。
2. `docs/content/{en,zh}/projects/sports-management/README.md`（档案摘要）。
3. 项目根目录的 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-sports-management-app/AGENTS.md`。
4. 项目根目录的 `README.md`：`/Volumes/code/workspace/projects/axi-sports-management-app/README.md`。

## 边界

- Axi Docs 将本项目视为**只读内容源**。
- Axi Docs 从不修改 `/Volumes/code/workspace/projects/axi-sports-management-app` 下的任何文件。
- 任何修改都必须回流到所属项目（PR、issue，或 owner 交接）。

## 更新节奏

- 每当 `WORKSPACE_INDEX.md` 变化时，重新执行 `pnpm --dir app projects:build`。
- 仅当 Axi Docs 是该变更的*主要*展示面时（例如跨项目摘要、MCP 工具映射），才直接手工编辑本档案。
