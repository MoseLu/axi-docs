---
id: axi-docs-zh-projects-axi-proxy-companion
title: Axi Proxy Companion
type: project
status: draft
tags: [Axi Docs, 项目, tools, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Proxy Companion
graph-tags: [项目, tools]
description: 用于控制与检查本地 proxy 后端的 macOS proxy 伴生工具。
project:
  id: axi-proxy-companion
  partition: tools
  path: /Volumes/code/workspace/tools/axi-proxy-companion
  source-section: core
---

# Axi Proxy Companion — Agent 契约

> 本档案是 **Axi Proxy Companion**（工作区路径：`/Volumes/code/workspace/tools/axi-proxy-companion`）的 Axi Docs agent 契约。
> 它不替代项目根目录的 `AGENTS.md`。项目根目录始终是项目级规则的唯一权威；本文件只记录 Axi Docs *如何呈现* 该项目。

## 阅读顺序

1. 本文件（档案）。
2. `docs/content/{en,zh}/projects/axi-proxy-companion/README.md`（档案摘要）。
3. 项目根目录的 `AGENTS.md`：`/Volumes/code/workspace/tools/axi-proxy-companion/AGENTS.md`。
4. 项目根目录的 `README.md`：`/Volumes/code/workspace/tools/axi-proxy-companion/README.md`。

## 边界

- Axi Docs 将本项目视为**只读内容源**。
- Axi Docs 从不修改 `/Volumes/code/workspace/tools/axi-proxy-companion` 下的任何文件。
- 任何修改都必须回流到所属项目（PR、issue，或 owner 交接）。

## 更新节奏

- 每当 `WORKSPACE_INDEX.md` 变化时，重新执行 `pnpm --dir app projects:build`。
- 仅当 Axi Docs 是该变更的*主要*展示面时（例如跨项目摘要、MCP 工具映射），才直接手工编辑本档案。
