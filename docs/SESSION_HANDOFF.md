# Session Handoff — Read First

Last updated: 2026-11-05 — public repository decision confirmed; P2 branch opened

## Mission
Continue the browser-first 3D idle management game **Empire of Companies / امپراتور شرکت‌ها** in repository https://github.com/ijoolaie/empire-of-companies.

## Read order
1. README.fa.md
2. docs/PROJECT_STATUS.md
3. docs/ROADMAP.md
4. docs/DECISIONS.md
5. docs/DEVELOPMENT.md

## Non-negotiable decisions
- Babylon.js + TypeScript + Vite.
- Persian/English, RTL/LTR.
- Browser/PWA first; Android later via Capacitor.
- Procedural art first; do not require Blender.
- Local-only game saves; Supabase Auth only.
- No service-role/secret key in frontend.
- Public GitHub repository (explicitly approved by user on 2026-11-05).
- Do not claim build, gameplay, or auth is verified without a successful test.

## Repository state
- Public visibility verified through GitHub API.
- Default branch: main.
- Last verified main commit before current work: d7a9f2acfa0b62afa483d4f45f066285cd825e31.
- Current branch: feat/p2-core-game-loop.
- CI workflow: .github/workflows/build.yml.
- Latest known successful CI run: 41986757841; npm install and npm run build passed on Node 22.
- package-lock.json is not yet committed; npm ci transition remains pending.

## Current phase
P2 — Playable core loop.

## Immediate next steps
1. Add a typed game state/economy module with safe local save parsing.
2. Integrate hire, desk construction, upgrade and timed income with it.
3. Implement capped offline earnings.
4. Add deterministic checks for state/economy logic.
5. Commit a lockfile and switch CI from npm install to npm ci.
6. Run browser smoke tests; only then mark gameplay verified.

## Session update rule
At the end of every substantial work session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, exact next task, latest commit and CI run.
- Update ROADMAP.md only when scope/order/exit criteria change.
- Record changed product/architecture decisions in DECISIONS.md.
- Never mark a task done merely because code was drafted or uploaded; require an observable test.
