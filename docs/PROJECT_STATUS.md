# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (verified through GitHub API and explicitly approved by user).
- Default branch: main
- Current development branch: feat/p2-core-game-loop
- Current PR: #1 — https://github.com/ijoolaie/empire-of-companies/pull/1 (Draft)
- Latest branch commit: 333d4cf6e7f6145f019b11c8d3389695a0b8cf4e
- Latest code commit covered by successful CI: 5d310faace22ad1ed8366c95d2dd150cf85c3efa
- CI workflow: .github/workflows/build.yml

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
- Ten deterministic Node built-in tests covering starter state, hiring, desk placement, upgrade, elapsed earnings, offline cap, save restore, legacy migration, malformed saves and future timestamps.
- Full end-to-end work breakdown at docs/WORK_BREAKDOWN_STRUCTURE.md; linked from English and Persian READMEs.

## Verified
- Baseline CI run 41986757841 passed.
- Initial P2 build run 41987694567 passed.
- Latest test-enabled P2 CI run 41988139202 completed with conclusion=success.
- In run 41988139202, npm install, npm run build and npm test all completed successfully.
- Repository visibility is Public.
- Code build and automated economy/save tests pass; browser gameplay is not yet verified.

## Open issues / unverified
- No committed package-lock.json; CI still uses npm install rather than npm ci.
- No real browser gameplay smoke test yet.
- Offline earnings and save migration have automated coverage but have not been manually tested in a browser.
- Supabase sign-up/sign-in and redirect settings have not been end-to-end tested.
- PWA behavior and Android packaging are not implemented/verified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.

## Current phase
P2 — Playable core loop. Economy/save implementation and automated tests are in Draft PR #1. CI build and tests pass. Remaining gate is reproducible npm ci plus browser smoke test.

## Immediate next actions
1. Generate and commit package-lock.json using Node 22/npm for this project.
2. Switch CI from npm install to npm ci with npm caching.
3. Run CI again and confirm clean install/build/tests.
4. Perform browser smoke test: build desk, hire, wait for income, upgrade, refresh, close/reopen.
5. Fix any gameplay defects and update docs with observed results.
6. Merge PR #1 only after the browser smoke test passes.
