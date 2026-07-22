---
id: axi-docs-zh-projects-axi-rules
title: Axi Rules
type: project
status: draft
tags: [Axi Docs, Projects, projects, shared]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Rules
graph-tags: [Projects, projects]
description: Local authority for Axi agent routing, memory, safety, verification, and generated project/rule indexes, with a React visualization of the memory pipeline.
project:
  id: axi-rules
  partition: projects
  path: /Volumes/code/workspace/projects/axi-rules
  source-section: shared
---

# Axi Rules — TDD Slice

> Axi Docs TDD slice for **Axi Rules**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-rules/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-rules` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-rules` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
