---
id: axi-docs-en-projects-image2prompt-reference
title: Image2Prompt Reference
type: project
status: draft
tags: [Axi Docs, Projects, references, reference]
created: 2026-06-10
modified: 2026-06-10
graph-title: Image2Prompt Reference
graph-tags: [Projects, references]
description: Browser-extension reference for image-to-prompt UX and visual prompting workflows.
project:
  id: image2prompt-reference
  partition: references
  path: /Volumes/code/workspace/references/image2prompt
  source-section: reference
---

# Image2Prompt Reference — PRD Slice

> Axi Docs PRD slice for **Image2Prompt Reference**. This is *not* the project PRD; it captures Axi Docs's own requirements for presenting this project.

## REQ-PROJ-IMAGE2PROMPT-REFERENCE-001

| Field | Value |
| --- | --- |
| Requirement | Maintain a discoverable Axi Docs dossier for Image2Prompt Reference. |
| Acceptance | `docs/content/{en,zh}/projects/image2prompt-reference/README.md, AGENTS.md, INDEX.md, TODO.md, MILESTONES.md, PRD.md, TDD.md` exist with valid frontmatter. |
| Source | `WORKSPACE_INDEX.md` (workspace policy). |

## REQ-PROJ-IMAGE2PROMPT-REFERENCE-002

| Field | Value |
| --- | --- |
| Requirement | Dossier reflects the canonical workspace path, partition, and purpose statement. |
| Acceptance | `pnpm --dir app projects:check --project=image2prompt-reference` succeeds. |
| Source | `WORKSPACE_INDEX.md` partition table. |

## Non-Goals

- Axi Docs does not own the project; it only indexes it.
- Axi Docs does not duplicate the project's internal design, tests, or roadmap.
