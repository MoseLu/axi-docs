---
id: reference-axi-workspace-governance-index
title: Axi Workspace Governance Index
type: reference
status: evergreen
tags: [workspace, governance, polyrepo]
created: 2026-05-31
modified: 2026-05-31
agent-readable: true
---

# Axi Workspace Governance Index

最后生成：2026-05-31

## 摘要

- 工作区根目录：`/Volumes/code/workspace/infra/axi-workspace-governance`
- 治理仓库远端：`https://github.com/axiomaticworld/axi-workspace-governance.git`
- 已登记条目：13
- canonical 条目：13
- active / active-* 条目：13

## Section 统计

- `infra`: 2
- `projects`: 6
- `products`: 1
- `shared`: 2
- `tools`: 2
- `agent`: 0
- `references`: 0

## 索引文档

- [项目清单](project-catalog.md)
- [项目完成情况](project-completion.md)
- [仓库拓扑](repo-topology.md)
- [负责人矩阵](ownership-matrix.md)
- [集成地图](integration-map.md)
- [治理 ADR](adr/README.md)
- [治理审计](audits/)

## 治理仓库根级门面（2026-06-10 补齐）

`infra/axi-workspace-governance/` 仓库自身的根级门面，已在 `docs/audit/axi-docs-coverage-2026-06-10.md` 审计期间镜像到此：

- [AGENTS.md](AGENTS.md) — 进入治理仓库的 agent 第一站
- [INDEX.md](INDEX.md) — 治理仓库文件索引
- [PRD.md](PRD.md) — 治理仓库产品需求
- [TDD.md](TDD.md) — 治理仓库技术设计
- [TODO.md](TODO.md) — 治理仓库待办
- [MILESTONES.md](MILESTONES.md) — 治理仓库里程碑
- [CHANGELOG.md](CHANGELOG.md) — 治理仓库变更历史
- [SECURITY.md](SECURITY.md) — 治理仓库安全策略
- [README.zh-CN.md](README.zh-CN.md) — 治理仓库简体中文入口

> 这些文件以 `cp` 形式从 `infra/axi-workspace-governance/` 复制，与 `docs/` 下的报告/ADR/审计并列。
> 真源仍在 `infra/axi-workspace-governance/`，对它们的修改应回到源仓库。

## 分发链路

- 权威文档目录：`/Volumes/code/workspace/infra/axi-workspace-governance/docs`
- `axi-workspace-governance-docs`: `../../projects/axi-docs/docs/axi-workspace-governance`
- Axi Docs Source：`axi-workspace-governance` -> `/Volumes/code/workspace/projects/axi-docs/docs/axi-workspace-governance`

## 使用命令

```bash
pnpm workspace:docs:sync
pnpm workspace:registry:sync
pnpm workspace:audit
```
