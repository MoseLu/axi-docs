---
id: axi-docs-en-projects-axi-notify-mobile
title: Axi Notify / Mobile
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Notify / Mobile
graph-tags: [Projects, projects]
description: Canonical Axi notify/mobile monorepo for relay, Android client, event inbox, mobile workbench, and donor migration material.
project:
  id: axi-notify-mobile
  partition: projects
  path: /Volumes/code/workspace/projects/axi-notify
  source-section: core
---

# Axi Notify / Mobile

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/projects/axi-notify`.
> Section: core / Partition: `projects/`.

## Summary

Canonical Axi notify/mobile monorepo for relay, Android client, event inbox, mobile workbench, and donor migration material.

## Stack

Android, Kotlin, Jetpack Compose, Go, SQLite, Firebase

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Notify / Mobile".
- Project root: `/Volumes/code/workspace/projects/axi-notify`
- Project `AGENTS.md`: `/Volumes/code/workspace/projects/axi-notify/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/projects/axi-notify/README.md` (when present).

## Notes

Absorbed former standalone donor roots `android-workspace-app` and `feiyu-agentflow`; legacy repo/package identifiers may remain until install/data migration is planned.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
