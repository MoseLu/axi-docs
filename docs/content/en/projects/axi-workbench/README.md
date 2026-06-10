---
id: axi-docs-en-projects-axi-workbench
title: Axi Workbench
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Workbench
graph-tags: [Projects, projects]
description: Canonical Axi workbench monorepo for workstation control plane, DevSvc dashboard, Axi Coder, verification inbox, app/docs search, fleet console, Ollama menu assistant, and Axi App CLI.
project:
  id: axi-workbench
  partition: projects
  path: /Volumes/code/workspace/projects/axi-workbench
  source-section: core
---

# Axi Workbench

> Workspace project dossier. Source of truth: `/Volumes/code/workspace/projects/axi-workbench`.
> Section: core / Partition: `projects/`.

## Summary

Canonical Axi workbench monorepo for workstation control plane, DevSvc dashboard, Axi Coder, verification inbox, app/docs search, fleet console, Ollama menu assistant, and Axi App CLI.

## Stack

React, TypeScript, Tauri, Rust, Node.js, Python, Ansible, Swift

## Authoritative Documents

- Workspace entry: [`WORKSPACE_INDEX.md`](/Volumes/code/workspace/WORKSPACE_INDEX.md) — partition table row "Axi Workbench".
- Project root: `/Volumes/code/workspace/projects/axi-workbench`
- Project `AGENTS.md`: `/Volumes/code/workspace/projects/axi-workbench/AGENTS.md` (when present).
- Project `README.md`: `/Volumes/code/workspace/projects/axi-workbench/README.md` (when present).

## Notes

Absorbed former standalone roots `axi-workstation`, `axi-devsvc-dashboard`, `axi-coder`, `axi-verification-inbox`, `app-search-system`, `axi-ollama-menu-assistant`, `infra/fleet-console`, and `tools/axi-app-cli`.

## Verification (suggested)

_See project root `AGENTS.md` or `package.json` scripts for the canonical verification commands. Always run from the project directory, not from this dossier._

## Cross-References

- `docs/content/{en,zh}/guide/workspace.md` — how Axi Docs consumes the workspace index.
- `docs/content/{en,zh}/guide/routing.md` — workspace project routing.
- `app/src/config/documentSources.ts` — Axi Docs source registry.
