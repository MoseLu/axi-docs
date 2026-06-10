---
id: axi-docs-en-projects-axi-feishu-codex-bridge
title: Axi Feishu Codex Bridge
type: project
status: draft
tags: [Axi Docs, Projects, tools, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Feishu Codex Bridge
graph-tags: [Projects, tools]
description: Local Feishu IM bridge for routing bot messages to Codex CLI, Codex App, or Codex Plus CDP with axi-rules memory integration.
project:
  id: axi-feishu-codex-bridge
  partition: tools
  path: /Volumes/code/workspace/tools/axi-feishu-codex-bridge
  source-section: core
---

# Axi Feishu Codex Bridge — PRD Slice

> Axi Docs PRD slice for **Axi Feishu Codex Bridge**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-AXI-FEISHU-CODEX-BRIDGE-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Axi Feishu Codex Bridge. |
| Acceptance | `docs/content/{en,zh}/projects/axi-feishu-codex-bridge/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-AXI-FEISHU-CODEX-BRIDGE-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=axi-feishu-codex-bridge` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
