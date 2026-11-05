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
- Current HEAD: f2985290ef164d7a2c08e806fec17997859d339b, committed and pushed; branch matches origin.
- PR #2 exists: https://github.com/ijoolaie/empire-of-companies/pull/2. Do not merge automatically.
- GitHub Actions run #30 (42054389812) completed successfully for f298529, including Chromium installation and the Playwright browser regression suite.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.
- Node v22.23.2; npm 10.9.8.

## Current phase
P3 progression and usability is active. The first slice (tutorial, ordered milestones, one-time cash/XP rewards, player level and v4 save migration) is already in PR #2. This session added and pushed a repeatable Playwright browser suite and CI Chromium step in f298529. Local and CI browser tests: 4/4 passed. npm ci succeeded with 0 audit vulnerabilities; unit tests: 14/14 passed; production build passed; git diff --check passed. Vite main bundle remains about 6.0 MB minified.

A real UI defect was found and fixed while adding browser automation: the full-screen Babylon canvas intercepted clicks on language/account controls in the top bar. The top bar and stats region now explicitly enable pointer events.

## Next exact task
Implement the P3 progression/unlock screen with clear upcoming unlock requirements, then add focused unit/browser coverage. Expand responsive/localization checks beyond 320x568. Keep PR #2 in Draft and do not merge automatically.

## Session update rule
At the end of each substantial session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, next task, commit and CI run.
- Update docs/ROADMAP.md / docs/WORK_BREAKDOWN_STRUCTURE.md when scope or order changes.
- Record product/architecture changes in docs/DECISIONS.md.
- Never mark code complete just because it was written or uploaded.