# Session Handoff — Read First

Last updated: 2026-11-05 — reproducible install and initial headless render verified

## Mission
Continue **Empire of Companies / امپراتور شرکت‌ها** in https://github.com/ijoolaie/empire-of-companies.

## Read order
1. README.fa.md
2. docs/PROJECT_STATUS.md
3. docs/ROADMAP.md
4. docs/WORK_BREAKDOWN_STRUCTURE.md
5. docs/DECISIONS.md
6. docs/DEVELOPMENT.md

## Non-negotiable decisions
- Babylon.js + TypeScript + Vite.
- Persian/English, RTL/LTR.
- Browser/PWA first; Android later via Capacitor.
- Procedural art first; Blender is not required.
- Game saves are local-only; no cloud save/sync.
- Supabase Auth only; no service-role/secret key in frontend.
- GitHub repository is Public by explicit user approval.
- Never claim gameplay/auth verified without a successful observable test.

## Repository state
- Default branch: main.
- Development branch: feat/p2-core-game-loop.
- Draft PR: #1 — https://github.com/ijoolaie/empire-of-companies/pull/1.
- Latest pushed commit: 2fecf6e6b0fe156979f71884ef5005b44c8164ef.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.
- Node v22.23.2; npm 10.9.8.
- package-lock.json committed; CI uses npm ci and npm cache.
- GitHub Actions run #24 (41995386118) completed successfully.
- Local npm ci, npm test (10/10), and npm run build passed.
- HTTP and initial headless Chrome render smoke passed (1365x900 screenshot produced; temporary artifact removed).
- Interactive browser gameplay and save/restore QA remain pending.

## Current phase
P1 reproducible engineering complete. P2 core economy/save implementation and automated tests complete in code; initial render is checked, but interactive gameplay acceptance remains pending.

## Next exact task
Perform interactive browser QA: build a desk, hire a worker, verify income changes, upgrade the office, save, refresh/reopen, and verify restored state. Then test offline earnings and migration in browser. Do not merge PR #1 before these checks pass.

## Session update rule
At the end of each substantial session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, next task, commit and CI run.
- Update docs/ROADMAP.md / docs/WORK_BREAKDOWN_STRUCTURE.md when scope or order changes.
- Record product/architecture changes in docs/DECISIONS.md.
- Never mark code complete just because it was written or uploaded.
