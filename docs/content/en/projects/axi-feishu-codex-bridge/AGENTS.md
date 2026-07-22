---
id: axi-docs-en-projects-axi-feishu-codex-bridge
title: Axi Feishu Codex Bridge
type: project
status: draft
tags: [Axi Docs, Projects, tools, reference]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Feishu Codex Bridge
graph-tags: [Projects, tools]
description: Local Feishu IM bridge that routes messages to Codex CLI, Codex App WebSocket, or Codex Plus CDP execution surfaces and returns replies to Feishu.
project:
  id: axi-feishu-codex-bridge
  partition: tools
  path: /Volumes/code/workspace/tools/axi-feishu-codex-bridge
  source-section: reference
---

# Axi Feishu Codex Bridge — Agent Contract

> This dossier is the Axi Docs agent contract for **Axi Feishu Codex Bridge** (workspace path: `/Volumes/code/workspace/tools/axi-feishu-codex-bridge`).
> It does not replace the project root `AGENTS.md`. The project root always wins for project-local rules; this file only documents how Axi Docs *presents* the project.

## Read Order

1. This file (dossier).
2. `docs/content/{en,zh}/projects/axi-feishu-codex-bridge/README.md` (dossier summary).
3. Project root `AGENTS.md` at `/Volumes/code/workspace/tools/axi-feishu-codex-bridge/AGENTS.md`.
4. Project root `README.md` at `/Volumes/code/workspace/tools/axi-feishu-codex-bridge/README.md`.

## Boundary

- Axi Docs treats this project as **read-only content source**.
- Axi Docs never edits files under `/Volumes/code/workspace/tools/axi-feishu-codex-bridge`.
- Modifications must be proposed back to the owning project (PR, issue, or owner handoff).

## Update Cadence

- Re-run `pnpm --dir app projects:build` whenever `WORKSPACE_INDEX.md` changes.
- Hand-edit this dossier only when Axi Docs is the *primary* surface for the change (e.g. cross-project summary, MCP tool mapping).
