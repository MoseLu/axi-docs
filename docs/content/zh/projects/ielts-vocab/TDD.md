---
id: axi-docs-zh-projects-ielts-vocab
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, Projects, products, reference]
created: 2026-06-11
modified: 2026-06-11
graph-title: IELTS Vocabulary
graph-tags: [Projects, products]
description: Full-stack IELTS vocabulary learning product with web, mobile, shared client packages, gateway, split backend services, speech, and production operations.
project:
  id: ielts-vocab
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: reference
---

# IELTS Vocabulary — TDD Slice

> Axi Docs TDD slice for **IELTS Vocabulary**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/ielts-vocab/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=ielts-vocab` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/ielts-vocab` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
