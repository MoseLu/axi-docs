---
id: axi-docs-zh-projects-axi-pet
title: Axi Pet
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Pet
graph-tags: [Projects, projects]
description: A large Project AIRI-derived monorepo for browser, Electron, mobile, server, plugin, rendering, and bot surfaces for LLM-driven virtual characters.
project:
  id: axi-pet
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet
  source-section: core
---

# Axi Pet — TDD Slice

> Axi Docs TDD slice for **Axi Pet**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-pet/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-pet` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-pet` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
