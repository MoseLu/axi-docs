---
id: axi-docs-zh-projects-axi-video-downloader
title: Axi Video Downloader
type: project
status: draft
tags: [Axi Docs, Projects, tools, reference]
created: 2026-07-22
modified: 2026-07-22
graph-title: Axi Video Downloader
graph-tags: [Projects, tools]
description: Local Python tool that coordinates a Flask UI, Android device automation, mitmproxy capture, downloads, and SQLite tracking for personal-device video capture.
project:
  id: axi-video-downloader
  partition: tools
  path: /Volumes/code/workspace/tools/axi-video-downloader
  source-section: reference
---

# Axi Video Downloader — TDD Slice

> Axi Docs TDD slice for **Axi Video Downloader**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `pnpm --dir app projects:check` walks `docs/content/{en,zh}/projects/axi-video-downloader/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` and asserts every expected piece exists with valid frontmatter.
- `pnpm --dir app projects:check --project=axi-video-downloader` runs the same checks scoped to this project.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/axi-video-downloader` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → `projects:check` exits non-zero with the missing path in the error.
- Stale purpose statement → re-run `projects:build` to regenerate from `WORKSPACE_INDEX.md`.
- Stale project root path → update `WORKSPACE_INDEX.md` first; the dossier follows.
