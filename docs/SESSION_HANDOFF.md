# Session Handoff — Read First

Last updated: 2026-11-05 — P2 economy implementation submitted; CI passed

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
- Current branch: feat/p2-core-game-loop.
- Current Draft PR: #1.
- Latest P2 commit: 83abfd219b27b6852b222679f40f5e0c25397fe8.
- Latest P2 workflow run: 41987694567 — completed successfully.
- npm install and npm run build passed in that run.
- package-lock.json is not committed; npm ci remains pending.
- Browser gameplay smoke test is pending.

## Current phase
P2 — Playable core loop.

## Next exact task
Review the P2 diff and add deterministic tests for economy/save logic. Then generate package-lock.json, switch CI to npm ci, and perform browser smoke tests before merging.

## Session update rule
At the end of each substantial session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, next task, commit and CI run.
- Update docs/ROADMAP.md / docs/WORK_BREAKDOWN_STRUCTURE.md when scope or order changes.
- Record product/architecture changes in docs/DECISIONS.md.
- Never mark code complete just because it was written or uploaded.
