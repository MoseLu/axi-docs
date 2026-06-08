# Axi Docs TDD

## Architecture Assumptions

- Root path: `/Volumes/code/workspace/projects/axi-docs`
- Stack signals: document/config driven
- Top-level entries: `AGENTS.md`, `CHANGELOG.md`, `CHANGELOG.zh-CN.md`, `MILESTONES.md`, `README.md`, `README.zh-CN.md`, `SECURITY.md`, `SECURITY.zh-CN.md`, `TODO.md`, `TODO.zh-CN.md`, `app/`, `blinko`, `docs/`
- No package scripts detected at root.

## Technical Design

The root docs form a lightweight control plane:

1. `AGENTS.md` defines agent-safe boundaries.
2. `PRD.md` defines requirements and non-goals.
3. `TDD.md` defines verification strategy.
4. `TODO.md` maps requirements to tasks and tests.
5. `MILESTONES.md` records delivery evidence.
6. `INDEX.md` maps documents and source-of-truth ownership.

## Verification Commands

- `rg -n "TODO|PRD|TDD" README.md TODO.md MILESTONES.md PRD.md TDD.md`

Minimum documentation check:

```bash
for f in README.md README.zh-CN.md AGENTS.md CHANGELOG.md TODO.md MILESTONES.md INDEX.md PRD.md TDD.md; do test -f "/Volumes/code/workspace/projects/axi-docs/$f" || exit 1; done
rg -n "REQ-DOC-001|PRD|TDD|Milestone" "/Volumes/code/workspace/projects/axi-docs/PRD.md" "/Volumes/code/workspace/projects/axi-docs/TDD.md" "/Volumes/code/workspace/projects/axi-docs/TODO.md" "/Volumes/code/workspace/projects/axi-docs/MILESTONES.md" "/Volumes/code/workspace/projects/axi-docs/INDEX.md"
```

## Risk Cases

- Documentation drifts from package manifests or source layout.
- Agents edit outside `/Volumes/code/workspace/projects/axi-docs` without explicit scope.
- Reference checkouts are mistaken for Axi-owned product surfaces.
- Verification commands become stale after dependency or layout changes.

## Test Strategy

- Treat required docs as contract files.
- Prefer existing project test/build commands when implementation changes occur.
- For doc-only changes, run the minimum documentation check above and inspect diffs for placeholder language.
