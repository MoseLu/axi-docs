---
id: axi-docs-en-projects-workspace-relationship-graph
title: Workspace Relationship Graph
type: project
status: draft
tags: [Axi Docs, Projects, workspace.graph.json, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Workspace Relationship Graph
graph-tags: [Projects, workspace.graph.json]
description: Machine-readable graph of project providers, consumers, contracts, startup profiles, health checks, and verification commands.
project:
  id: workspace-relationship-graph
  partition: workspace.graph.json
  path: /Volumes/code/workspace/workspace.graph.json
  source-section: shared
---

# Workspace Relationship Graph — TDD Slice

> Axi Docs TDD slice for **Workspace Relationship Graph**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/workspace-relationship-graph/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=workspace-relationship-graph` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/workspace-relationship-graph` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
