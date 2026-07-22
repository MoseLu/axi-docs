---
id: reference-axi-workspace-repo-topology
title: Axi Workspace Repo Topology
type: reference
status: evergreen
tags: [workspace, topology, architecture]
created: 2026-07-22
modified: 2026-07-22
agent-readable: true
---

# Axi Workspace Repo Topology

最后生成：2026-07-22

## 控制面

| Component | Path | Role |
|---|---|---|
| workspace container | `/Volumes/code/workspace` | 非 Git 仓库；只承载项目目录、参考目录、生成快照和 launcher shim |
| workspace.json | `/Volumes/code/workspace/infra/axi-workspace-governance/workspace.json` | 权威治理清单 |
| registry | `/Volumes/code/workspace/infra/axi-workspace-governance/.workspace/registry.json` | 生成式注册表 |
| docs source | `/Volumes/code/workspace/infra/axi-workspace-governance/docs` | 权威索引文档目录 |
| axi-docs source | `/Volumes/code/workspace/projects/axi-docs/docs/axi-workspace-governance` | Axi Docs 镜像入口 |

## 工作区根目录契约

- `/Volumes/code/workspace` 不是 monorepo、代码仓库、提交单元或项目 handoff 目标。
- 根层文件用于导航、生成快照、workspace graph、dev services 和 agent guidance。
- `workspace-anchor`、`workspace.graph.json`、`dev-services.config.json` 等资源按工作区资源治理，不按普通项目文档套件计分。

## Infra

- `../../infra/axi-registry` | Axi Local Registry | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/axiomaticworld/axi-registry.git
- `C:\Users\12081\.openclaw` | OpenClaw Gateway | branch=`-` | canonical=yes | compliance=`external-infra`
  remote: https://github.com/axiomaticworld/openclaw-gateway

## Projects

- `../../projects/axi-agent-platform` | Axi Agent Platform | branch=`dev` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/axiomaticworld/axi-agent-platform.git
- `../../projects/axi-docs` | Axi Docs | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/axiomaticworld/axi-docs.git
- `../../projects/axi-image-preview` | Axi Image Preview | branch=`dev` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/axiomaticworld/axi-image-preview.git
- `../../projects/axi-notify` | Axi Notify / Mobile | branch=`dev` | canonical=yes | compliance=`android-fullstack`
  remote: https://github.com/axiomaticworld/axi-notify.git
- `../../projects/axi-pet` | Axi Pet | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/moeru-ai/airi.git
- `../../projects/axi-pet-desktop` | Axi Pet Desktop | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/moeru-ai/airi.git
- `../../projects/axi-sports-management-app` | 体育管理应用 | branch=`dev` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/axiomaticworld/sports-management-app.git
- `../../projects/axi-workbench` | Axi Workbench | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/axiomaticworld/axi-workbench.git
  upstream: https://github.com/BellisGit/enterprise-project-automation-platform.git

## Products

- `../../products/axi-artboard` | Axi Artboard | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/MoseLu/axi-artboard.git
- `../../products/ielts-vocab` | IELTS Vocabulary | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/axiomaticworld/ielts-vocab.git

## Shared

- `../../projects/axi-rules` | Axi Rules | branch=`dev` | canonical=yes | compliance=`constraint-index`
  remote: https://github.com/axiomaticworld/axi-rules.git
- `../../shared/axi-skills` | Axi Skills | branch=`dev` | canonical=yes | compliance=`agent-skill-catalog`
  remote: https://github.com/MoseLu/axi-skills.git
- `../../shared/axi-tauri-starter` | Axi Tauri Starter | branch=`dev` | canonical=yes | compliance=`template-reference`
  remote: https://github.com/axiomaticworld/axi-tauri-starter.git
- `../../shared/axi-ui` | Axi UI | branch=`dev` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/axiomaticworld/axi-ui.git

## Tools

- `../../tools/axi-feishu-codex-bridge` | Axi Feishu Codex Bridge | branch=`dev` | canonical=yes | compliance=`python-tool-local-runtime`
  remote: https://github.com/MoseLu/axi-feishu-codex-bridge.git
- `../../tools/axi-proxy-companion` | Axi Proxy Companion | branch=`dev` | canonical=yes | compliance=`swift-tool`
  remote: https://github.com/axiomaticworld/axi-proxy-companion.git
- `../../tools/axi-video-downloader` | Axi Video Downloader | branch=`dev` | canonical=yes | compliance=`python-tool`
  remote: https://github.com/MoseLu/Axi-Video-Downloader.git

## 已批准项目级 Monorepo

- `../../projects/axi-workbench`
- `../../projects/axi-docs`
- `../../projects/axi-pet`
- `../../products/ielts-vocab`
- `../../shared/axi-ui`
