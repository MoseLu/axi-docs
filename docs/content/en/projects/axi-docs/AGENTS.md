---
id: axi-docs-en-projects-axi-docs
title: Axi Docs
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Docs
graph-tags: [Projects, projects]
description: Workspace documentation hub combining a React reader, knowledge-source adapters, knowledge graph, MCP document bus, and generated project dossier mirrors.
project:
  id: axi-docs
  partition: projects
  path: /Volumes/code/workspace/projects/axi-docs
  source-section: core
---

# Axi Docs — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Docs** (workspace path: `/Volumes/code/workspace/projects/axi-docs`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-docs/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-docs/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-docs/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-docs`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
