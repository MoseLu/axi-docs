---
id: axi-docs-zh-projects-axi-tauri-starter
title: Axi Tauri Starter
type: project
status: draft
tags: [Axi Docs, Projects, shared, shared]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Tauri Starter
graph-tags: [Projects, shared]
description: Shared reference for Tauri 2 desktop-shell layout, command conventions, and reusable npm, pnpm, Cargo, and Rust cache bootstrap.
project:
  id: axi-tauri-starter
  partition: shared
  path: /Volumes/code/workspace/shared/axi-tauri-starter
  source-section: shared
---

# Axi Tauri Starter — PRD Slice

> Axi Docs PRD slice for **Axi Tauri Starter**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-TAURI-STARTER-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Tauri Starter. |
| Acceptance | `docs/content/{en,zh}/projects/axi-tauri-starter/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-TAURI-STARTER-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-tauri-starter` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
