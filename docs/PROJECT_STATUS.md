# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (explicitly approved by user).
- Default branch: main
- Development branch: feat/p2-core-game-loop
- PR #1: https://github.com/ijoolaie/empire-of-companies/pull/1 (Draft; not merged).
- Latest pushed commit: 2fecf6e6b0fe156979f71884ef5005b44c8164ef.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies

## Implemented on the P2 branch
- Versioned local GameState v3 and guarded save parsing.
- Legacy save-key lookup and basic v2-to-v3 shape migration.
- Passive income based on workers and office level.
- Desk capacity check before hiring.
- Desk construction with cash, bounds, integer-coordinate and overlap checks.
- Office upgrade with level-based cost.
- Offline earnings calculation capped at 8 hours.
- HUD updates for cash, income, employees and level.
- Persian/English labels for new actions.
- Ten deterministic Node tests covering economy and save behavior.

## Verified
- Environment: Node v22.23.2 / npm 10.9.8.
- package-lock.json committed; clean npm ci succeeds and audit reports 0 vulnerabilities.
- npm test: 10 passed, 0 failed.
- npm run build: TypeScript and Vite production build passed.
- GitHub Actions run #24 (41995386118) on the latest commit completed successfully: npm ci, build and tests all passed.
- Local HTTP smoke: Vite serves index.html and transformed main/game modules with HTTP 200; index includes the game canvas.
- Headless Chrome generated a 1365x900 screenshot; sampled image pixels were non-uniform (240 unique sampled colors), consistent with a rendered scene.
- The screenshot was temporary and removed after verification.
- Full interactive browser gameplay (desk placement, hiring, income, upgrade, refresh/restore) is NOT yet verified.

## Open issues / unverified
- Interactive browser acceptance: build desk, hire, wait for income, upgrade, refresh and reopen.
- Offline earnings and save migration have automated coverage but no manual browser verification.
- Supabase sign-up/sign-in and redirect settings have not been end-to-end tested.
- PWA behavior and Android packaging are not implemented/verified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.
- Large Babylon.js main chunk (~6.0 MB minified) needs performance/code-splitting work.

## Current phase
P1 reproducible engineering is complete: committed lockfile, clean npm ci, tests, build and CI all pass. P2 economy/save logic and automated tests are implemented. Initial headless browser render is smoke-tested; interactive gameplay remains the P2 acceptance gate.

## Immediate next actions
1. Complete interactive browser QA for build desk, hire, passive income, upgrade and save/restore.
2. Fix any defects found and add regression tests.
3. Verify offline earnings and migration in browser.
4. Keep PR #1 Draft until the gameplay acceptance gate passes; merge only after verification.
5. Continue P3 progression and UX after P2 acceptance.
