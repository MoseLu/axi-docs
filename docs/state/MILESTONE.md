# Axi Docs Milestone

<!-- deep-init:layer=L3 -->

## M1: Project Documentation Contract

- Status: in progress
- Goal: Axi Docs has a project-local L1/L2/L3 documentation chain and a manifest that only references real files.
- Evidence:
  - `.claude/PARADIGM.md`
  - `.claude/ARCHITECTURE.md`
  - `docs/project-docs.manifest.json`
  - `pnpm --dir app docs:check`

## M2: Workspace Registry Coverage

- Status: in progress
- Goal: the `workspace` knowledge source exposes project rows, root operator docs, `.claude` contracts, and `workspace.graph.json` contract nodes.
- Evidence:
  - `app/src/lib/knowledgeBase.ts`
  - `app/src/lib/knowledgeBase.test.ts`
  - `pnpm --dir app test:run`

## M3: VitePress-Aligned Reader Experience

- Status: active
- Goal: guide navigation, code blocks, link styles, and document reading layout stay aligned with the VitePress reference while preserving Axi Docs source adapters.
- Evidence:
  - `docs/content/{en,zh}`
  - reader component tests
  - browser desktop and mobile smoke checks

## M4: Source Governance

- Status: active
- Goal: external documentation inputs are locked, checkable, and CI-reproducible without git submodules.
- Evidence:
  - `docs/sources.lock.json`
  - `app/scripts/check-source-locks.mjs`
  - `.github/workflows/axi-ci.yml`
  - `app/.github/workflows/ci.yml`

<!-- MANUAL: keep milestone statuses evidence-backed; do not mark complete without a fresh command or artifact. -->
