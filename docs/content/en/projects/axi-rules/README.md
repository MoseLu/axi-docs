---
id: axi-docs-en-projects-axi-rules
title: Axi Rules
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Rules
graph-tags: [Projects, projects]
description: Fast local authority for Axi agent behavior, project routing, memory source precedence, verification rules, safety boundaries, and the frontend 3D memory recall pipeline.
project:
  id: axi-rules
  partition: projects
  path: /Volumes/code/workspace/projects/axi-rules
  source-section: core
---

# Axi Rules

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/projects/axi-rules`.
> Section: core / Partition: `projects/`.

## Summary

Fast local authority for Axi agent behavior, project routing, memory source precedence, verification rules, safety boundaries, and the frontend 3D memory recall pipeline.

## Stack

Markdown, JSON, Python, React, TypeScript, Vite, three.js

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Rules".
- Project root: `/Volumes/code/workspace/projects/axi-rules`
- Project `AGENTS.md`: `/Volumes/code/workspace/projects/axi-rules/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/projects/axi-rules/README.md` (when present).

## Notes

Use before `axi-docs`; frontend app lives in `frontend/` and may need a non-5173 Vite port if DevSvc is already listening.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
