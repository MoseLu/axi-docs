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

# Axi Docs

> 工作区项目档案。权威来源：`/Volumes/code/workspace/projects/axi-docs`。
> 板块：core / 分区：`projects/`。

## 摘要

活跃的 Axi 文档枢纽，承载文档浏览、同步表面、知识图谱 UI，以及 MCP 文档访问。

## 技术栈

React、TypeScript、Vite、MCP、Markdown、Node.js

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — 分区表中 "Axi Docs" 行。
- 项目根目录：`/Volumes/code/workspace/projects/axi-docs`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-docs/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/projects/axi-docs/README.md`（若存在）。

## 说明

Canonical active project；应用代码位于 `app/`。

## 验证（建议）

_请查阅项目根目录的 `AGENTS.md` 或 `package.json` 脚本以获取权威验证命令。始终从项目目录运行，而非从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` — Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` — 工作区项目路由。
- `app/src/config/documentSources.ts` — Axi Docs 文档源注册表。
