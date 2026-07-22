---
id: axi-docs-zh-projects-axi-artboard
title: Axi Artboard
type: project
status: draft
tags: [Axi Docs, Projects, products, reference]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Artboard
graph-tags: [Projects, products]
description: AxiomaticWorld artboard/canvas product. Feature stage: React 19 + Vite 8 + TypeScript with custom vite-plugin-source-attrs + OverlayCanvas (right-click pin + left-drag marquee) + window.__artboard.targets() debug API + ambient-language anchoring for agent iteration. First real feature shipped: agent-node-picker.
project:
  id: axi-artboard
  partition: products
  path: /Volumes/code/workspace/products/axi-artboard
  source-section: reference
---

# Axi Artboard — TDD Slice

> Axi Docs TDD slice for **Axi Artboard**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-artboard/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-artboard` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-artboard` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
