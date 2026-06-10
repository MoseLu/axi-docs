---
id: axi-docs-en-projects-axi-pet
title: Axi Pet
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Pet
graph-tags: [Projects, projects]
description: Local Axi pet/virtual companion project migrated from moeru-ai/airi, with stage-web, Live2D, provider configuration, and local STT experiments.
project:
  id: axi-pet
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet
  source-section: core
---

# Axi Pet — PRD Slice

> Axi Docs PRD slice for **Axi Pet**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-PET-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Pet. |
| Acceptance | `docs/content/{en,zh}/projects/axi-pet/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-PET-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-pet` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
