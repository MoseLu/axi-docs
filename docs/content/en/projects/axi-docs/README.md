---
id: axi-docs-en-projects-axi-docs
title: Axi Docs
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Docs
graph-tags: [Projects, projects]
description: Active Axi documentation hub for docs browsing, sync surfaces, knowledge graph UI, and MCP document access.
project:
  id: axi-docs
  partition: projects
  path: /Volumes/code/workspace/projects/axi-docs
  source-section: core
---

# Axi Docs

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/projects/axi-docs`.
> Section: core / Partition: `projects/`.

## Summary

Active Axi documentation hub for docs browsing, sync surfaces, knowledge graph UI, and MCP document access.

## Stack

React, TypeScript, Vite, Node.js, MCP, Markdown

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Docs".
- Project root: `/Volumes/code/workspace/projects/axi-docs`
- Project `AGENTS.md`: `/Volumes/code/workspace/projects/axi-docs/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/projects/axi-docs/README.md` (when present).

## Notes

Canonical active project; application code lives in `app/`.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
