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

# Axi Workbench — TDD 切片

> Axi Docs 针对 **Axi Workbench** 的 TDD 切片。描述的是档案本身的测试设计，而非该项目的测试。

## 单元检查

- `pnpm --dir app projects:check` 遍历 `docs/content/{en,zh}/projects/axi-workbench/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md`，断言每个期望的文件都存在且 frontmatter 合法。
- `pnpm --dir app projects:check --project=axi-workbench` 在本项目范围内执行同样的检查。

## 手工检查

- 在 Axi Docs Web 应用中打开档案，确认其路由到 `/en/projects/axi-workbench`（以及 `/zh/...`）。
- 验证知识图谱为本项目渲染出一个节点（`graph-title` 与 `graph-tags` 必须足够独特）。

## 失败模式

- 文件缺失 → `projects:check` 以非零状态退出，错误信息中包含缺失路径。
- 用途陈述过时 → 重新执行 `projects:build` 以从 `WORKSPACE_INDEX.md` 重新生成。
- 项目根路径过时 → 先更新 `WORKSPACE_INDEX.md`，档案会自动跟随。
