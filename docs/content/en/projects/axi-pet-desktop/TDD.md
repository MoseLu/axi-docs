---
id: axi-docs-en-projects-axi-pet-desktop
title: Axi Pet Desktop
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Pet Desktop
graph-tags: [Projects, projects]
description: Independent Electron desktop monorepo extracted from axi-pet on 2026-06-18 (former apps/stage-tamagotchi). Owns the macOS-first desktop-pet app and a self-contained set of Stage/electron/contract packages. Namespace locked to @axi-pet-desktop/* (legacy @proj-airi/* packages migrated 2026-07-17). Remote publication pending owner sign-off (see remote_decision_pending). Lineage: fork of axi-pet, sharing the moeru-ai/airi upstream.
project:
  id: axi-pet-desktop
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet-desktop
  source-section: core
---

# Axi Pet Desktop — TDD Slice

> Axi Docs TDD slice for **Axi Pet Desktop**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-pet-desktop/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-pet-desktop` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-pet-desktop` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
