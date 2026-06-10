---
id: axi-docs-en-projects-axi-video-downloader
title: Axi Video Downloader
type: project
status: draft
tags: [Axi Docs, Projects, tools, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Video Downloader
graph-tags: [Projects, tools]
description: Local video download utility.
project:
  id: axi-video-downloader
  partition: tools
  path: /Volumes/code/workspace/tools/axi-video-downloader
  source-section: shared
---

# Axi Video Downloader — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Video Downloader** (workspace path: `/Volumes/code/workspace/tools/axi-video-downloader`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-video-downloader/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/tools/axi-video-downloader/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/tools/axi-video-downloader/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/tools/axi-video-downloader`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
