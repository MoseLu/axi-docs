---
id: axi-docs-en-projects-axi-proxy-companion
title: Axi Proxy Companion
type: project
status: draft
tags: [Axi Docs, Projects, tools, reference]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Proxy Companion
graph-tags: [Projects, tools]
description: Native macOS AppKit companion that starts, stops, inspects, and reports traffic for registered local proxy backends without changing the macOS system proxy.
project:
  id: axi-proxy-companion
  partition: tools
  path: /Volumes/code/workspace/tools/axi-proxy-companion
  source-section: reference
---

# Axi Proxy Companion — PRD Slice

> Axi Docs PRD slice for **Axi Proxy Companion**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-PROXY-COMPANION-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Proxy Companion. |
| Acceptance | `docs/content/{en,zh}/projects/axi-proxy-companion/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-PROXY-COMPANION-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-proxy-companion` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
