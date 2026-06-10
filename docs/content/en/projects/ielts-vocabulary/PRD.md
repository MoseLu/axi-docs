---
id: axi-docs-en-projects-ielts-vocabulary
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, Projects, products, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: IELTS Vocabulary
graph-tags: [Projects, products]
description: IELTS vocabulary learning app, backend services, frontend, deploy and learning workflows.
project:
  id: ielts-vocabulary
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: core
---

# IELTS Vocabulary — PRD Slice

> Axi Docs PRD slice for **IELTS Vocabulary**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-IELTS-VOCABULARY-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for IELTS Vocabulary. |
| Acceptance | `docs/content/{en,zh}/projects/ielts-vocabulary/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-IELTS-VOCABULARY-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=ielts-vocabulary` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
