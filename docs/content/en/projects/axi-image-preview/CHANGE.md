---
id: axi-docs-en-projects-axi-image-preview
title: Axi Image Preview
type: project
status: draft
tags: [Axi Docs, Projects, projects, core]
created: 2026-06-10
modified: 2026-06-10
graph-title: Axi Image Preview
graph-tags: [Projects, projects]
description: Active Axi image and wallpaper gallery preview app for visual reference, hover/detail interaction, and preview experiments.
project:
  id: axi-image-preview
  partition: projects
  path: /Volumes/code/workspace/projects/axi-image-preview
  source-section: core
---

# Axi Image Preview Change Log

This file records project-level development changes before they are promoted into a release-facing UI changelog.

Rules:
- Update this file before every feature commit.
- Also update the nearest feature-level `CHANGE.md` for changed code under `src/features/**`.
- Do not use this file as the source for the in-app changelog. The in-app changelog is release-facing and should only change when a SemVer version is prepared.

## 2026-06-10

### Changed
- Release flow now uses `release/manifest.json` as the single source of truth for app changelog entries, GitHub tags, GitHub Release notes, release reason, verification, and rollback guidance.
- CI now runs release manifest validation so package version, MCP serverInfo, in-app changelog, and GitHub tag strings cannot drift apart.
- Topbar and every gallery category now share one stable desktop content rail, preventing width jumps while keeping their outer edges aligned.
- Add-wallpaper now uses one large source drop zone for file picking, drag-and-drop, and pasted media links, without a separate visible link input.
- Add-wallpaper footer actions now stay right-aligned and vertically centered without the extra automatic-processing helper text.
- Add-wallpaper now has a bottom-right submit action for the current new collection, allowing an empty collection to be created from the upload panel before any image is added.
- Menu and upload surfaces now use shared semantic surface, text, border, shadow, and status tokens, with stronger light-theme panel depth so the app menu no longer renders as either a dark modal or a flat white sheet.
- Theme switching now preserves top spacing and filter-toolbar geometry so the logo, top navigation, menu button, and filter controls do not jump while colors change.
- Add-wallpaper progress now shows an explicit percentage, keeps the right pane focused on the current image preview, and silently treats exact duplicates as background-processed items instead of showing a duplicate warning in the detail area.
- Vite dev API now mirrors the macOS app server collection mutation routes, so my-wallpaper collection rename and item moves persist while running the local browser dev server.
- Upload notifications now allow clearing all ended jobs, including stale failed recognition tasks left after an external batch rerun has already updated the wallpaper data.
- Local wallpaper upload recognition now uses `qwen3-vl:32b-instruct` instead of the older 8B Ollama vision model so installed local recognition matches the higher-quality instruct model.
- My-wallpaper collection covers now render video items with a video element so video-only collections can show a playable first-frame preview instead of a broken image.
- Sparse desktop-like galleries now keep standard card width instead of stretching a single collection item across the viewport.
- Sparse and compact galleries now keep the filter toolbar directly after the actual image grid instead of pushing it to the bottom of the viewport.

## 2026-06-09

### Changed
- Upload recognition now prefers concrete, searchable visual tags and filters abstract mood words from both model output and saved tag groups.
- Existing my-wallpaper items are normalized on read so previously saved source-site and vague mood tags no longer leak into the gallery display.
- Existing my-wallpaper data was repaired to remove source-site labels, orientation-only labels, camera filename tokens, and other low-information upload tags from stored tag payloads.
- Add-wallpaper now treats image files and remote media links as sources for one automatic background pipeline. The right panel focuses on preview, collection target, tags, and processing state instead of exposing manual recognize/submit decisions.
- Upload menu no longer shows two equivalent image selection entry points. The left upload panel remains the single file selection entry, while the right preview panel now shows a passive waiting state.
- Background upload jobs now rebind their target collection when the user switches from an existing collection to a new collection before the actual submit starts.
- My-wallpaper collection galleries now expose a right-click image menu for moving a wallpaper into another existing collection.
- Added an incremental source-gallery refresh mode that merges newly fetched wallpapers by image URL without discarding the existing local library.
- Updated the source image URL parser to accept the source site's current double-slash asset path format.
