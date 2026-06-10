---
id: axi-docs-en-projects-cliproxyapi-reference
title: CLIProxyAPI Reference
type: project
status: draft
tags: [Axi Docs, Projects, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: CLIProxyAPI Reference
graph-tags: [Projects, references]
description: Sanitized reference Go proxy service for OpenAI/Gemini/Claude/Codex-compatible CLI interfaces, OAuth multi-account routing, and SDK translation patterns.
project:
  id: cliproxyapi-reference
  partition: references
  path: /Volumes/code/workspace/references/cliproxyapi
  source-section: reference
---

# CLIProxyAPI Reference — PRD Slice

> Axi Docs PRD slice for **CLIProxyAPI Reference**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-CLIPROXYAPI-REFERENCE-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for CLIProxyAPI Reference. |
| Acceptance | `docs/content/{en,zh}/projects/cliproxyapi-reference/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-CLIPROXYAPI-REFERENCE-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=cliproxyapi-reference` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
