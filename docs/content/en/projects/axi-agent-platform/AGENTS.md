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

# Axi Agent Platform — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Agent Platform** (workspace path: `/Volumes/code/workspace/projects/axi-agent-platform`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-agent-platform/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-agent-platform/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-agent-platform/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-agent-platform`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
