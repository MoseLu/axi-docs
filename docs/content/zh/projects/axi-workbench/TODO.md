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

# Axi Workbench — TODO

> 档案 TODO。追踪 Axi Docs 还需要为本项目展示什么内容。

## P0

- [ ] 确认项目根目录的 `AGENTS.md` / `README.md` 仍然存在，并与 `WORKSPACE_INDEX.md` 保持一致。
- [ ] 展示权威验证命令（从项目 `AGENTS.md` 或 `package.json` 中读取）。

## P1

- [ ] 若项目暴露了第一方 MCP 工具映射（例如 `axi_docs_*` 适配器、`workspace-project` 消费者），需记录。
- [ ] 通过 `workspace.graph.json`（`workspace-project consumers <id>`）链接到活跃的消费者。

## P2

- [ ] 若该项目是 Dashboard 应用，添加缩略图或图标。
- [ ] 当行为规则引用本项目时，交叉链接到 Axi Rules 条目（`rules/<family>/AGENTS.md`）。

## 不在范围内

- 项目内部 TODO 存放在项目根目录，而不是这里。
