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

# ComfyUI Reference —— PRD 分片

> ComfyUI Reference 在 Axi Docs 中的 PRD 分片。这*不是*项目自身的 PRD；它只记录 Axi Docs 呈现该项目时的自身需求。

## REQ-PROJ-COMFYUI-REFERENCE-001

| 字段 | 值 |
| --- | --- |
| 需求 | 为 ComfyUI Reference 维护一份可被发现的 Axi Docs 档案。 |
| 验收 | `docs/content/{en,zh}/projects/comfyui-reference/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` 均存在，且 frontmatter 有效。 |
| 依据 | `WORKSPACE_INDEX.md`（工作区策略）。 |

## REQ-PROJ-COMFYUI-REFERENCE-002

| 字段 | 值 |
| --- | --- |
| 需求 | 档案反映权威的工作区路径、分区与用途说明。 |
| 验收 | `pnpm --dir app projects:check --project=comfyui-reference` 通过。 |
| 依据 | `WORKSPACE_INDEX.md` 分区表。 |

## 非目标

- Axi Docs 不拥有该项目；它只索引该项目。
- Axi Docs 不复制项目内部的设计、测试或路线图。
