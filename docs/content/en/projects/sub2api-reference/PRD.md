---
id: axi-docs-en-projects-sub2api-reference
title: Sub2API Reference
type: project
status: draft
tags: [Axi Docs, Projects, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: Sub2API Reference
graph-tags: [Projects, references]
description: Reference AI API gateway platform for subscription quota distribution; consumed only as a provider/model-source reference for Axi Model Gateway.
project:
  id: sub2api-reference
  partition: references
  path: /Volumes/code/workspace/references/sub2api
  source-section: reference
---

# Sub2API Reference — PRD Slice

> Axi Docs PRD slice for **Sub2API Reference**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-SUB2API-REFERENCE-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Sub2API Reference. |
| Acceptance | `docs/content/{en,zh}/projects/sub2api-reference/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-SUB2API-REFERENCE-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=sub2api-reference` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
