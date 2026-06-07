---
id: axi-docs-content-root
title: Axi Docs 内容根
type: index
status: active
tags: [Axi Docs, i18n, content]
created: 2026-06-06
modified: 2026-06-06
graph-title: Axi Docs Content Root
graph-tags: [Axi Docs, i18n]
description: Axi Docs 站点的按语言组织的 Markdown 内容根。
---

# Axi Docs 内容根

本目录是 Axi Docs 的 Markdown 内容平面。

## 语言布局

- `en/` 是源语言（英文）文档树。
- `zh/` 是简体中文翻译树。

请保证不同语言下的同名页面保持一致的相对路径。例如：

- `en/guide/getting-started.md`
- `zh/guide/getting-started.md`

React 应用会把本地化后的指南页面路由为 `/en/guide/*` 与 `/zh/guide/*`，而知识索引则分别读取语言特定源 `axi-docs-en` 与 `axi-docs-zh`。
