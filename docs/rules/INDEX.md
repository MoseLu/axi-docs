# Axi Docs 约束索引

> 本表列出 `docs/rules/` 下所有生效中的约束条目;按 ID 升序排列。
> 新增条目时按 `README.md` 第 6 步同步本表。

| ID | 标题 | 严重度 | Guard 命令 | 状态 | 触发场景 |
|----|------|--------|------------|------|----------|
| [R001](R001-no-fragmented-commits.md) | 不允许把单个 feature 拆成多个并列 commit | must-follow | `pnpm --dir app rule:check-fragmented-commits` | active | `git commit` 时 staged 文件跨 ≥3 个根目录 |
| R002 | (pending — 命名漂移:同一概念必须使用同一单词) | must-follow | `pnpm --dir app rule:check-naming-drift` | pending | (commit 3 落地) |
| R003 | (pending — MCP 读端与 launcher 写端必须共享日志目录常量) | must-follow | `pnpm --dir app rule:check-mcp-log-dir` | pending | (commit 3 落地) |

## 状态枚举

- `active`:生效中
- `deprecated`:已不再适用但保留可追溯
- `superseded-by:xxx`:被新条目取代

## 严重度枚举

- `must-follow`:硬约束,违反即 exit 1(默认)
- `should-follow`:建议约束,违反仅 warn
- `informational`:信息性,无自动校验

---

*最后更新:2026-08-17 — ZC-DOCS-006 创建*
