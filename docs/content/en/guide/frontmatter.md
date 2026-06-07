---
id: axi-docs-en-guide-frontmatter
title: Frontmatter
type: guide
status: published
tags: [Axi Docs, frontmatter, metadata, English]
created: 2026-06-07
modified: 2026-06-08
graph-title: Frontmatter
graph-tags: [Axi Docs, Metadata]
description: Configure document titles, descriptions, tags, dates, and knowledge graph labels.
---

## Common fields

- `id`: stable and unique document identifier.
- `title`: page title and default search title.
- `type`: content kind such as `guide`, `skill`, or `project`.
- `status`: content state such as `draft` or `published`.
- `tags`: labels used by search, filtering, and relationship building.
- `description`: summary for listings, search results, and page abstracts.
- `created`, `modified`: creation and last-modified dates.
- `graph-title`, `graph-tags`: display title and labels used by the knowledge graph.

## Example

```yaml
---
id: axi-docs-en-guide-search
title: Search and Indexing
type: guide
status: published
tags: [Axi Docs, search, indexing]
created: 2026-06-06
modified: 2026-06-07
graph-title: Search and Indexing
graph-tags: [Axi Docs, search]
description: Understand the global search matching scope and result page.
---
```

## Authoring principles

Titles and descriptions should use words readers will actually search for. Keep the tag count restrained, and reuse stable tags for the same topic. Bilingual pages may use distinct document `id` values, but the relative file paths must stay aligned.
