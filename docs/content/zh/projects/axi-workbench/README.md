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

# Axi Workbench

> 工作区项目档案。权威来源：`/Volumes/code/workspace/projects/axi-workbench`。
> 板块：core / 分区：`projects/`。

## 摘要

Axi 工作台规范的 monorepo，承载工作站控制平面、DevSvc 仪表盘、Axi Coder、验证收件箱、应用/文档搜索、舰队控制台、Ollama 菜单助手，以及 Axi App CLI。

## 技术栈

React、TypeScript、Tauri、Rust、Node.js、Python、Ansible、Swift

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — 分区表中 "Axi Workbench" 行。
- 项目根目录：`/Volumes/code/workspace/projects/axi-workbench`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-workbench/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/projects/axi-workbench/README.md`（若存在）。

## 说明

已并入此前的独立仓库 `axi-workstation`、`axi-devsvc-dashboard`、`axi-coder`、`axi-verification-inbox`、`app-search-system`、`axi-ollama-menu-assistant`、`infra/fleet-console` 与 `tools/axi-app-cli`。

## 验证（建议）

_请查阅项目根目录的 `AGENTS.md` 或 `package.json` 脚本以获取权威验证命令。始终从项目目录运行，而非从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` — Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` — 工作区项目路由。
- `app/src/config/documentSources.ts` — Axi Docs 文档源注册表。
