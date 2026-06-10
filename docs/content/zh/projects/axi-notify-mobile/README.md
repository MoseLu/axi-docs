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

# Axi Notify / Mobile

> 工作区项目档案。权威来源：`/Volumes/code/workspace/projects/axi-notify`。
> 板块：core / 分区：`projects/`。

## 摘要

Axi notify/mobile 规范的 monorepo，承载 relay、Android 客户端、事件收件箱、移动工作台，以及 donor 迁移资料。

## 技术栈

Android、Kotlin、Jetpack Compose、Go、SQLite、Firebase

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — 分区表中 "Axi Notify / Mobile" 行。
- 项目根目录：`/Volumes/code/workspace/projects/axi-notify`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-notify/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/projects/axi-notify/README.md`（若存在）。

## 说明

已并入此前的独立 donor 仓库 `android-workspace-app` 和 `feiyu-agentflow`；遗留的仓库/包标识符仍可能保留，直到安装/数据迁移计划落地。

## 验证（建议）

_请查阅项目根目录的 `AGENTS.md` 或 `package.json` 脚本以获取权威验证命令。始终从项目目录运行，而非从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` — Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` — 工作区项目路由。
- `app/src/config/documentSources.ts` — Axi Docs 文档源注册表。
