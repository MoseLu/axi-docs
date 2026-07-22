---
id: axi-docs-en-projects-axi-pet-desktop
title: Axi Pet Desktop
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Pet Desktop
graph-tags: [Projects, projects]
description: Independent Electron desktop monorepo extracted from axi-pet on 2026-06-18 (former apps/stage-tamagotchi). Owns the macOS-first desktop-pet app and a self-contained set of Stage/electron/contract packages. Namespace locked to @axi-pet-desktop/* (legacy @proj-airi/* packages migrated 2026-07-17). Remote publication pending owner sign-off (see remote_decision_pending). Lineage: fork of axi-pet, sharing the moeru-ai/airi upstream.
project:
  id: axi-pet-desktop
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet-desktop
  source-section: core
---

# Axi Pet Desktop — PRD Slice

> Axi Docs PRD slice for **Axi Pet Desktop**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-PET-DESKTOP-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Pet Desktop. |
| Acceptance | `docs/content/{en,zh}/projects/axi-pet-desktop/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-PET-DESKTOP-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-pet-desktop` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
