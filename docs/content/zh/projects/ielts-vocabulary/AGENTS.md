---
id: axi-docs-zh-projects-ielts-vocabulary
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, 项目, products, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: IELTS Vocabulary
graph-tags: [项目, products]
description: IELTS 词汇学习应用，承载后端服务、前端、部署与学习工作流。
project:
  id: ielts-vocabulary
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: core
---

# IELTS Vocabulary — Agent 契约

> 本档案是 **IELTS Vocabulary**（工作区路径：`/Volumes/code/workspace/products/ielts-vocab`）的 Axi Docs agent 契约。
> 它不替代项目根目录的 `AGENTS.md`。项目根目录始终是项目级规则的唯一权威；本文件只记录 Axi Docs *如何呈现* 该项目。

## 阅读顺序

1. 本文件（档案）。
2. `docs/content/{en,zh}/projects/ielts-vocabulary/README.md`（档案摘要）。
3. 项目根目录的 `AGENTS.md`：`/Volumes/code/workspace/products/ielts-vocab/AGENTS.md`。
4. 项目根目录的 `README.md`：`/Volumes/code/workspace/products/ielts-vocab/README.md`。

## 边界

- Axi Docs 将本项目视为**只读内容源**。
- Axi Docs 从不修改 `/Volumes/code/workspace/products/ielts-vocab` 下的任何文件。
- 任何修改都必须回流到所属项目（PR、issue，或 owner 交接）。

## 更新节奏

- 每当 `WORKSPACE_INDEX.md` 变化时，重新执行 `pnpm --dir app projects:build`。
- 仅当 Axi Docs 是该变更的*主要*展示面时（例如跨项目摘要、MCP 工具映射），才直接手工编辑本档案。
