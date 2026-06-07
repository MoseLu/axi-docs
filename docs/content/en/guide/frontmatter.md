---
id: axi-docs-en-guide-frontmatter
title: Frontmatter
type: guide
status: published
tags: [Axi Docs, frontmatter, metadata, English]
created: 2026-06-07
modified: 2026-06-07
graph-title: Frontmatter
graph-tags: [Axi Docs, Metadata]
description: Configure document titles, descriptions, tags, dates, and knowledge graph labels.
---

## Common fields

- `id`: stable document identifier.
- `title`: page title and default search title.
- `type`: content kind such as `guide`, `skill`, or `project`.
- `status`: content state such as `draft` or `published`.
- `tags`: values used by search, filtering, and relationships.
- `description`: summary for lists and search results.
- `created`, `modified`: creation and update dates.
- `graph-title`, `graph-tags`: labels used by knowledge graph views.

## Example

```yaml
---
id: axi-docs-en-guide-search
title: Search and Indexing
type: guide
status: published
tags: [Axi Docs, search, English]
created: 2026-06-06
modified: 2026-06-07
description: Understand global search and its result page.
---
```

## Authoring rules

Use words readers will search for in titles and descriptions. Keep tags focused and reuse stable values. Locale pages may use distinct document ids, but their relative file paths must match.
