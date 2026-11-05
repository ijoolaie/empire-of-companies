# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (explicitly approved by user).
- Default branch: main
- Development branch: feat/p2-core-game-loop
- PR #1: https://github.com/ijoolaie/empire-of-companies/pull/1 (Draft; not merged).
- Latest remote branch commit at clone: 03b4011f11d0e880f485e0a10690861f61155012.
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

## Verified locally (Node v22.23.2 / npm 10.9.8)
- npm install generated package-lock.json (lockfileVersion 3).
- npm ci completed successfully; audit reported 0 vulnerabilities.
- npm test: 10 passed, 0 failed.
- npm run build: TypeScript and Vite production build passed.
- Vite reports a large main JS chunk (~6.0 MB minified); code splitting/performance optimization remains future work.
- Browser gameplay has not yet been manually verified.

## Current unpushed local changes
- Add package-lock.json.
- Change GitHub Actions from npm install to npm ci and enable setup-node npm cache.
- Update DEVELOPMENT.md to use npm ci.
- Ignore generated *.tsbuildinfo files.
- Local validation after npm ci passed; remote CI must run after push.

## Open issues / unverified
- Browser gameplay smoke test: build desk, hire, wait for income, upgrade, refresh and reopen.
- Offline earnings and save migration have automated coverage but no manual browser verification.
- Supabase sign-up/sign-in and redirect settings have not been end-to-end tested.
- PWA behavior and Android packaging are not implemented/verified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.
- Large Babylon.js bundle needs performance/code-splitting work.

## Current phase
P1 reproducible engineering: local lockfile, clean npm ci, tests and build are verified. CI workflow changes are prepared locally but not yet pushed. P2 core economy/save logic and automated tests are implemented; browser smoke test remains the P2 acceptance gate.

## Immediate next actions
1. Review and commit the lockfile, CI and documentation changes; push to the existing Draft PR #1.
2. Confirm GitHub Actions passes with npm ci.
3. Run a real browser smoke test and record observed results.
4. Fix any gameplay defects; only then consider merging PR #1.
5. Continue P3 progression and UX after P2 acceptance.
