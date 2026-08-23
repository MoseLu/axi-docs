---
id: axi-docs-zh-projects-axi-soul-world
title: Axi Soul World
type: project
status: active
tags: [Axi Docs, Projects, products, core]
created: 2026-08-23
modified: 2026-08-23
graph-title: Axi Soul World
graph-tags: [Projects, products]
description: Axi Soul World 的本地优先跨运行时产品线 —— Axi Mood（Android 私密日记）、Axi Auth 助手以及规范的 BACKEND_CONTRACT 边界。
project:
  id: axi-soul-world
  partition: products
  path: /Volumes/code/workspace/products/axi-soul-world
  source-section: core
---

# TODO — axiom-soul-world

任务追踪基于 [PRD.md](./PRD.md) 中的阶段定义。

## In Progress

- [x] Phase 0 产品边界、数据语义与后端准入检查已完成
  - 后端 `route-intent` 当前为 `rejected`，因此暂不在 incubation 新增服务
- [x] Phase 1 Android 本地 SQLite 数据基础、旧 JSON/RKStorage 迁移与兼容镜像已完成
- [x] 日记、备忘录、待办、打卡的 Android 本地 MVP 入口、类型筛选与时间线卡片已完成
- [x] 独立 C++20 API prototype 已启动并通过本地 HTTP smoke；正式后端承载仍待 admission
- [ ] 打卡领域层历史/时区计算、待办今日/逾期视图、附件扩展与真机完整流程仍待补齐
- [ ] 受治理后端项目承载 C++20 API、PostgreSQL migration 与显式同步
  - 契约先见 [BACKEND_CONTRACT.md](./BACKEND_CONTRACT.md) 与 [DATA_SCHEMA.md](./DATA_SCHEMA.md)

实施总计划见 [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)。

## Up Next

### P0：私密日记核心

| 任务 | 说明 | 验收条件 |
| --- | --- | --- |
| 统一记录模型 | 至少支持心情/日记、备忘录和图片附件 | 数据模型可扩展且向后兼容现有记录 |
| 记录闭环 | 创建 → 保存 → 时间线回顾 → 搜索 | 三步内完成记录创建，重启后仍可回看 |
| 基础筛选 | 按类型、日期、关键词筛选 | 能找到任意一条记录 |
| 数据可见性 | 本地数据状态、导出与删除路径可见 | 导出、删除行为可观察 |
| 清理语义歧义 | 移除"公开/谁可以看"无实际功能的表述 | 界面表述与真实功能一致 |
| 迁移兼容性 | 现有心情记录在升级后仍可读取 | 迁移失败可恢复 |

### P1：个人生活整理能力（规划中）

| 任务 | 说明 |
| --- | --- |
| 待办管理 | 创建、完成、逾期/今日视图、可选提醒、与记录关联 |
| 打卡系统 | 自定义项目、按日记录、连续性回顾（不制造强制压力） |
| 附件能力 | 图片、音频、视频、文档的添加、预览、关联与删除 |
| 聚合视图 | 日历、相册、标签和类型聚合 |
| 应用锁 | 系统生物识别入口，清楚说明保护边界 |

### P2：隐私方案（待定）

| 任务 | 前置条件 |
| --- | --- |
| 加密导出/导入 | 隐私方案明确后 |
| 加密备份/同步 | 用户显式选择，边界清晰 |
| 本地智能回顾 | P0/P1 稳定后评估 |
| 小组件/快捷记录 | P0/P1 稳定后评估 |

## Backlog

### 产品决策

- [ ] 底部导航最终形态验证（以真实使用数据决定，而非视觉对称）
- [ ] "我的档案"是否保留为独立入口
- [ ] 多媒体文件类型扩展优先级（当前优先图片）

### 技术决策

- [ ] 应用锁与设备权限的最小可行方案
- [ ] 附件生命周期与存储管理策略
- [ ] 跨设备同步的加密与冲突处理方案

### 风险监控

- [ ] 设备遗失时的隐私保护边界
- [ ] 存储增长与清理策略
- [ ] 首页复杂度控制（类型筛选与渐进式入口）

---

最后更新：2026-08-22
