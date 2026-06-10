---
id: axi-docs-en-projects-axi-rules
title: Axi Rules
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Rules
graph-tags: [Projects, projects]
description: Fast local authority for Axi agent behavior, project routing, memory source precedence, verification rules, safety boundaries, and the frontend 3D memory recall pipeline.
project:
  id: axi-rules
  partition: projects
  path: /Volumes/code/workspace/projects/axi-rules
  source-section: core
---

# Axi Rules — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Rules** (workspace path: `/Volumes/code/workspace/projects/axi-rules`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-rules/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-rules/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-rules/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-rules`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
