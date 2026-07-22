---
id: axi-docs-en-projects-sports-management
title: 体育管理应用
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: 体育管理应用
graph-tags: [Projects, projects]
description: Quasar and Vue 3 sports-management application skeleton with Pinia, Vue Router, Vue I18n, and a Capacitor Android wrapper; the backend directory is only a placeholder.
project:
  id: sports-management
  partition: projects
  path: /Volumes/code/workspace/projects/axi-sports-management-app
  source-section: core
---

# 体育管理应用 — TDD Slice

> Axi Docs TDD slice for **体育管理应用**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/sports-management/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=sports-management` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/sports-management` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
