---
id: axi-docs-zh-projects-axi-skills
title: Axi Skills
type: project
status: draft
tags: [Axi Docs, Projects, shared, shared]
created: 2026-06-11
modified: 2026-06-11
graph-title: Axi Skills
graph-tags: [Projects, shared]
description: Shared version-controlled skill catalog for Codex, Claude, Cursor, MiniMax, and compatible Axi agent runtimes, with verifier-backed runtime and i18n contracts.
project:
  id: axi-skills
  partition: shared
  path: /Volumes/code/workspace/shared/axi-skills
  source-section: shared
---

# Axi Skills — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Skills** (workspace path: `/Volumes/code/workspace/shared/axi-skills`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-skills/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/shared/axi-skills/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/shared/axi-skills/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/shared/axi-skills`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
