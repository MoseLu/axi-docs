# Axi Docs TDD

## Architecture Assumptions

- Root path: `/Volumes/code/workspace/projects/axi-docs`
- Application package: `app/` (pnpm + Vite + React + TypeScript)
- Project-state documents: `docs/state/`; governance documents: `docs/governance/`
- Product-content sources: `docs/content/{en,zh}/`

## Technical Design

The project docs form a lightweight control plane:

1. `AGENTS.md` defines agent-safe boundaries.
2. `docs/state/PRD.md` defines requirements and non-goals.
3. `docs/state/TDD.md` defines verification strategy.
4. `docs/state/TODO.md` maps requirements to tasks and tests.
5. `docs/state/MILESTONE.md` records delivery evidence.
6. `INDEX.md` maps documents and source-of-truth ownership.

## Verification Commands

- `pnpm --dir app error-doc:lint`
- `pnpm --dir app docs:check`
- `pnpm --dir app audit --json` after dependency changes
- `pnpm --dir app verify` after application or dependency changes
- `pnpm --dir app source:check` when the checked-in external source snapshot is
  expected to match `docs/sources.lock.json`

Minimum documentation check:

```bash
for f in AGENTS.md README.md INDEX.md docs/state/CHANGELOG.md docs/state/TODO.md docs/state/MILESTONE.md docs/state/PRD.md docs/state/TDD.md; do test -f "/Volumes/code/workspace/projects/axi-docs/$f" || exit 1; done
rg -n "PRD|TDD|Milestone" "/Volumes/code/workspace/projects/axi-docs/docs/state/PRD.md" "/Volumes/code/workspace/projects/axi-docs/docs/state/TDD.md" "/Volumes/code/workspace/projects/axi-docs/docs/state/TODO.md" "/Volumes/code/workspace/projects/axi-docs/docs/state/MILESTONE.md" "/Volumes/code/workspace/projects/axi-docs/INDEX.md"
```

## Risk Cases

- Documentation drifts from package manifests or source layout.
- Agents edit outside `/Volumes/code/workspace/projects/axi-docs` without explicit scope.
- Reference checkouts are mistaken for Axi-owned product surfaces.
- Verification commands become stale after dependency or layout changes.
- External source snapshots can advance independently; a failing `source:check`
  is a source-lock maintenance blocker, not evidence that an app dependency
  upgrade failed.

## Test Strategy

- Treat required docs as contract files.
- Prefer existing project test/build commands when implementation changes occur.
- For doc-only changes, run the minimum documentation check above and inspect diffs for placeholder language.
