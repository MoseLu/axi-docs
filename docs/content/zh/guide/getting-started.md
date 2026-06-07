---
id: axi-docs-zh-guide-getting-started
title: 快速开始
type: guide
status: published
tags: [Axi Docs, 指南, 中文]
created: 2026-06-06
modified: 2026-06-07
graph-title: 快速开始
graph-tags: [Axi Docs, 指南]
description: 启动 Axi Docs，并掌握指南、技能库、工作区和搜索的基本阅读路径。
---

## 启动本地站点

在仓库根目录安装依赖并启动应用：

```bash
pnpm --dir app install
pnpm --dir app dev
```

开发服务器启动后，打开终端显示的本地地址。修改 `docs/content/` 下的 Markdown 或 `app/src/` 下的界面代码后，Vite 会刷新页面。

## 使用文档导航

1. 使用顶部导航在**指南**、**技能库**和**工作区**之间切换。
2. 使用左侧分组侧栏选择当前文档集中的页面。
3. 使用右侧页面导航跳到当前正文的二级或三级标题。
4. 阅读完成后，使用正文底部的上一页和下一页继续。

## 搜索文档

点击顶部搜索按钮或按 `⌘K` 打开搜索面板。搜索会匹配标题、描述、路径、标签和正文；提交查询后会进入[搜索与索引](/zh/guide/search)页面展示结果。

## 提交前验证

界面或内容修改完成后运行：

```bash
pnpm --dir app test:run
pnpm --dir app lint
pnpm --dir app verify
```

`verify` 当前执行 TypeScript 检查与 Vite 生产构建。文档结构和双语路径仍需在评审时核对。
