---
id: axi-docs-zh-projects-axi-image-preview
title: Axi Image Preview
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Image Preview
graph-tags: [Projects, projects]
description: Vite and React image preview UI with a local wallpaper library, a stdio MCP upload server, and a reserved macOS Swift desktop shell.
project:
  id: axi-image-preview
  partition: projects
  path: /Volumes/code/workspace/projects/axi-image-preview
  source-section: core
---

# Axi Image Preview — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Image Preview** (workspace path: `/Volumes/code/workspace/projects/axi-image-preview`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-image-preview/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-image-preview/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-image-preview/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-image-preview`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
