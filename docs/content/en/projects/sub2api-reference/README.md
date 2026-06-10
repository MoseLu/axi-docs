---
id: axi-docs-en-projects-sub2api-reference
title: Sub2API Reference
type: project
status: draft
tags: [Axi Docs, Projects, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: Sub2API Reference
graph-tags: [Projects, references]
description: Reference AI API gateway platform for subscription quota distribution; consumed only as a provider/model-source reference for Axi Model Gateway.
project:
  id: sub2api-reference
  partition: references
  path: /Volumes/code/workspace/references/sub2api
  source-section: reference
---

# Sub2API Reference

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/references/sub2api`.
> Section: reference / Partition: `references/`.

## Summary

Reference AI API gateway platform for subscription quota distribution; consumed only as a provider/model-source reference for Axi Model Gateway.

## Stack

Go, Vue, PostgreSQL, Redis, Docker

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Sub2API Reference".
- Project root: `/Volumes/code/workspace/references/sub2api`
- Project `AGENTS.md`: `/Volumes/code/workspace/references/sub2api/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/references/sub2api/README.md` (when present).

## Notes

Upstream third-party service repo; not an Axi owner or Axi application.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
