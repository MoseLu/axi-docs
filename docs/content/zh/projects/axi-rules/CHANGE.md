---
id: axi-docs-zh-projects-axi-rules
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

# CHANGE.md

Project-level change log. Per `rules/verification/AGENTS.md` rule
**AR-CHANGE-001** ("CHANGE.md, changelog, feature change, release notes"),
every commit that changes behaviour updates this file plus the
nearest feature/module-level `CHANGE.md` under the changed area.

This file is **development-facing**: behaviour changes, workflow
changes, validation changes, and meaningful user-visible UI state.
Release-facing notes (SemVer bumps, git tags, marketing copy) are
**not** recorded here — that happens at release time only.

Entries are appended newest-first.

## Unreleased

### Added

- Self-index coverage for `axi-rules`: generated project routing now records
  the repository as the active constraint index, includes the `frontend/`
  entrypoints (`frontend/README.md`, `frontend/package.json`,
  `frontend/src/App.tsx`), and preserves validation commands that future agents
  can run before claiming the frontend exists or is healthy.
- `frontend/` — new Vite + TypeScript + React project that renders
  the memory recall pipeline as an interactive 3D scene (three.js,
  orthographic camera, 21 nodes across 3 lanes, fibre-optic agent).
  Build, dev, typecheck, and test scripts are wired up via `pnpm`.
  See `frontend/README.md` for the developer workflow and
  `frontend/CHANGE.md` for the per-feature entry trail.
- `frontend/README.md` — developer guide covering workflow, scripts,
  architecture (HTML overlays over a single `<canvas>` mounted by
  `<PipelineCanvas>`), responsive contract, and "how to add a node
  / a lane" recipes.
- Frontend test suite via `vitest` + `jsdom` + `@testing-library/react`:
  14 tests across 3 files covering the external store
  (`useViewStore`), the orthographic camera frustum math, and the
  `<ViewButtons />` component. Run with `pnpm test` (single pass) or
  `pnpm test:watch` (interactive).
- Continuous integration: `.github/workflows/frontend-ci.yml`
  runs `pnpm install --frozen-lockfile` → `pnpm typecheck` →
  `pnpm test` → `pnpm build` on every push and pull request that
  touches `frontend/`. Uploads `frontend/dist` as a 7-day artefact.

### Infrastructure

- `.gitignore` — added a repository-root ignore for `.omx/`,
  `.superpowers/`, IDE state, and frontend build outputs. This
  enforces the rule from `AGENTS.md`: "Do not index, cite, or
  commit `.omx`, `.git`, cache, build, or runtime state."

### Validation

- `pnpm typecheck` runs in strict mode (`strict: true`,
  `noUnusedLocals: true`, `noUnusedParameters: true`,
  `noFallthroughCasesInSwitch: true`) and passes against the entire
  source tree. CI fails the build on any new type error.
