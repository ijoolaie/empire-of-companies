# Session Handoff — Read First

Last updated: 2026-11-05 — P2 interactive browser smoke test passed

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
- Code commit verified by CI: 2fecf6e6b0fe156979f71884ef5005b44c8164ef.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.
- Node v22.23.2; npm 10.9.8.
- package-lock.json committed; CI uses npm ci and npm cache.
- GitHub Actions run #24 (41995386118) passed.
- Local npm ci, npm test (10/10), and npm run build passed.
- Headless Chrome gameplay smoke passed: desk placement, hire, upgrade, passive income, save/refresh persistence, simulated 60-second offline earnings, and Persian RTL/English LTR toggle. No runtime exceptions observed.
- Supabase Auth and wider QA remain pending.

## Current phase
P2 core gameplay acceptance smoke test passed locally. P1 reproducible engineering and GitHub CI are green. PR #1 remains Draft and is not merged.

## Next exact task
Create repeatable browser regression automation and wire it into CI. Then verify Supabase Auth flows separately, without moving game save data to the cloud. Continue P3 progression and UX once the test automation is stable.

## Session update rule
At the end of each substantial session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, next task, commit and CI run.
- Update docs/ROADMAP.md / docs/WORK_BREAKDOWN_STRUCTURE.md when scope or order changes.
- Record product/architecture changes in docs/DECISIONS.md.
- Never mark code complete just because it was written or uploaded.
