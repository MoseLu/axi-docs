---
id: axi-docs-zh-projects-axi-feishu-codex-bridge
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

# Axi Feishu Codex Bridge

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/tools/axi-feishu-codex-bridge`.
> Section: core / Partition: `tools/`.

## Summary

Local Feishu IM bridge for routing bot messages to Codex CLI, Codex App, or Codex Plus CDP with axi-rules memory integration.

## Stack

Python, FastAPI, Feishu OpenAPI, WebSocket, PostgreSQL, Ollama

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Feishu Codex Bridge".
- Project root: `/Volumes/code/workspace/tools/axi-feishu-codex-bridge`
- Project `AGENTS.md`: `/Volumes/code/workspace/tools/axi-feishu-codex-bridge/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/tools/axi-feishu-codex-bridge/README.md` (when present).

## Notes

Source project only; runtime install and secrets stay under `/Users/mose/.local/share/codex-feishu-bridge`.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
