---
id: axi-docs-en-projects-axi-agent-platform
title: Axi Agent Platform
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Agent Platform
graph-tags: [Projects, projects]
description: Canonical Axi agent monorepo for runtime/API surfaces, MCP service, terminal transport, Codex remote bridge, and Axi Todo.
project:
  id: axi-agent-platform
  partition: projects
  path: /Volumes/code/workspace/projects/axi-agent-platform
  source-section: core
---

# Axi Agent Platform

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/projects/axi-agent-platform`.
> Section: core / Partition: `projects/`.

## Summary

Canonical Axi agent monorepo for runtime/API surfaces, MCP service, terminal transport, Codex remote bridge, and Axi Todo.

## Stack

Python, FastAPI, React, TypeScript, Node.js, MCP, WebSocket

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Agent Platform".
- Project root: `/Volumes/code/workspace/projects/axi-agent-platform`
- Project `AGENTS.md`: `/Volumes/code/workspace/projects/axi-agent-platform/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/projects/axi-agent-platform/README.md` (when present).

## Notes

Absorbed former standalone roots `infra/axi-agent-mcp`, `infra/axi-agent-transport`, `infra/codex-remote-bridge`, and `tools/axi-todo`.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
