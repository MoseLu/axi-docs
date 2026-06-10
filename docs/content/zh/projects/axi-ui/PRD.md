---
id: axi-docs-zh-projects-axi-ui
title: Axi UI
type: project
status: draft
tags: [Axi Docs, Projects, shared, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi UI
graph-tags: [Projects, shared]
description: Axi brand tokens, shared core primitives, dashboard shell, settings, CRUD, widgets, and addon runtime packages.
project:
  id: axi-ui
  partition: shared
  path: /Volumes/code/workspace/shared/axi-ui
  source-section: shared
---

# Axi UI — PRD Slice

> Axi Docs PRD slice for **Axi UI**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-UI-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi UI. |
| Acceptance | `docs/content/{en,zh}/projects/axi-ui/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-UI-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-ui` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
