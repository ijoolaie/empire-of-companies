# Session Handoff — Read First

Last updated: 2026-11-05

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
- Private GitHub repo.
- Do not claim build, gameplay, or auth is verified without a successful test.

## Last verified repository baseline
Commit: 7d210c2f0362fb445b87fbf455a3a4f8439b5e64
Source files exist in main. CI workflow is .github/workflows/build.yml.
Latest observed CI run: 41985209822 — failed in setup-node because npm caching expected a lockfile which did not exist. npm install and npm run build were skipped. This is not an app build failure.

## Current phase
P0 continuity docs + P1 reproducible build.

## Immediate next steps
1. Fix workflow to avoid npm cache until package-lock.json is committed.
2. Trigger and inspect CI.
3. Commit package-lock.json using npm install in a Node 22 environment; switch CI to npm ci + cache.
4. Fix only the real TypeScript/build errors exposed by CI.
5. Update PROJECT_STATUS.md and this handoff with commit SHA, run ID, exact outcomes.
6. Then begin P2 core loop work.

## Session update rule
At the end of every substantial work session:
- Update docs/PROJECT_STATUS.md with verified facts only.
- Update docs/SESSION_HANDOFF.md with current phase, exact next command/task, latest commit and CI run.
- Update ROADMAP.md only when scope/order/exit criteria change.
- Record any changed product/architecture decision in DECISIONS.md.
- Never mark a task done merely because code was drafted or uploaded; require an observable test.
