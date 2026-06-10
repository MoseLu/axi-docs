---
id: axi-docs-en-projects-cockpit-tools-reference
title: Cockpit Tools Reference
type: project
status: draft
tags: [Axi Docs, Projects, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: Cockpit Tools Reference
graph-tags: [Projects, references]
description: External/reference desktop tooling for account/runtime UI patterns; not an Axi owner or Axi application.
project:
  id: cockpit-tools-reference
  partition: references
  path: /Volumes/code/workspace/references/cockpit-tools
  source-section: reference
---

# Cockpit Tools Reference — PRD Slice

> Axi Docs PRD slice for **Cockpit Tools Reference**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-COCKPIT-TOOLS-REFERENCE-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Cockpit Tools Reference. |
| Acceptance | `docs/content/{en,zh}/projects/cockpit-tools-reference/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-COCKPIT-TOOLS-REFERENCE-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=cockpit-tools-reference` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
