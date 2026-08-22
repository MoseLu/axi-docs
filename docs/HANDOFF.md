# Axi Docs Handoff

- Project: `axi-docs`
- Path: `/Volumes/code/workspace/projects/axi-docs`
- Owner: `AxiomaticWorld workspace owner`
- Readiness: `verified`
- Purpose: Workspace documentation hub combining a React reader, knowledge-source adapters, knowledge graph, MCP document bus, and generated project dossier mirrors.

## 90-Second Read Order

1. `AGENTS.md`
2. `README.md`
3. `app/AGENTS.md`
4. `docs/state/TODO.md` + `docs/state/CHANGELOG.md`
5. `docs/state/MILESTONE.md`

## Entrypoints

- `app/src/main.tsx`: Mount the React documentation reader and knowledge hub.
- `app/src/mcp/server.ts`: Expose the Axi Docs MCP and HTTP document-access surfaces.
- `app/scripts/build-projects-index.mjs`: Generate workspace project dossier mirrors and their index.
- `app/scripts/check-source-locks.mjs`: Validate external documentation source locks.
- `app/scripts/check-fragmented-commits.mjs`: Guard against splitting single features into multiple parallel commits.
- `app/scripts/check-naming-drift.mjs`: Guard against naming inconsistency for the same concept.
- `app/scripts/check-mcp-log-dir.mjs`: Guard against MCP log directory misalignment.

## Commands

- Setup: `pnpm --dir app install --frozen-lockfile`
- Start: `pnpm --dir app dev`
- Start: `pnpm --dir app mcp:http`
- Health: `pnpm --dir app docs:check`
- Health: `pnpm --dir app source:check`
- Health: `pnpm --dir app projects:check`
- Verify: `pnpm --dir app verify`
- Verify: `pnpm --dir app test:run`
- Verify: `pnpm --dir app rule:check` (R001~R003 guard scripts)
- Smoke: `pnpm --dir app docs:check`

## Environment

- Runtimes: `Node.js`, `pnpm`
- Services: `Blinko when the Blinko source is enabled`, `Anthropic-compatible API when AI document analysis is enabled`, `Aliyun OSS when attachment upload hooks are enabled`
- `VITE_API_BASE`: required=no, secret=no, source=app/.env or process environment
- `OBSIDIAN_PATH`: required=no, secret=no, source=app/.env or process environment
- `AXI_DOCS_EXTRA_SOURCES_JSON`: required=no, secret=no, source=app/.env or process environment
- `AXI_SKILLS_PATH`: required=no, secret=no, source=app/.env or process environment
- `DBSKILL_PATH`: required=no, secret=no, source=app/.env or process environment
- `BLINKO_URL`: required=no, secret=no, source=app/.env or process environment
- `BLINKO_TOKEN`: required=no, secret=yes, source=app/.env or process environment
- `ANTHROPIC_API_KEY`: required=no, secret=yes, source=app/.env or process environment

## Contracts

- Provides: `Axi Docs web reader`, `axi_docs_* MCP document tools`, `Knowledge graph and document-source adapters`, `Generated workspace project dossier mirrors`
- Consumes: `Workspace project metadata`, `Locked Axi Skills documentation source`, `Configured Obsidian, Blinko, dbskill, and extra documentation sources`
- Contract files: `docs/project-docs.manifest.json`, `docs/sources.lock.json`, `docs/projects.index.json`, `app/src/config/documentSources.ts`, `app/src/lib/knowledgeBase.ts`, `app/src/mcp/server.ts`

## Current Work

- TODO: `docs/state/TODO.md` + `todo/` directory
- Milestone: `docs/state/MILESTONE.md` (M1~M5 all in progress/active)
- Active: ZC-DOCS-001~006 completed 2026-08-17; backlog in `todo/01-current-architecture.md`
- Active: `docs/rules/` module with R001~R003 hard constraints and guard scripts
- Active: Keep the project documentation contract and generated dossier coverage complete.
- Active: Maintain workspace registry coverage and locked documentation sources.
- Active: Continue the VitePress-aligned reader experience and source governance milestone.
- Active: MCP tools now restrict agent capabilities via `task-execution-routing/v1` annotations
- Known failure: `source:check` reports upstream drift in `axi-skills` (owner action required)
- Known failure: Live Blinko, AI analysis, and OSS integrations require their corresponding external services and credentials.

## Known Issues

- **axi-skills upstream drift**: `source:check` fails due to `axi-skills` upstream repository drift (lock points to `c3fd7cea2ad1f90f03f7f86bbe52a1eb5c565923`, expected by CI). Owner action required to review and update the lock.
- Legacy audit items tracked in `todo/02-legacy-audit.md` (P0~P3 owner action table).

## Troubleshooting

- Symptom: Governance or documentation checks report missing files.
  Diagnosis: A required root or app governance document was removed, renamed, or not generated.
  Resolution: Run `pnpm --dir app docs:check`, restore the named file from its authoritative source, and rerun the check.
- Symptom: Source checks report a lock mismatch or unavailable documentation source.
  Diagnosis: A configured external source moved or its locked revision no longer matches the local checkout.
  Resolution: Inspect `docs/sources.lock.json` and the configured source path, then update the lock only after verifying the intended revision.
- Symptom: The build fails while optional live integrations are unavailable.
  Diagnosis: A source adapter or environment-dependent path is being treated as required during build.
  Resolution: Check `app/.env.example` and `app/AGENTS.md`, disable the optional source or provide its documented local configuration, then rerun `pnpm --dir app verify`.
- Symptom: Rule guard scripts fail.
  Diagnosis: A commit violated R001 (fragmented commits), R002 (naming drift), or R003 (MCP log dir mismatch).
  Resolution: Inspect `docs/rules/INDEX.md` for the specific rule requirements, then fix the violation.

## Decisions And Freshness

- ADR: `docs/axi-workspace-governance/adr/README.md`
- Changelog: `docs/state/CHANGELOG.md`
- Rules: `docs/rules/INDEX.md` (R001~R003)
- Submit log: `app/docs/logs/submit/`
- Last verified: `2026-08-22`
- Evidence:
  - `pnpm --dir app docs:check` passes
  - `pnpm --dir app projects:check` passes (26 projects x 2 locales x 7 required = 364 required dossier files)
  - `pnpm --dir app verify` passes (tsc + vite build, ~50s)
  - `pnpm --dir app test:run` passes (47+ ZC-DOCS tests pass)
  - `pnpm --dir app rule:check` passes (R001~R003 guard scripts)
  - `pnpm --dir app source:check` fails (preexisting upstream drift, owner action required)
- ZC-DOCS-001~006 implementation completed 2026-08-17
- `docs/rules/` module added 2026-08-17 with R001~R003 constraints
- MCP capability restrictions via `task-execution-routing/v1` added 2026-08-10
- Project dossier mirrors refreshed to 2026-08-15

> Generated from `docs/project-docs.manifest.json`; edit the manifest, then regenerate this file.
