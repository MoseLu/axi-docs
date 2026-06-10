---
id: axi-docs-zh-projects-workspace-dev-services
title: Workspace Dev Services
type: project
status: draft
tags: [Axi Docs, 项目, dev-services.config.json, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Workspace Dev Services
graph-tags: [项目, dev-services.config.json]
description: 由 PM2 驱动的本地服务配置、面板路由、飞书告警监听器，以及 NATAPP 入口目标配置。
project:
  id: workspace-dev-services
  partition: dev-services.config.json
  path: /Volumes/code/workspace/dev-services.config.json
  source-section: shared
---

# Workspace Dev Services —— TODO

> 档案 TODO。记录 Axi Docs 还需要为该项目呈现哪些内容。

## P0

- [ ] 确认项目根目录的 `AGENTS.md` / `README.md` 仍然存在，并与 `WORKSPACE_INDEX.md` 一致。
- [ ] 呈现权威的验证命令（从项目 `AGENTS.md` 或 `package.json` 读取）。

## P1

- [ ] 如果项目暴露了 MCP 工具（例如 `axi_docs_*` 适配器、`workspace-project` 消费者），记录其第一方 MCP 工具映射。
- [ ] 通过 `workspace.graph.json` 链接到活跃的消费者（`workspace-project consumers <id>`）。

## P2

- [ ] 如果该项目是 Dashboard 应用，添加缩略图或图标。
- [ ] 当行为规则引用该项目时，交叉链接到 Axi Rules 条目（`rules/<family>/AGENTS.md`）。

## 不在范围内

- 项目内部的 TODO 写在项目根目录，而不是这里。
