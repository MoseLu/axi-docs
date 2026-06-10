---
id: axi-docs-en-projects-axi-notify-mobile
title: Axi Notify / Mobile
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Notify / Mobile
graph-tags: [Projects, projects]
description: Canonical Axi notify/mobile monorepo for relay, Android client, event inbox, mobile workbench, and donor migration material.
project:
  id: axi-notify-mobile
  partition: projects
  path: /Volumes/code/workspace/projects/axi-notify
  source-section: core
---

# Axi Notify / Mobile — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Notify / Mobile** (workspace path: `/Volumes/code/workspace/projects/axi-notify`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-notify-mobile/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/projects/axi-notify/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/projects/axi-notify/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/projects/axi-notify`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
