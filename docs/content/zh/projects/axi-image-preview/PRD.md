---
id: axi-docs-zh-projects-axi-image-preview
title: Axi Image Preview
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Image Preview
graph-tags: [Projects, projects]
description: Vite and React image preview UI with a local wallpaper library, a stdio MCP upload server, and a reserved macOS Swift desktop shell.
project:
  id: axi-image-preview
  partition: projects
  path: /Volumes/code/workspace/projects/axi-image-preview
  source-section: core
---

# Axi Image Preview — PRD Slice

> Axi Docs PRD slice for **Axi Image Preview**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-IMAGE-PREVIEW-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Image Preview. |
| Acceptance | `docs/content/{en,zh}/projects/axi-image-preview/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-IMAGE-PREVIEW-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-image-preview` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
