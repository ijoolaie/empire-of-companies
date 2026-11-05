# Session Handoff — Read First

Last updated: 2026-11-05

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
- Remote branch commit at clone: 03b4011f11d0e880f485e0a10690861f61155012.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.
- Node v22.23.2; npm 10.9.8.
- package-lock.json generated locally.
- npm ci, npm test (10/10) and npm run build passed locally.
- Workflow changed locally to npm ci with npm cache; changes are not yet committed/pushed.
- Browser gameplay smoke test remains pending.

## Current phase
P1 reproducible engineering is locally verified. P2 core economy/save implementation and automated tests are complete in code; browser acceptance remains pending.

## Next exact task
Review git diff, commit package-lock.json + CI workflow + docs/.gitignore changes, push to feat/p2-core-game-loop, and verify the new GitHub Actions run. Then perform browser smoke test before merging PR #1.

## Session update rule
At the end of each substantial session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, next task, commit and CI run.
- Update docs/ROADMAP.md / docs/WORK_BREAKDOWN_STRUCTURE.md when scope or order changes.
- Record product/architecture changes in docs/DECISIONS.md.
- Never mark code complete just because it was written or uploaded.
