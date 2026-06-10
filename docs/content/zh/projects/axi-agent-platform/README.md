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

# Axi Agent Platform

> 工作区项目档案。权威来源：`/Volumes/code/workspace/projects/axi-agent-platform`。
> 板块：core / 分区：`projects/`。

## 摘要

Axi Agent 规范的 monorepo，承载运行时/API 表面、MCP 服务、终端传输、Codex remote bridge，以及 Axi Todo。

## 技术栈

Python、FastAPI、React、TypeScript、Node.js、MCP、WebSocket

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — 分区表中 "Axi Agent Platform" 行。
- 项目根目录：`/Volumes/code/workspace/projects/axi-agent-platform`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/projects/axi-agent-platform/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/projects/axi-agent-platform/README.md`（若存在）。

## 说明

已并入此前的独立仓库 `infra/axi-agent-mcp`、`infra/axi-agent-transport`、`infra/codex-remote-bridge` 与 `tools/axi-todo`。

## 验证（建议）

_请查阅项目根目录的 `AGENTS.md` 或 `package.json` 脚本以获取权威验证命令。始终从项目目录运行，而非从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` — Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` — 工作区项目路由。
- `app/src/config/documentSources.ts` — Axi Docs 文档源注册表。
