---
id: axi-docs-en-projects-ielts-vocabulary
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, Projects, products, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: IELTS Vocabulary
graph-tags: [Projects, products]
description: IELTS vocabulary learning app, backend services, frontend, deploy and learning workflows.
project:
  id: ielts-vocabulary
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: core
---

# IELTS Vocabulary — TDD Slice

> Axi Docs TDD slice for **IELTS Vocabulary**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/ielts-vocabulary/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=ielts-vocabulary` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/ielts-vocabulary` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
