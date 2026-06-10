---
id: axi-docs-en-projects-axi-tauri-starter
title: Axi Tauri Starter
type: project
status: draft
tags: [Axi Docs, Projects, shared, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Tauri Starter
graph-tags: [Projects, shared]
description: Workspace-level reference for the shared Tauri 2 shell shape and cache bootstrap used by desktop shells.
project:
  id: axi-tauri-starter
  partition: shared
  path: /Volumes/code/workspace/shared/axi-tauri-starter
  source-section: shared
---

# Axi Tauri Starter — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Tauri Starter** (workspace path: `/Volumes/code/workspace/shared/axi-tauri-starter`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-tauri-starter/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/shared/axi-tauri-starter/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/shared/axi-tauri-starter/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/shared/axi-tauri-starter`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
