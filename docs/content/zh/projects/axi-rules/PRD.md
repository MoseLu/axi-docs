---
id: axi-docs-zh-projects-axi-rules
title: Axi Rules
type: project
status: draft
tags: [Axi Docs, Projects, projects, shared]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Rules
graph-tags: [Projects, projects]
description: Local authority for Axi agent routing, memory, safety, verification, and generated project/rule indexes, with a React visualization of the memory pipeline.
project:
  id: axi-rules
  partition: projects
  path: /Volumes/code/workspace/projects/axi-rules
  source-section: shared
---

# Axi Rules — PRD Slice

> Axi Docs PRD slice for **Axi Rules**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-RULES-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Rules. |
| Acceptance | `docs/content/{en,zh}/projects/axi-rules/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-RULES-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-rules` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
