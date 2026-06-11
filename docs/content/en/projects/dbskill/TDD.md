---
id: axi-docs-en-projects-dbskill
title: dbskill — TDD Slice
type: project
status: draft
tags: [Axi Docs, Projects, shared, dbskill]
created: 2026-06-10
modified: 2026-06-10
graph-title: dbskill
graph-tags: [Projects, shared]
description: Axi Docs TDD slice for the dbskill mirror.
project:
  id: dbskill
  partition: shared
  path: /Volumes/code/workspace/shared/dbskill
  source-section: shared
  mirror-strategy: hand-curated
  reason-not-in-build-script: not listed in WORKSPACE_INDEX.md
---

# dbskill — TDD Slice

> Axi Docs TDD slice for **dbskill**. Describes the test design for the dossier itself, not the project.

## Unit checks

- `docs/content/{en,zh}/projects/dbskill/{README,AGENTS,INDEX,TODO,MILESTONE,PRD,TDD,README.zh-CN}.md` all exist with valid frontmatter.
- The `frontmatter.project.path` matches `/Volumes/code/workspace/shared/dbskill` for both locales.

## Manual checks

- Open the dossier in the Axi Docs web app and confirm it routes under `/en/projects/dbskill` (and `/zh/...`).
- Verify the knowledge graph renders a node for this project (graph-title and graph-tags must be unique enough).

## Failure modes

- Missing piece → visible in the dossier folder listing.
- Stale project root path → update the dossier frontmatter directly; there is no auto-source.
