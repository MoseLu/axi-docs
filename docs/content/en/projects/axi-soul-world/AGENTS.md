---
id: axi-docs-en-projects-axi-soul-world
title: Axi Soul World
type: project
status: active
tags: [Axi Docs, Projects, products, core]
created: 2026-08-23
modified: 2026-08-23
graph-title: Axi Soul World
graph-tags: [Projects, products]
description: Local-first cross-runtime product line for the Axi Soul World — Axi Mood (Android private journal), Axi Auth helper, and the canonical BACKEND_CONTRACT boundary.
project:
  id: axi-soul-world
  partition: products
  path: /Volumes/code/workspace/products/axi-soul-world
  source-section: core
---

# Axi Soul World Agent Guide

## Scope

This guide covers the canonical Axi Soul World product at
`/Volumes/code/workspace/products/axi-soul-world`. The product owns the
cross-runtime contract and local-first runtime boundary; `Axi Mood` is the
current Android record module and an access surface, not the whole product.

## Read Order

1. `AGENTS.md`
2. `README.md`
3. `docs/HANDOFF.md`
4. `PRD.md`, `BACKEND_CONTRACT.md`, and `BACKEND_ARCHITECTURE_PLAN.md`
5. The touched Android, Rust, or contract manifest

## Boundaries

- Preserve the existing product history and unrelated working-tree changes.
- Keep `main` production-ready and use `dev` for integration work.
- Create short-lived `feature/*`, `fix/*`, `bugfix/*`, `hotfix/*`, `debug/*`,
  `codex/*`, or `agent/*` branches for focused work; do not commit routine
  changes directly to `main`.
- Android UI and adapters must respect the product contracts; do not add a
  second business-data authority inside a screen or Activity.
- Do not commit secrets, local device configuration, build outputs, logs,
  credentials, or generated dependency trees.
- The former incubation checkout at
  `/Volumes/code/workspace/incubator/axi-soul-world` is retained as rollback
  evidence until the owner explicitly retires it.

## Request Defaults

- Start with `git status --short --branch`, the current diff, and the nearest
  project contract before editing.
- Make ordinary development changes on `dev` or a focused topic branch, then
  merge to `main` only through review and verification.
- Keep local-first behavior explicit: remote sync, backup, export, and sharing
  are opt-in boundaries until their contracts are implemented and verified.
- Report build, test, device, and runtime evidence separately; a successful
  compile is not evidence of a complete Android user journey.

## Verification

Run the smallest applicable set for the touched surface:

```bash
git diff --check
cd axi-mood-app/android && ./gradlew :app:checkDesignTokens
cd axi-mood-app/android && ./gradlew :app:testDebugUnitTest
cargo test --manifest-path axi-auth-helper/Cargo.toml
```

Workspace registration and handoff checks are run from the workspace
governance repository after registry changes.
