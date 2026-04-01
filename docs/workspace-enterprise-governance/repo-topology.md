---
id: reference-workspace-repo-topology
title: Enterprise Workspace Repo Topology
type: reference
status: evergreen
tags: [workspace, topology, architecture]
created: 2026-04-01
modified: 2026-04-01
agent-readable: true
---

# Enterprise Workspace Repo Topology

最后生成：2026-04-01

## 控制面

| Component | Path | Role |
|---|---|---|
| workspace.json | `F:\enterprise-workspace\workspace.json` | 权威治理清单 |
| registry | `F:\enterprise-workspace\.workspace\registry.json` | 生成式注册表 |
| docs source | `F:\enterprise-workspace\docs` | 权威索引文档目录 |
| info-hub source | `F:\docs\project\docs\workspace-enterprise-governance` | 文档站镜像入口 |

## Infra

- `C:\Users\12081\.openclaw` | OpenClaw Gateway | branch=`feature/home-update` | canonical=yes | compliance=`external-infra`
  remote: https://github.com/MoseLu/openclaw-gateway
- `infra/mcp-swarm` | MCP Swarm 服务 | branch=`master` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/MoseLu/mcp-swarm.git

## Projects

- `projects/agent-desktop` | Agent Desktop 桌面应用 | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/MoseLu/agent-desktop.git
- `projects/ai-agent-platform` | AI Agent Platform | branch=`master` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/MoseLu/ai-agent-platform.git
- `projects/android-workspace-app` | Android 工作空间应用 | branch=`main` | canonical=yes | compliance=`android-fullstack`
  remote: https://github.com/MoseLu/axi-workspace-app.git
- `projects/app-search-system` | App Search System | branch=`codex/factory-device-flow` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/MoseLu/app-search-system.git
- `projects/btc-shopflow-monorepo` | BTC ShopFlow 微前端项目 | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/MoseLu/btc-shopflow-monorepo.git
- `projects/enterprise-project-automation-platform` | 企业项目自动化平台 | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/MoseLu/enterprise-project-automation-platform.git
  upstream: https://github.com/BellisGit/enterprise-project-automation-platform.git
- `projects/feiyu-agentflow` | 飞鱼 AgentFlow | branch=`master` | canonical=yes | compliance=`android-fullstack`
  remote: https://github.com/MoseLu/feiyu-agentflow.git
- `projects/ielts-vocab` | IELTS Vocabulary | branch=`dev` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/MoseLu/ielts-vocab.git
- `projects/quasar-mobile-app` | Quasar 移动模板 | branch=`master` | canonical=no | compliance=`node-single-repo`
- `projects/sports-management-app` | 体育管理应用 | branch=`master` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/MoseLu/sports-management-app.git

## Shared

- `shared/design-system` | 设计系统 | branch=`dev` | canonical=yes | compliance=`shared-package`
  remote: https://github.com/MoseLu/design-system.git
  upstream: https://github.com/BellisGit/design-system.git

## Tools

- `tools/video-downloader` | 视频下载工具 | branch=`-` | canonical=yes | compliance=`python-tool`

## Agent

- `agent/multi-agent` | Multi-Agent Terminal Orchestrator | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/MoseLu/multi-agent.git
- `agent/scripts` | Agent 脚本集合 | branch=`-` | canonical=yes | compliance=`agent-support`
- `agent/termagent` | TermAgent | branch=`-` | canonical=yes | compliance=`agent-support`

## References

- `references/anthropics-skills` | Anthropic Skills 参考 | branch=`-` | canonical=no | compliance=`reference`
- `references/claude-mem` | Claude Memory 参考 | branch=`-` | canonical=no | compliance=`reference`
- `references/enterprise-automation-platform-archive` | 企业自动化平台归档副本 | branch=`develop` | canonical=no | compliance=`archived-reference`
  remote: https://github.com/MoseLu/enterprise-project-automation-platform.git
- `references/enterprise-dev-platform` | 企业开发平台参考 | branch=`develop` | canonical=no | compliance=`reference`
  remote: https://github.com/BellisGit/enterprise-workspace.git
- `references/enterprise-workspace-legacy` | 企业工作空间历史参考 | branch=`dev` | canonical=no | compliance=`legacy-reference`
  remote: https://github.com/MoseLu/enterprise-workspace.git

## 已批准项目级 Monorepo

- `projects/btc-shopflow-monorepo`
- `projects/enterprise-project-automation-platform`
