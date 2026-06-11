---
id: reference-axi-workspace-repo-topology
title: Axi Workspace Repo Topology
type: reference
status: evergreen
tags: [workspace, topology, architecture]
created: 2026-06-11
modified: 2026-06-11
agent-readable: true
---

# Axi Workspace Repo Topology

最后生成：2026-06-11

## 控制面

| Component | Path | Role |
|---|---|---|
| workspace.json | `/Volumes/code/workspace/infra/axi-workspace-governance/workspace.json` | 权威治理清单 |
| registry | `/Volumes/code/workspace/infra/axi-workspace-governance/.workspace/registry.json` | 生成式注册表 |
| docs source | `/Volumes/code/workspace/infra/axi-workspace-governance/docs` | 权威索引文档目录 |
| axi-docs source | `/Volumes/code/workspace/projects/axi-docs/docs/axi-workspace-governance` | Axi Docs 镜像入口 |

## Infra

- `../../infra/axi-registry` | Axi Local Registry | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/axiomaticworld/axi-registry.git
- `C:\Users\12081\.openclaw` | OpenClaw Gateway | branch=`-` | canonical=yes | compliance=`external-infra`
  remote: https://github.com/axiomaticworld/openclaw-gateway

## Projects

- `../../projects/axi-agent-platform` | Axi Agent Platform | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/axiomaticworld/axi-agent-platform.git
- `../../projects/axi-docs` | Axi Docs | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/axiomaticworld/axi-docs.git
- `../../projects/axi-image-preview` | Axi Image Preview | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-single-repo`
  remote: https://github.com/axiomaticworld/axi-image-preview.git
- `../../projects/axi-notify` | Axi Notify / Mobile | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`android-fullstack`
  remote: https://github.com/axiomaticworld/axi-notify.git
- `../../projects/axi-pet` | Axi Pet | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/moeru-ai/airi.git
- `../../projects/axi-sports-management-app` | 体育管理应用 | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`polyrepo-mixed-stack`
  remote: https://github.com/axiomaticworld/sports-management-app.git
- `../../projects/axi-workbench` | Axi Workbench | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/axiomaticworld/axi-workbench.git
  upstream: https://github.com/BellisGit/enterprise-project-automation-platform.git

## Products

- `../../products/ielts-vocab` | IELTS Vocabulary | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/axiomaticworld/ielts-vocab.git

## Shared

- `../../projects/axi-rules` | Axi Rules | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`constraint-index`
- `../../shared/axi-tauri-starter` | Axi Tauri Starter | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`template-reference`
  remote: https://github.com/axiomaticworld/axi-tauri-starter.git
- `../../shared/axi-ui` | Axi UI | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`node-monorepo-approved`
  remote: https://github.com/axiomaticworld/axi-ui.git

## Tools

- `../../tools/axi-feishu-codex-bridge` | Axi Feishu Codex Bridge | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`python-tool-local-runtime`
  remote: https://github.com/MoseLu/axi-feishu-codex-bridge.git
- `../../tools/axi-proxy-companion` | Axi Proxy Companion | branch=`agent/zero-context-handoff-20260611` | canonical=yes | compliance=`swift-tool`
  remote: https://github.com/axiomaticworld/axi-proxy-companion.git
- `../../tools/axi-video-downloader` | Axi Video Downloader | branch=`-` | canonical=yes | compliance=`python-tool`

## 已批准项目级 Monorepo

- `../../projects/axi-workbench`
- `../../projects/axi-docs`
- `../../projects/axi-pet`
- `../../products/ielts-vocab`
- `../../shared/axi-ui`
