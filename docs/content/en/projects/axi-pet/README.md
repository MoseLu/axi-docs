---
id: axi-docs-en-projects-axi-pet
title: Axi Pet
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Pet
graph-tags: [Projects, projects]
description: Local Axi pet/virtual companion project migrated from moeru-ai/airi, with stage-web, Live2D, provider configuration, and local STT experiments.
project:
  id: axi-pet
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet
  source-section: core
---

# Axi Pet

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/projects/axi-pet`.
> Section: core / Partition: `projects/`.

## Summary

Local Axi pet/virtual companion project migrated from moeru-ai/airi, with stage-web, Live2D, provider configuration, and local STT experiments.

## Stack

Vue, TypeScript, Vite, Electron, Pinia, Live2D, Python

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Pet".
- Project root: `/Volumes/code/workspace/projects/axi-pet`
- Project `AGENTS.md`: `/Volumes/code/workspace/projects/axi-pet/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/projects/axi-pet/README.md` (when present).

## Notes

Local workspace project renamed at the directory level; upstream package and brand identifiers may still say AIRI until a separate product rename pass.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
