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

# Workspace Dev Services —— TDD 分片

> Workspace Dev Services 在 Axi Docs 中的 TDD 分片。描述的是档案自身的测试设计，而非项目本身。

## 单元检查

- `pnpm --dir app projects:check` 会遍历 `docs/content/{en,zh}/projects/workspace-dev-services/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md`，并断言每个期望文件都存在且 frontmatter 有效。
- `pnpm --dir app projects:check --project=workspace-dev-services` 会在该项目范围内运行同样的检查。

## 手工检查

- 在 Axi Docs Web 应用中打开档案，确认它在 `/en/projects/workspace-dev-services`（以及 `/zh/...`）下能正确路由。
- 验证知识图谱为该项目渲染了一个节点（graph-title 和 graph-tags 必须足够唯一）。

## 失败模式

- 文件缺失 → `projects:check` 非零退出，错误信息中包含缺失的路径。
- 用途说明过时 → 重新运行 `projects:build` 以从 `WORKSPACE_INDEX.md` 重新生成。
- 项目根路径过时 → 先更新 `WORKSPACE_INDEX.md`，档案会随之同步。
