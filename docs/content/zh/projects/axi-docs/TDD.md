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

# Axi Docs — TDD 切片

> Axi Docs 针对 **Axi Docs** 的 TDD 切片。描述的是档案本身的测试设计，而非该项目的测试。

## 单元检查

- `pnpm --dir app projects:check` 遍历 `docs/content/{en,zh}/projects/axi-docs/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md`，断言每个期望的文件都存在且 frontmatter 合法。
- `pnpm --dir app projects:check --project=axi-docs` 在本项目范围内执行同样的检查。

## 手工检查

- 在 Axi Docs Web 应用中打开档案，确认其路由到 `/en/projects/axi-docs`（以及 `/zh/...`）。
- 验证知识图谱为本项目渲染出一个节点（`graph-title` 与 `graph-tags` 必须足够独特）。

## 失败模式

- 文件缺失 → `projects:check` 以非零状态退出，错误信息中包含缺失路径。
- 用途陈述过时 → 重新执行 `projects:build` 以从 `WORKSPACE_INDEX.md` 重新生成。
- 项目根路径过时 → 先更新 `WORKSPACE_INDEX.md`，档案会自动跟随。
