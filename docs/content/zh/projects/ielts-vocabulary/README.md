---
id: axi-docs-zh-projects-ielts-vocabulary
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, 项目, products, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: IELTS Vocabulary
graph-tags: [项目, products]
description: IELTS 词汇学习应用，承载后端服务、前端、部署与学习工作流。
project:
  id: ielts-vocabulary
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: core
---

# IELTS Vocabulary

> 工作区项目档案。权威来源：`/Volumes/code/workspace/products/ielts-vocab`。
> 板块：core / 分区：`products/`。

## 摘要

IELTS 词汇学习应用，承载后端服务、前端、部署与学习工作流。

## 技术栈

React, TypeScript, Vite, Flask, SQLite, microservices

## 权威文档

- 工作区条目：[`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — 分区表中 "IELTS Vocabulary" 行。
- 项目根目录：`/Volumes/code/workspace/products/ielts-vocab`
- 项目 `AGENTS.md`：`/Volumes/code/workspace/products/ielts-vocab/AGENTS.md`（若存在）。
- 项目 `README.md`：`/Volumes/code/workspace/products/ielts-vocab/README.md`（若存在）。

## 说明

AxiomaticWorld 集团下的独立成品业务(spun-out product):在 AxiomaticWorld 治理之下,但不在 `Axi` 产品线下,类似阿里巴巴集团下的飞猪 / 天猫。静态 IELTS PDF 与音频位于 `reference-materials/raw/`,已加入 gitignore。

## 验证（建议）

_请查阅项目根目录的 `AGENTS.md` 或 `package.json` 脚本以获取权威验证命令。始终从项目目录运行，而非从本档案目录运行。_

## 交叉引用

- `docs/content/{en,zh}/guide/workspace.md` — Axi Docs 如何消费工作区索引。
- `docs/content/{en,zh}/guide/routing.md` — 工作区项目路由。
- `app/src/config/documentSources.ts` — Axi Docs 文档源注册表。
