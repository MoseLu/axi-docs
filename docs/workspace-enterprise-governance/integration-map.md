---
id: reference-workspace-integration-map
title: Enterprise Workspace Integration Map
type: reference
status: evergreen
tags: [workspace, integration, contracts]
created: 2026-04-01
modified: 2026-04-01
agent-readable: true
---

# Enterprise Workspace Integration Map

最后生成：2026-04-01

## 跨仓协作契约

| Channel | Source | Target | Contract |
|---|---|---|---|
| registry | `workspace.json` | `.workspace/registry.json` | 工作区注册清单生成，不人工维护 |
| docs | `F:\enterprise-workspace\docs` | `F:\docs\project\docs\workspace-enterprise-governance` | 多仓索引文档镜像给个人文档站 / Info Hub |
| package distribution | `shared/design-system` | Node 消费仓库 | 通过 Verdaccio 分发，不走 Git Submodule |
| orchestration | `C:\Users\12081\.openclaw` | 工作区子项目 | 外部 canonical infra 编排入口 |

## Canonical / Upstream 对齐

| Repo | Canonical | Upstream |
|---|---|---|
| `projects/enterprise-project-automation-platform` | [link](https://github.com/MoseLu/enterprise-project-automation-platform.git) | [link](https://github.com/BellisGit/enterprise-project-automation-platform.git) |
| `shared/design-system` | [link](https://github.com/MoseLu/design-system.git) | [link](https://github.com/BellisGit/design-system.git) |

## 本地权威源（允许无远端）

- `tools/video-downloader` | 视频下载工具 | compliance=`python-tool`
- `agent/scripts` | Agent 脚本集合 | compliance=`agent-support`
- `agent/termagent` | TermAgent | compliance=`agent-support`

## 仓库命名策略

- 不对现有业务产品仓库做全量统一前缀重命名。
- 新增治理、基础设施、共享、Agent 支撑、工具仓库采用渐进式前缀命名。
- 当前建议模式：`workspace-<domain>-governance`、`infra-<capability>`、`shared-<capability>`、`agent-<capability>`、`tool-<capability>`。
