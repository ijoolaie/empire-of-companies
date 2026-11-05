# Session Handoff — Read First

Last updated: 2026-11-05 — P3 browser regression suite implemented and locally passing; CI verification pending

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
- Supabase Auth only; no service-role/secret in frontend.
- GitHub repository is Public (explicitly approved).
- Never claim gameplay/auth verified without a successful observable test.

## Repository state
- Default branch: main; P2 merged at 06ebb5c.
- Current branch: feat/p3-progression-ux.
- Local HEAD before current uncommitted work: c378a79; branch was clean and matched origin at session start.
- PR #2 exists: https://github.com/ijoolaie/empire-of-companies/pull/2. Do not merge automatically.
- Last observed CI run for c378a79: 42051228657, Build success. It does not include current uncommitted changes.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.
- Node v22.23.2; npm 10.9.8.

## Current phase
P3 progression and usability is active. The first slice (tutorial, ordered milestones, one-time cash/XP rewards, player level and v4 save migration) is already in PR #2. This session added a repeatable Playwright browser suite and CI Chromium step. Local browser tests: 4/4 passed. npm ci succeeded with 0 audit vulnerabilities; unit tests: 14/14 passed; production build passed; git diff --check passed. Vite main bundle remains about 6.0 MB minified.

A real UI defect was found and fixed while adding browser automation: the full-screen Babylon canvas intercepted clicks on language/account controls in the top bar. The top bar and stats region now explicitly enable pointer events.

## Next exact task
Run a clean npm ci, then npm test, npm run build, npm run test:browser, and git diff --check. Review and commit/push this slice to feat/p3-progression-ux; verify the new GitHub Actions run on PR #2. Keep the PR unmerged. After CI is green, implement the P3 progression/unlock screen and expand responsive/localization coverage.

## Session update rule
At the end of each substantial session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, next task, commit and CI run.
- Update docs/ROADMAP.md / docs/WORK_BREAKDOWN_STRUCTURE.md when scope or order changes.
- Record product/architecture changes in docs/DECISIONS.md.
- Never mark code complete just because it was written or uploaded.