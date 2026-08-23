---
id: axi-docs-en-projects-axi-soul-world
title: Axi Soul World
type: project
status: active
tags: [Axi Docs, Projects, products, core]
created: 2026-08-23
modified: 2026-08-23
graph-title: Axi Soul World
graph-tags: [Projects, products]
description: Local-first cross-runtime product line for the Axi Soul World — Axi Mood (Android private journal), Axi Auth helper, and the canonical BACKEND_CONTRACT boundary.
project:
  id: axi-soul-world
  partition: products
  path: /Volumes/code/workspace/products/axi-soul-world
  source-section: core
---

# Axi Soul World

Axi Soul World 是产品总根、总后台和多端接入边界。`Axi Mood` 是当前已经落地的记录业务模块，不是整个产品的部署边界。

本地运行时是项目的默认总后台形态：它拥有领域逻辑、数据存储和本地 API/IPC 边界。未来可以在其上增加 Web BFF，也可以把同一套核心作为模块并入其他项目后台；Android、Web 和其他客户端都只能通过接入层访问业务能力。

**当前阶段**：正式项目（产品与运行时仍按 PRD/P0/P1/P2 分阶段实现）

**规范路径**：`/Volumes/code/workspace/products/axi-soul-world`

Git 分支约定：`main` 只承载可发布生产版本，`dev` 承载日常集成；新功能从 `dev` 创建 `feature/*`、`fix/*` 或 `codex/*` 等短分支，通过验证后合并回 `dev`，发布时再经审查合并到 `main`。

## 技术栈

| 组件 | 技术 | 说明 |
| --- | --- | --- |
| 产品核心 | 领域模型 + 应用用例 + 稳定契约 | 与 Android、Web、宿主后台解耦 |
| 本地总后台 | 当前由本地 SQLite/文件运行时承载 | 默认本地权威，未来可替换为远端运行时 |
| Android 接入面 | Kotlin + XML View（当前实现） | `Axi Mood` 移动端业务界面与本地适配层 |
| 核心辅助 | C++ (`axi_core`) | 当前 Android 原生核心能力；未来服务端 C++ 通过同一契约承载 |
| 认证辅助 | Rust (`axi-auth-helper`) | 本地授权适配器，不是业务后台 |
| 设计系统 | axi_tokens.xml | 语义化设计 token |

## 项目结构

```
axi-soul-world/
├── axi-mood-app/           # 当前 Axi Mood 业务模块的 Android 接入面（过渡承载）
│   ├── android/            # Android 原生项目
│   │   ├── app/src/main/java/com/axi/mood/   # 当前界面、本地后台适配与存储
│   │   └── app/src/main/cpp/                 # C++ 核心逻辑
│   └── scripts/            # 构建与安装脚本
├── axi-auth-helper/        # Rust 本地授权适配器
├── architecture-inputs/    # 总后台、BFF、数据与安全契约输入
├── BACKEND_CONTRACT.md     # 跨运行时稳定的产品/API 契约
├── BACKEND_ARCHITECTURE_PLAN.md # 总后台与多种部署形态
├── PRD.md                  # 产品需求文档
└── TODO.md                 # 任务追踪
```

当前物理目录是过渡布局，不代表最终模块边界。后续应逐步把 `axi-mood-app/android` 中的领域/存储能力下沉到产品核心或本地总后台，再让 Android 只保留 UI 和客户端适配；未经迁移验证，不直接做大规模目录搬迁。

## 启动

### 开发构建

```bash
export ANDROID_HOME=/Users/mose/.local/opt/android-sdk
cd axi-mood-app/android
./gradlew :app:assembleDebug
```

### 发布构建

```bash
export ANDROID_HOME=/Users/mose/.local/opt/android-sdk
cd axi-mood-app/android
./gradlew :app:assembleRelease
```

### 安装（需要设备指纹）

```bash
cd axi-soul-world
./axi-mood-app/scripts/install-with-miui-tap.sh \
  axi-mood-app/android/app/build/outputs/apk/release/app-release.apk \
  m7lru45xu4mjcq7x
```

## 验证

```bash
# 设计 token 审计
cd axi-mood-app/android
./gradlew :app:checkDesignTokens

# 工作区登记与文档接手检查
/Volumes/code/workspace/scripts/workspace-project validate
/Volumes/code/workspace/scripts/workspace-project handoff-check axi-soul-world
```

## 相关文档

- [PRD.md](./PRD.md) — 产品需求文档
- [AGENTS.md](./AGENTS.md) — 项目边界与验证规则
- [docs/HANDOFF.md](./docs/HANDOFF.md) — 零上下文接手入口
- [docs/VERIFICATION.md](./docs/VERIFICATION.md) — 验证命令与证据
- [TODO.md](./TODO.md) — 任务追踪
- [axi-mood-app/README.md](./axi-mood-app/README.md) — 应用详情

## 关键里程碑

| 阶段 | 目标 | 状态 |
| --- | --- | --- |
| PRD | 产品需求文档 | 完成 |
| P0 | 私密日记核心 | 待开发 |
| P1 | 个人生活整理能力（待办/打卡/附件） | 规划中 |
| P2 | 加密备份与跨设备同步 | 待隐私方案确定 |

## 接手提示

请先阅读 [PRD.md](./PRD.md) 了解产品的私密日记定位、核心价值、P0 验收标准和未决问题。
