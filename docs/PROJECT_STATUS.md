# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (explicitly approved by user).
- Default branch: main
- Development branch: feat/p2-core-game-loop
- PR #1: https://github.com/ijoolaie/empire-of-companies/pull/1 (Draft; not merged).
- Latest code commit verified by CI: 2fecf6e6b0fe156979f71884ef5005b44c8164ef.
- Documentation follow-up commit: 780db9dbc274897f308091483b8d858a9a19288b.
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
- GitHub Actions run #24 (41995386118) on code commit 2fecf6e completed successfully: npm ci, build and tests all passed.
- Headless Chrome interactive smoke test passed against the local Vite app using Chrome DevTools Protocol:
  - Initial UI and Babylon canvas loaded (canvas 762x484).
  - English LTR and Persian RTL language toggles passed.
  - Placed a desk at (3, 2); desk count increased to 3 and cash decreased to 11,000.
  - Hired a second worker and upgraded office to level 2.
  - Passive income accrued while the test waited (cash reached 3,524 after the 3,500 post-action balance).
  - Saved and reloaded; workers, level and all 3 desks persisted.
  - Simulated 60 seconds offline; offline earnings notice appeared and cash increased to 4,741.
  - No JavaScript runtime exceptions were observed.
- Temporary browser test scripts and screenshots were removed; working tree is clean after documentation commit.

## Open issues / unverified
- Supabase sign-up/sign-in and redirect settings have not been end-to-end tested.
- PWA behavior and Android packaging are not implemented/verified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.
- Large Babylon.js main chunk (~6.0 MB minified) needs performance/code-splitting work.
- Additional browser coverage is needed for malformed/legacy saves and longer idle/offline scenarios.

## Current phase
P1 reproducible engineering is complete. P2 core economy, desk placement, hiring, upgrade, passive income, refresh persistence and a simulated offline-earnings browser path have passed smoke testing. Supabase Auth and broader QA remain open.

## Immediate next actions
1. Add browser regression automation to the project so the verified gameplay path is repeatable in CI.
2. Complete Supabase Auth end-to-end checks separately; game saves must remain device-local.
3. Continue P3 progression and UX: tutorial, objectives, XP/levels, unlocks, milestones, responsive layout and settings.
4. Plan worker visuals/animation and visible desk assignment for the 3D content phase.
5. Address Babylon.js bundle size with measured code splitting/performance work.
6. Keep PR #1 Draft until the remaining review/acceptance criteria are satisfied; do not merge automatically.
