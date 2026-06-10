---
id: axi-docs-zh-projects-axi-notify-mobile
title: Axi Notify / Mobile
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Notify / Mobile
graph-tags: [项目, projects]
description: Axi notify/mobile 规范的 monorepo，承载 relay、Android 客户端、事件收件箱、移动工作台，以及 donor 迁移资料。
project:
  id: axi-notify-mobile
  partition: projects
  path: /Volumes/code/workspace/projects/axi-notify
  source-section: core
---

# Axi Notify / Mobile — Agent 契约

> 本档案是 **Axi Notify / Mobile**（工作区路径：`/Volumes/code/workspace/projects/axi-notify`）的 Axi Docs agent 契约。
> 它不替代项目根目录的 `AGENTS.md`。项目根目录始终是项目级规则的唯一权威；本文件只记录 Axi Docs *如何呈现* 该项目。

## 阅读顺序

1. 本文件（档案）。
2. `docs/content/{en,zh}/projects/axi-notify-mobile/README.md`（档案摘要）。
3. 项目根目录的 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-notify/AGENTS.md`。
4. 项目根目录的 `README.md`：`/Volumes/code/workspace/projects/axi-notify/README.md`。

## 边界

- Axi Docs 将本项目视为**只读内容源**。
- Axi Docs 从不修改 `/Volumes/code/workspace/projects/axi-notify` 下的任何文件。
- 任何修改都必须回流到所属项目（PR、issue，或 owner 交接）。

## 更新节奏

- 每当 `WORKSPACE_INDEX.md` 变化时，重新执行 `pnpm --dir app projects:build`。
- 仅当 Axi Docs 是该变更的*主要*展示面时（例如跨项目摘要、MCP 工具映射），才直接手工编辑本档案。
