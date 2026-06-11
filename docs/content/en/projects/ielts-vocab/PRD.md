---
id: axi-docs-en-projects-ielts-vocab
title: IELTS Vocabulary
type: project
status: draft
tags: [Axi Docs, Projects, products, reference]
created: 2026-06-11
modified: 2026-06-11
graph-title: IELTS Vocabulary
graph-tags: [Projects, products]
description: Full-stack IELTS vocabulary learning product with web, mobile, shared client packages, gateway, split backend services, speech, and production operations.
project:
  id: ielts-vocab
  partition: products
  path: /Volumes/code/workspace/products/ielts-vocab
  source-section: reference
---

# IELTS Vocabulary — PRD Slice

> Axi Docs PRD slice for **IELTS Vocabulary**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-IELTS-VOCAB-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for IELTS Vocabulary. |
| Acceptance | `docs/content/{en,zh}/projects/ielts-vocab/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONE.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-IELTS-VOCAB-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=ielts-vocab` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
