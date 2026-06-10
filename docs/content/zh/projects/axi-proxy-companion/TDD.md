---
id: axi-docs-zh-projects-axi-proxy-companion
title: Axi Proxy Companion
type: project
status: draft
tags: [Axi Docs, Projects, tools, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Proxy Companion
graph-tags: [Projects, tools]
description: macOS proxy companion for controlling and checking a local proxy backend.
project:
  id: axi-proxy-companion
  partition: tools
  path: /Volumes/code/workspace/tools/axi-proxy-companion
  source-section: core
---

# Axi Proxy Companion — TDD Slice

> Axi Docs TDD slice for **Axi Proxy Companion**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-proxy-companion/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-proxy-companion` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-proxy-companion` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
