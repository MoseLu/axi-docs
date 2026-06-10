---
id: axi-docs-zh-projects-comfyui-reference
title: ComfyUI Reference
type: project
status: draft
tags: [Axi Docs, 项目, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: ComfyUI Reference
graph-tags: [项目, references]
description: 已迁移到工作区 references 下的本地 ComfyUI 参考/运行时目录。
project:
  id: comfyui-reference
  partition: references
  path: /Volumes/code/workspace/references/comfyui
  source-section: reference
---

# ComfyUI Reference —— 里程碑

> 档案里程碑。跟踪 Axi Docs 所见的该项目的**公共呈现面**。

## 当前状态

- 工作区状态：**reference**（来自 `WORKSPACE_INDEX.md`）。
- 档案状态：草稿（由 `app/scripts/build-projects-index.mjs` 生成的初始脚手架）。

## 退出标准（从 draft 推进到 published）

- [ ] 档案的 `README.md` 概括了该项目，且没有捏造项目自身未记录的实现细节。
- [ ] `pnpm --dir app projects:check` 通过。
- [ ] 对 `WORKSPACE_INDEX.md` 以及项目根目录 `AGENTS.md` 的交叉引用准确无误。

## 长期目标

- [ ] 在内容经过审阅后，把 `status: draft` 提升为 `status: published`。
- [ ] 如果该项目发布了值得在 Axi Docs 中跟踪的用户可见变更，可选地新增 `docs/content/{en,zh}/projects/comfyui-reference/CHANGELOG.md`。
