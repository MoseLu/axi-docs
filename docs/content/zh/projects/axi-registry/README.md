---
id: axi-docs-zh-projects-axi-registry
title: Axi Local Registry
type: project
status: draft
tags: [Axi Docs, Projects, infra, shared]
created: 2026-06-11
modified: 2026-06-11
graph-title: Axi Local Registry
graph-tags: [Projects, infra]
description: Local-only Verdaccio registry for authenticated publication and local consumption of @axi/* runtime packages.
project:
  id: axi-registry
  partition: infra
  path: /Volumes/code/workspace/infra/axi-registry
  source-section: shared
---

# Axi Local Registry

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/infra/axi-registry`.
> Section: shared / Partition: `infra/`.

## Summary

Local-only Verdaccio registry for authenticated publication and local consumption of @axi/* runtime packages.

## Stack

_Stack not recorded in WORKSPACE_INDEX.md._

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Local Registry".
- Project root: `/Volumes/code/workspace/infra/axi-registry`
- Project `AGENTS.md`: `/Volumes/code/workspace/infra/axi-registry/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/infra/axi-registry/README.md` (when present).

## Notes

_No notes._

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
