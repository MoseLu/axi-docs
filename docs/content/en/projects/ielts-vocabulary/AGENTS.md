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

# IELTS Vocabulary — Agent Contract

> This dossier is the Axi Docs agent contract for **IELTS Vocabulary** (workspace path: `/Volumes/code/workspace/products/ielts-vocab`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/ielts-vocabulary/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/products/ielts-vocab/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/products/ielts-vocab/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/products/ielts-vocab`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
