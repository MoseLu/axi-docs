---
id: axi-docs-zh-projects-axi-tauri-starter
title: Axi Tauri Starter
type: project
status: draft
tags: [Axi Docs, Projects, shared, shared]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Tauri Starter
graph-tags: [Projects, shared]
description: Shared reference for Tauri 2 desktop-shell layout, command conventions, and reusable npm, pnpm, Cargo, and Rust cache bootstrap.
project:
  id: axi-tauri-starter
  partition: shared
  path: /Volumes/code/workspace/shared/axi-tauri-starter
  source-section: shared
---

# Axi Tauri Starter — TDD Slice

> Axi Docs TDD slice for **Axi Tauri Starter**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-tauri-starter/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-tauri-starter` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-tauri-starter` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
