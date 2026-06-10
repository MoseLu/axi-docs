---
id: axi-docs-zh-projects-blinko-reference
title: Blinko Reference
type: project
status: draft
tags: [Axi Docs, 项目, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: Blinko Reference
graph-tags: [项目, references]
description: 从嵌套的文档项目导入中提升出来的上游 Blinko 参考仓库。
project:
  id: blinko-reference
  partition: references
  path: /Volumes/code/workspace/references/blinko
  source-section: reference
---

# Blinko Reference

> 工作区项目档案。权威来源：`/Volumes/code/workspace/references/blinko`。
> 章节：reference / 分区：`references/`。

## 摘要

从嵌套的文档项目导入中提升出来的上游 Blinko 参考仓库。

## 技术栈

Bun、TypeScript、Docker

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) —— 分区表中 "Blinko Reference" 一行。
- 项目根目录：`/Volumes/code/workspace/references/blinko`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/references/blinko/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/references/blinko/README.md`（若存在）。

## 备注

请直接使用这条权威的参考路径。

## 验证（建议）

_请参见项目根目录的 `AGENTS.md` 或 `package.json` 脚本中定义的权威验证命令。始终从项目目录运行，而不是从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` —— Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` —— 工作区项目路由。
- `app/src/config/documentSources.ts` —— Axi Docs 文档源注册表。
