---
id: reference-axi-workspace-project-completion
title: Axi Workspace Project Completion
type: reference
status: evergreen
tags: [workspace, completion, status]
created: 2026-06-11
modified: 2026-06-11
agent-readable: true
---

# Axi Workspace Project Completion

最后生成：2026-06-11

## 摘要

- 已登记项目：31
- Axi 项目：17
- 完成：1
- 可用及以上：7
- 阻塞：0

## 阶段口径

- `unassessed`：还没有足够证据，不猜完成度。
- `building`：核心能力仍在建设。
- `usable`：可被消费，但还有明确缺口。
- `near-complete`：只剩少量收尾。
- `complete`：当前目标已完成，后续只做 polish 或内容扩展。
- `maintenance`：进入维护状态。
- `blocked`：存在阻塞。
- `archived`：归档或参考状态。

## Axi 项目完成矩阵

| Project | Stage | Confidence | Docs | Evidence | Remaining |
|---|---|---|---|---|---|
| `axi-accounts` | 未评估 | 低 | missing | handoff:unready<br>verify:test -f /Volumes/code/workspace/docs/axi/AXI_ACCOUNTS_SHARED_SCHEMA.md<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 TODO.md，让待办和里程碑可审计。<br>... |
| `axi-agent` | 建设中 | 中 | ready | Workspace verify covers runtime API smoke tests plus MCP, transport, bridge, and todo packages.<br>Governance source still classifies the project as development.<br>... | Consolidate agent runtime completion evidence into project docs.<br>Keep MCP/transport/bridge consumer checks green as Axi Coder grows. |
| `axi-coder` | 建设中 | 中 | legacy | Product surface and workspace E2E contract tests define the Axi Coder capability boundary.<br>Hosted dashboard registration exposes Axi Coder under /apps/axi-coder/overview.<br>... | Keep the completion panel wired to generated workspace evidence.<br>Add native Tauri completion command only if the static snapshot stops being sufficient.<br>... |
| `axi-docs` | 可用 | 中 | partial | Workspace graph registers app verification and MCP/document contracts.<br>Workspace governance docs are mirrored into the Axi Docs source tree.<br>... | Keep generated project completion Markdown indexed in the docs hub.<br>Close existing Axi Docs TODO/security backlog before raising confidence. |
| `axi-feishu-codex-bridge` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `axi-image-preview` | 完成 | 高 | partial | README documents dev/build/preview and wallpaper MCP commands.<br>package.json exposes test, build, and mcp:wallpapers scripts.<br>... | polish/content expansion |
| `axi-model-gateway` | 可用 | 中 | legacy | ProviderProfile tests guard credential-ref routing without plaintext secrets.<br>Axi Coder proxy handles OpenAI, Claude Messages, and Gemini request shapes.<br>... | Keep gateway status as an infrastructure contract, not a separate product UI.<br>补齐 docs/project-docs.manifest.json 文档接入清单。<br>... |
| `axi-notify` | 可用 | 中 | partial | Relay and local smoke verification are registered in the workspace graph.<br>Axi Coder consumes Notify for mobile companion task and notification return paths.<br>... | Keep mobile workbench evidence and goal artifacts discoverable from project docs. |
| `axi-pet` | 未评估 | 中 | partial | Project now lives under /Volumes/code/workspace/projects/axi-pet.<br>Local verification covers stage-web, stage-ui, and stage-layouts typechecks.<br>... | Decide whether to keep upstream AIRI branding internally or run a separate package/product rename pass.<br>Promote local STT helper into a documented project script if it becomes durable. |
| `axi-proxy-companion` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `axi-registry` | 可用 | 中 | partial | Workspace graph registers registry health verification.<br>Axi UI declares the registry as its package distribution boundary.<br>... | Keep registry health visible when shared packages are published or consumed. |
| `axi-rules` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `axi-tauri-starter` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `axi-ui` | 可用 | 中 | partial | Workspace verify covers file-line guard, typecheck, and tests.<br>Axi Coder and dashboard surfaces consume linked @axi packages.<br>... | Continue additive package hardening without breaking @axi/* style/runtime contracts. |
| `axi-video-downloader` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `axi-workbench` | 建设中 | 中 | partial | DevSvc Dashboard and Axi Coder are registered as hosted workbench surfaces.<br>Workspace verify covers dashboard, Axi Coder, verification inbox, and fleet console.<br>... | Finish the project completion data and UI loop for Axi Coder.<br>Continue consolidating dashboard/control-plane documentation and evidence. |
| `axi-workspace-governance` | 可用 | 中 | partial | workspace:docs:sync generates catalog and completion docs.<br>workspace-project validate remains the root graph sanity check.<br>... | Keep generated docs, graph, and mirrored Axi Docs sources synchronized after project moves. |

## 其他纳管项目

| Project | Stage | Confidence | Docs | Evidence | Remaining |
|---|---|---|---|---|---|
| `ai-capability` | 未评估 | 低 | missing | handoff:unready<br>verify:/Users/mose/.cc-connect/bin/ai-capability status --json<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 TODO.md，让待办和里程碑可审计。<br>... |
| `blinko` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `cliproxyapi` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `cockpit-tools` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `codex-app-projects` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `comfyui` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `dbskill` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 TODO.md，让待办和里程碑可审计。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `ielts-vocab` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `image2prompt` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `minimax-tokenplan` | 未评估 | 低 | missing | handoff:unready<br>verify:/Users/mose/.cc-connect/bin/minimax-tokenplan tools<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 TODO.md，让待办和里程碑可审计。<br>... |
| `ollama-local` | 未评估 | 低 | missing | handoff:unready<br>verify:/Users/mose/.cc-connect/bin/ollama-local embed --model mxbai-embed-large:latest --text smoke<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 TODO.md，让待办和里程碑可审计。<br>... |
| `opencodex` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |
| `sports-management` | 未评估 | 低 | partial | docs:partial<br>handoff:verified<br>... | - |
| `sub2api` | 未评估 | 低 | partial | docs:partial<br>handoff:unready<br>... | 补齐 docs/project-docs.manifest.json 文档接入清单。<br>补齐 MILESTONE.md，让待办和里程碑可审计。 |

## 备注

- 完成情况来自 `workspace.graph.json` 的 `completion` 声明。
- 文档接入状态、验证命令和缺口由生成器派生，用于辅助判断，不替代项目负责人声明。
