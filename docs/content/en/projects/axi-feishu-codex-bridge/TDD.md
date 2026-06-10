---
id: axi-docs-en-projects-axi-feishu-codex-bridge
title: Axi Feishu Codex Bridge
type: project
status: draft
tags: [Axi Docs, Projects, tools, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Feishu Codex Bridge
graph-tags: [Projects, tools]
description: Local Feishu IM bridge for routing bot messages to Codex CLI, Codex App, or Codex Plus CDP with axi-rules memory integration.
project:
  id: axi-feishu-codex-bridge
  partition: tools
  path: /Volumes/code/workspace/tools/axi-feishu-codex-bridge
  source-section: core
---

# Axi Feishu Codex Bridge — TDD Slice

> Axi Docs TDD slice for **Axi Feishu Codex Bridge**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-feishu-codex-bridge/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-feishu-codex-bridge` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-feishu-codex-bridge` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
