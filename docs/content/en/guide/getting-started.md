---
id: axi-docs-en-guide-getting-started
title: Getting Started
type: guide
status: published
tags: [Axi Docs, guide, English]
created: 2026-06-06
modified: 2026-06-07
graph-title: Getting Started
graph-tags: [Axi Docs, Guide]
description: Start Axi Docs and learn the basic Guide, Skills, Workspace, and search workflow.
---

## Start the local site

Install dependencies and start the app from the repository root:

```bash
pnpm --dir app install
pnpm --dir app dev
```

Open the local URL printed by Vite. Changes under `docs/content/` or `app/src/` refresh the development page.

## Navigate the documentation

1. Use top navigation to switch between **Guide**, **Skills**, and **Workspace**.
2. Use the grouped left sidebar to select a page in the current set.
3. Use the right outline to jump to a heading on the current page.
4. Use the previous and next links at the bottom to continue reading.

## Search documents

Click the search control or press `⌘K`. Search matches titles, descriptions, paths, tags, and body content. Submitting a query opens [Search and Indexing](/en/guide/search) with the matching documents.

## Verify changes

```bash
pnpm --dir app test:run
pnpm --dir app lint
pnpm --dir app verify
```

`verify` currently runs TypeScript checks and the Vite production build. Review document structure and mirrored locale paths separately.
