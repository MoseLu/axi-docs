---
id: axi-docs-en-projects-ielts-vocabulary
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, Projects, products, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: IELTS Vocabulary
graph-tags: [Projects, products]
description: IELTS vocabulary learning app, backend services, frontend, deploy and learning workflows.
project:
  id: ielts-vocabulary
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: core
---

# IELTS Vocabulary

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/products/ielts-vocab`.
> Section: core / Partition: `products/`.

## Summary

IELTS vocabulary learning app, backend services, frontend, deploy and learning workflows.

## Stack

React, TypeScript, Vite, Flask, SQLite, microservices

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "IELTS Vocabulary".
- Project root: `/Volumes/code/workspace/products/ielts-vocab`
- Project `AGENTS.md`: `/Volumes/code/workspace/products/ielts-vocab/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/products/ielts-vocab/README.md` (when present).

## Notes

AxiomaticWorld spun-out product; sits under AxiomaticWorld governance but outside the `Axi` product line, the way Fliggy / Tmall sit under Alibaba Group. Static IELTS PDFs/audio live in `reference-materials/raw/` and are gitignored.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
