---
id: axi-docs-en-projects-axi-registry
title: Axi Local Registry
type: project
status: draft
tags: [Axi Docs, Projects, infra, shared]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Local Registry
graph-tags: [Projects, infra]
description: Local-only Verdaccio registry for authenticated publication and local consumption of @axi/* runtime packages.
project:
  id: axi-registry
  partition: infra
  path: /Volumes/code/workspace/infra/axi-registry
  source-section: shared
---

# Axi Local Registry — TDD Slice

> Axi Docs TDD slice for **Axi Local Registry**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-registry/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-registry` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-registry` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
