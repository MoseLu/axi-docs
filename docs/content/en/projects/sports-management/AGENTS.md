---
id: axi-docs-en-projects-sports-management
title: Sports Management
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Sports Management
graph-tags: [Projects, projects]
description: Sports management app with web/mobile/backend surfaces.
project:
  id: sports-management
  partition: projects
  path: /Volumes/code/workspace/projects/axi-sports-management-app
  source-section: core
---

# Sports Management — Agent Contract

> This dossier is the Axi Docs agent contract for **Sports Management** (workspace path: `/Volumes/code/workspace/projects/axi-sports-management-app`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/sports-management/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-sports-management-app/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-sports-management-app/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-sports-management-app`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
