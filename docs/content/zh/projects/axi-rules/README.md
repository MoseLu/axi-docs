---
id: axi-docs-zh-projects-axi-rules
title: Axi Rules
type: project
status: draft
tags: [Axi Docs, 项目, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Rules
graph-tags: [项目, projects]
description: 面向 Axi agent 行为、项目路由、记忆源优先级、验证规则、安全边界以及前端 3D 记忆召回流水线的快速本地权威。
project:
  id: axi-rules
  partition: projects
  path: /Volumes/code/workspace/projects/axi-rules
  source-section: core
---

# Axi Rules

> 工作区项目档案。权威来源：`/Volumes/code/workspace/projects/axi-rules`。
> 板块：core / 分区：`projects/`。

## 摘要

面向 Axi agent 行为、项目路由、记忆源优先级、验证规则、安全边界以及前端 3D 记忆召回流水线的快速本地权威。

## 技术栈

Markdown、JSON、Python、React、TypeScript、Vite、three.js

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — 分区表中 "Axi Rules" 行。
- 项目根目录：`/Volumes/code/workspace/projects/axi-rules`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-rules/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/projects/axi-rules/README.md`（若存在）。

## 说明

请在 `axi-docs` 之前使用；前端应用位于 `frontend/`，如果 DevSvc 已在监听，可能需要使用 5173 以外的 Vite 端口。

## 验证（建议）

_请查阅项目根目录的 `AGENTS.md` 或 `package.json` 脚本以获取权威验证命令。始终从项目目录运行，而非从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` — Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` — 工作区项目路由。
- `app/src/config/documentSources.ts` — Axi Docs 文档源注册表。
