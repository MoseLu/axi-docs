---
id: reference-axi-workspace-repo-topology
title: Axi Workspace Repo Topology
type: reference
status: evergreen
tags: [workspace, topology, architecture]
created: 2026-05-30
modified: 2026-05-30
agent-readable: true
---

# Axi Workspace Repo Topology

最后生成：2026-05-30

## 控制面

| Component | Path | Role |
|---|---|---|
| workspace.json | `/Volumes/code/workspace/infra/axi-workspace-governance/workspace.json` | 权威治理清单 |
| registry | `/Volumes/code/workspace/infra/axi-workspace-governance/.workspace/registry.json` | 生成式注册表 |
| docs source | `/Volumes/code/workspace/infra/axi-workspace-governance/docs` | 权威索引文档目录 |
| axi-docs source | `/Volumes/code/workspace/projects/axi-docs/docs/axi-workspace-governance` | Axi Docs 镜像入口 |

## Infra

- `C:\Users\12081\.openclaw` | OpenClaw Gateway | branch=`-` | canonical=yes | compliance=`external-infra`
  remote: https://github.com/MoseLu/openclaw-gateway

## Projects

- `../../projects/axi-agent-platform` | Axi Agent Platform | branch=`master` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/MoseLu/ai-agent-platform.git
- `../../projects/axi-docs` | Axi Docs | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/MoseLu/axi-docs.git
- `../../projects/axi-image-preview` | Axi Image Preview | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/MoseLu/axi-image-preview.git
- `../../projects/axi-notify` | Axi Notify / Mobile | branch=`dev` | canonical=yes | compliance=`android-fullstack`
  remote: https://github.com/MoseLu/axi-notify.git
- `../../projects/axi-workbench` | Axi Workbench | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/MoseLu/enterprise-project-automation-platform.git
  upstream: https://github.com/BellisGit/enterprise-project-automation-platform.git
- `../../projects/sports-management-app` | 体育管理应用 | branch=`master` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/MoseLu/sports-management-app.git
- `../../references/archives/axi-wave1-20260525/quasar-mobile-app` | Quasar 移动模板 | branch=`-` | canonical=no | compliance=`node-single-repo`
- `../../references/archives/axi-wave2-20260525/agent-desktop` | Agent Desktop 桌面应用 | branch=`-` | canonical=no | compliance=`node-single-repo`
  remote: https://github.com/MoseLu/agent-desktop.git
- `../../references/archives/axi-wave3-20260525/btc-shopflow-monorepo` | BTC ShopFlow 微前端骨架归档 | branch=`-` | canonical=no | compliance=`node-monorepo-approved`
  remote: https://github.com/MoseLu/btc-shopflow-monorepo.git

## Shared

- `../../references/archives/axi-wave1-20260525/design-system` | 设计系统 | branch=`-` | canonical=no | compliance=`shared-package`
  remote: https://github.com/MoseLu/design-system.git
  upstream: https://github.com/BellisGit/design-system.git

## Tools

- `../../tools/axi-video-downloader` | Axi Video Downloader | branch=`-` | canonical=yes | compliance=`python-tool`

## Agent

- `../../references/archives/axi-wave2-20260525/agent-scripts` | Agent 脚本集合 | branch=`-` | canonical=no | compliance=`agent-support`
- `../../references/archives/axi-wave2-20260525/termagent` | TermAgent | branch=`-` | canonical=no | compliance=`agent-support`

## References

- `../../references/archives/projects-cleanup-20260524-235336/enterprise-workspace/references/anthropics-skills` | Anthropic Skills 参考 | branch=`-` | canonical=no | compliance=`reference`
- `../../references/archives/projects-cleanup-20260524-235336/enterprise-workspace/references/claude-mem` | Claude Memory 参考 | branch=`-` | canonical=no | compliance=`reference`
- `../../references/archives/projects-cleanup-20260524-235336/enterprise-workspace/references/enterprise-automation-platform-archive` | 企业自动化平台归档副本 | branch=`-` | canonical=no | compliance=`archived-reference`
  remote: https://github.com/MoseLu/enterprise-project-automation-platform.git
- `../../references/archives/projects-cleanup-20260524-235336/enterprise-workspace/references/enterprise-dev-platform` | 企业开发平台参考 | branch=`-` | canonical=no | compliance=`reference`
- `../../references/archives/projects-cleanup-20260524-235336/enterprise-workspace/references/enterprise-workspace-legacy` | 企业工作空间历史参考 | branch=`-` | canonical=no | compliance=`legacy-reference`
  remote: https://github.com/MoseLu/enterprise-workspace.git

## 已批准项目级 Monorepo

- `../../projects/axi-workbench`
- `../../projects/axi-docs`
