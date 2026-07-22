---
id: axi-docs-en-projects-axi-docs
title: Axi Docs
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Docs
graph-tags: [Projects, projects]
description: Workspace documentation hub combining a React reader, knowledge-source adapters, knowledge graph, MCP document bus, and generated project dossier mirrors.
project:
  id: axi-docs
  partition: projects
  path: /Volumes/code/workspace/projects/axi-docs
  source-section: core
---

# Axi Docs — PRD Slice

> Axi Docs PRD slice for **Axi Docs**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-DOCS-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Docs. |
| Acceptance | `docs/content/{en,zh}/projects/axi-docs/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-DOCS-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-docs` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
