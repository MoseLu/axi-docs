---
id: axi-docs-en-projects-axi-agent-platform
title: Axi Agent Platform
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Agent Platform
graph-tags: [Projects, projects]
description: Canonical Axi agent monorepo for runtime/API surfaces, MCP service, terminal transport, Codex remote bridge, and Axi Todo.
project:
  id: axi-agent-platform
  partition: projects
  path: /Volumes/code/workspace/projects/axi-agent-platform
  source-section: core
---

# Axi Agent Platform — TDD Slice

> Axi Docs TDD slice for **Axi Agent Platform**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-agent-platform/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-agent-platform` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-agent-platform` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
