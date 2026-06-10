---
id: axi-docs-en-projects-axi-workbench
title: Axi Workbench
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Workbench
graph-tags: [Projects, projects]
description: Canonical Axi workbench monorepo for workstation control plane, DevSvc dashboard, Axi Coder, verification inbox, app/docs search, fleet console, Ollama menu assistant, and Axi App CLI.
project:
  id: axi-workbench
  partition: projects
  path: /Volumes/code/workspace/projects/axi-workbench
  source-section: core
---

# Axi Workbench — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Workbench** (workspace path: `/Volumes/code/workspace/projects/axi-workbench`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-workbench/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-workbench/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-workbench/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-workbench`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
