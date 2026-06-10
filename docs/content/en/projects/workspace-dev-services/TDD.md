---
id: axi-docs-en-projects-workspace-dev-services
title: Workspace Dev Services
type: project
status: draft
tags: [Axi Docs, Projects, dev-services.config.json, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Workspace Dev Services
graph-tags: [Projects, dev-services.config.json]
description: PM2-backed local service profiles, dashboard routing, Feishu alert watcher, and NATAPP ingress target configuration.
project:
  id: workspace-dev-services
  partition: dev-services.config.json
  path: /Volumes/code/workspace/dev-services.config.json
  source-section: shared
---

# Workspace Dev Services — TDD Slice

> Axi Docs TDD slice for **Workspace Dev Services**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/workspace-dev-services/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=workspace-dev-services` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/workspace-dev-services` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
