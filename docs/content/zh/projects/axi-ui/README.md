---
id: axi-docs-zh-projects-axi-ui
title: Axi UI
type: project
status: draft
tags: [Axi Docs, Projects, shared, shared]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi UI
graph-tags: [Projects, shared]
description: Axi brand tokens, shared core primitives, dashboard shell, settings, CRUD, widgets, and addon runtime packages.
project:
  id: axi-ui
  partition: shared
  path: /Volumes/code/workspace/shared/axi-ui
  source-section: shared
---

# Axi UI

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/shared/axi-ui`.
> Section: shared / Partition: `shared/`.

## Summary

Axi brand tokens, shared core primitives, dashboard shell, settings, CRUD, widgets, and addon runtime packages.

## Stack

pnpm, TypeScript, React, Ant Design

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi UI".
- Project root: `/Volumes/code/workspace/shared/axi-ui`
- Project `AGENTS.md`: `/Volumes/code/workspace/shared/axi-ui/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/shared/axi-ui/README.md` (when present).

## Notes

Shared runtime only, not a product project; publishes `@axi/*` packages to the local registry.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
