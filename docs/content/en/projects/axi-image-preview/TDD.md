---
id: axi-docs-en-projects-axi-image-preview
title: Axi Image Preview
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Image Preview
graph-tags: [Projects, projects]
description: Active Axi image and wallpaper gallery preview app for visual reference, hover/detail interaction, and preview experiments.
project:
  id: axi-image-preview
  partition: projects
  path: /Volumes/code/workspace/projects/axi-image-preview
  source-section: core
---

# Axi Image Preview — TDD Slice

> Axi Docs TDD slice for **Axi Image Preview**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-image-preview/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-image-preview` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-image-preview` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
