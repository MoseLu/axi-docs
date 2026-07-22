---
id: axi-docs-zh-projects-axi-pet-desktop
title: Axi Pet Desktop
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Pet Desktop
graph-tags: [Projects, projects]
description: Independent Electron desktop monorepo extracted from axi-pet on 2026-06-18 (former apps/stage-tamagotchi). Owns the macOS-first desktop-pet app and a self-contained set of Stage/electron/contract packages. Namespace locked to @axi-pet-desktop/* (legacy @proj-airi/* packages migrated 2026-07-17). Remote publication pending owner sign-off (see remote_decision_pending). Lineage: fork of axi-pet, sharing the moeru-ai/airi upstream.
project:
  id: axi-pet-desktop
  partition: projects
  path: /Volumes/code/workspace/projects/axi-pet-desktop
  source-section: core
---

# Axi Pet Desktop — TODO

> Dossier TODO. Tracks what Axi Docs still needs to surface for this project.

## P0

- [ ] Confirm project root `AGENTS.md` / `README.md` still exist and match `WORKSPACE_INDEX.md`.
- [ ] Surface canonical verification commands (read from project `AGENTS.md` or `package.json`).

## P1

- [ ] Capture first-party MCP tool mapping if the project exposes one (e.g. `axi_docs_*` adapters, `workspace-project` consumer).
- [ ] Link to active consumers via `workspace.graph.json` (`workspace-project consumers <id>`).

## P2

- [ ] Add a thumbnail or icon if the project is a Dashboard app.
- [ ] Cross-link to Axi Rules entry (`rules/<family>/AGENTS.md`) when behavior rules reference this project.

## Out of Scope

- Project-internal TODOs live in the project root, not here.
