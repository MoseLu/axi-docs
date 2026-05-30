---
id: audit-github-repo-convergence-2026-05-30
title: GitHub Repository Convergence Audit 2026-05-30
type: audit
status: current
tags: [workspace, github, convergence, repositories]
created: 2026-05-30
modified: 2026-05-30
agent-readable: true
---

# GitHub Repository Convergence Audit 2026-05-30

## Scope

This audit records the GitHub-side convergence pass for `MoseLu/*` repositories after workspace owner normalization.

Source snapshot:

- GitHub owner: `MoseLu`
- Total repositories: 42
- Active / unarchived repositories: 14
- Archived repositories: 28
- Local governance source: `/Volumes/code/workspace/infra/axi-workspace-governance/workspace.json`

Archive means "not an active repository entrypoint"; it does not delete code or erase the historical decision.

## Decision Summary

| Decision | Count | Rule |
|---|---:|---|
| retain-current-owner | 12 | Current workspace owner, product, shared provider, infra, or tool with active GitHub remote. |
| retain-migration-donor | 1 | `imap` remains unarchived until Axi Accounts / Verification Inbox migration is complete. |
| retain-external-canonical | 1 | `openclaw-gateway` remains the external canonical orchestration gateway. |
| archive-absorbed | 11 | Historical repo absorbed into a current workspace owner. |
| archive-superseded | 6 | Historical repo superseded by a renamed or consolidated owner. |
| archive-legacy | 11 | Historical product, experiment, or repo outside current registry ownership. |

Local-only current owner not represented as GitHub active repo:

- `axi-video-downloader` remains `remote_required=false` in governance.

## Retained Repositories

| Repository | Visibility | Decision | Reason | Next audit trigger |
|---|---|---|---|---|
| [axi-agent-platform](https://github.com/MoseLu/axi-agent-platform) | public | retain-current-owner | Current Axi agent runtime, task API, MCP, transport, and remote bridge owner. | If agent runtime ownership moves out of this repo. |
| [axi-docs](https://github.com/MoseLu/axi-docs) | public | retain-current-owner | Current Axi documentation hub, knowledge browser, sync surface, and docs MCP. | If docs hub is folded into Workbench. |
| [axi-image-preview](https://github.com/MoseLu/axi-image-preview) | private | retain-current-owner | Current image and wallpaper gallery preview app. | If app becomes a Workbench hosted-only surface. |
| [axi-notify](https://github.com/MoseLu/axi-notify) | private | retain-current-owner | Current Notify / Mobile relay, Android client, event inbox, and workflow contracts. | If mobile/notify owner changes. |
| [axi-proxy-companion](https://github.com/MoseLu/axi-proxy-companion) | private | retain-current-owner | Current macOS local proxy control tool. | If merged into Workbench or local proxy runtime. |
| [axi-registry](https://github.com/MoseLu/axi-registry) | private | retain-current-owner | Current local Verdaccio registry config for `@axi/*` packages. | If registry becomes generated-only inside governance. |
| [axi-tauri-starter](https://github.com/MoseLu/axi-tauri-starter) | private | retain-current-owner | Current shared Tauri starter reference. | If fully replaced by `axi-ui` or app-scaffold packages. |
| [axi-ui](https://github.com/MoseLu/axi-ui) | private | retain-current-owner | Current shared UI runtime packages and brand tokens. | If packages move into a larger shared monorepo. |
| [axi-workbench](https://github.com/MoseLu/axi-workbench) | public | retain-current-owner | Current control plane, dashboard host, coder, inbox, fleet, docs search, and app CLI owner. | If any hosted app is split back out. |
| [axi-workspace-governance](https://github.com/MoseLu/axi-workspace-governance) | private | retain-current-owner | Current workspace registry, catalog, audit scripts, and generated docs owner. | If governance source of truth moves. |
| [ielts-vocab](https://github.com/MoseLu/ielts-vocab) | public | retain-current-owner | Independent non-Axi product with web, backend, ASR, and study workflows. | If product is retired or moved out of workspace. |
| [sports-management-app](https://github.com/MoseLu/sports-management-app) | public | retain-current-owner | Independent sports management web, mobile, and backend product. | If product is retired or renamed. |
| [imap](https://github.com/MoseLu/imap) | private | retain-migration-donor | Verification inbox / IMAP / OAuth donor retained until Axi Accounts migration completes. | Archive only after migration exit criteria below pass. |
| [openclaw-gateway](https://github.com/MoseLu/openclaw-gateway) | private | retain-external-canonical | External canonical OpenClaw orchestration gateway recorded in governance. | Re-audit if Axi Agent Platform replaces this external canonical role. |

## Archived Repositories

| Repository | Visibility | Decision | Reason |
|---|---|---|---|
| [app-search-system](https://github.com/MoseLu/app-search-system) | private | archive-absorbed | Absorbed into `axi-workbench/apps/app-search-system`. |
| [axi-coder](https://github.com/MoseLu/axi-coder) | private | archive-absorbed | Absorbed into `axi-workbench/apps/axi-coder`. |
| [axi-deploy](https://github.com/MoseLu/axi-deploy) | public | archive-legacy | Legacy deployment repo outside current workspace registry. |
| [axi-project-dashboard](https://github.com/MoseLu/axi-project-dashboard) | public | archive-legacy | Legacy dashboard superseded by `axi-workbench` dashboard surfaces. |
| [axi-rag](https://github.com/MoseLu/axi-rag) | public | archive-legacy | Legacy RAG project; knowledge/docs owner is now `axi-docs`. |
| [axi-star-cloud](https://github.com/MoseLu/axi-star-cloud) | public | archive-legacy | Legacy Axi product outside current workspace registry. |
| [axi-todo](https://github.com/MoseLu/axi-todo) | private | archive-absorbed | Absorbed into `axi-agent-platform/tools/axi-todo`. |
| [axi-workspace-app](https://github.com/MoseLu/axi-workspace-app) | public | archive-absorbed | Android workspace donor absorbed into `axi-notify`. |
| [btc-saas](https://github.com/MoseLu/btc-saas) | public | archive-legacy | Legacy BTC product outside current workspace registry. |
| [btc-shopflow-monorepo](https://github.com/MoseLu/btc-shopflow-monorepo) | public | archive-legacy | Historical Vue / qiankun skeleton, not an active product. |
| [chat-storm](https://github.com/MoseLu/chat-storm) | public | archive-legacy | Legacy chat experiment outside current workspace registry. |
| [codex-remote-bridge](https://github.com/MoseLu/codex-remote-bridge) | private | archive-absorbed | Absorbed into `axi-agent-platform/infra/codex-remote-bridge`. |
| [design-system](https://github.com/MoseLu/design-system) | public | archive-superseded | Superseded by `axi-ui` shared runtime. |
| [devsvc-dashboard](https://github.com/MoseLu/devsvc-dashboard) | private | archive-absorbed | Absorbed into `axi-workbench/apps/devsvc-dashboard`. |
| [enterprise-workspace](https://github.com/MoseLu/enterprise-workspace) | public | archive-superseded | Legacy workspace superseded by current governance and graph. |
| [feiyu-agentflow](https://github.com/MoseLu/feiyu-agentflow) | public | archive-absorbed | Donor material absorbed into `axi-notify`. |
| [fleet-console](https://github.com/MoseLu/fleet-console) | private | archive-absorbed | Absorbed into `axi-workbench/infra/fleet-console`. |
| [glass-style](https://github.com/MoseLu/glass-style) | private | archive-legacy | Legacy visual style experiment; harvest into `axi-ui` only if needed. |
| [info-hub-project](https://github.com/MoseLu/info-hub-project) | private | archive-legacy | Legacy info hub project outside current workspace registry. |
| [mcp-swarm](https://github.com/MoseLu/mcp-swarm) | public | archive-absorbed | Legacy MCP swarm work covered by `axi-agent-platform` MCP/runtime boundaries. |
| [multi-agent](https://github.com/MoseLu/multi-agent) | public | archive-absorbed | Legacy multi-agent work covered by `axi-agent-platform` transport/runtime boundaries. |
| [ollama-menu-assistant](https://github.com/MoseLu/ollama-menu-assistant) | private | archive-absorbed | Absorbed into `axi-workbench/apps/ollama-menu-assistant`. |
| [openclaw-multi-agent-system](https://github.com/MoseLu/openclaw-multi-agent-system) | private | archive-legacy | Legacy OpenClaw experiment; current external canonical is `openclaw-gateway`. |
| [proxy-companion](https://github.com/MoseLu/proxy-companion) | private | archive-superseded | Superseded by `axi-proxy-companion`. |
| [sports-app](https://github.com/MoseLu/sports-app) | public | archive-superseded | Legacy sports app superseded by `sports-management-app`. |
| [tauri-starter](https://github.com/MoseLu/tauri-starter) | private | archive-superseded | Superseded by `axi-tauri-starter`. |
| [workspace-enterprise-governance](https://github.com/MoseLu/workspace-enterprise-governance) | private | archive-superseded | Superseded by `axi-workspace-governance`. |
| [agent-desktop](https://github.com/MoseLu/agent-desktop) | public | archive-legacy | Historical desktop experiment superseded by Axi Coder / Workbench / Agent owners. |

## `imap` Exit Criteria

Keep `imap` unarchived until all of these are true:

1. Axi Accounts or Axi Verification Inbox has a chosen owner path.
2. The replacement owner exposes equivalents for `listInboxAccounts`, `beginAuthorization`, `completeAuthorization`, and `receiveCode`.
3. Equivalent tests cover Outlook device flow, identity mismatch, IMAP validation, and freshness polling.
4. Credential storage uses credential refs / secret refs only; no plaintext token/password migration into docs or registry.
5. Docs are updated to point users at the replacement owner, then GitHub `imap` can be archived.

## `openclaw-gateway` Exit Criteria

Keep `openclaw-gateway` unarchived while governance marks it as the external canonical orchestration gateway.

Archive only if:

1. Axi Agent Platform or another current owner takes over the orchestration role.
2. `workspace.json`, generated catalog, and integration map remove the external canonical dependency.
3. Any dependent scripts or operators have a replacement path.

## Verification

- `gh repo list MoseLu --limit 300 --json name,description,isArchived,visibility,pushedAt,url`
- `pnpm workspace:audit`
- `/Volumes/code/workspace/scripts/workspace-project validate`
