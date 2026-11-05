# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (verified through GitHub API and explicitly approved by user).
- Default branch: main
- Current development branch: feat/p2-core-game-loop
- Current PR: #1 — https://github.com/ijoolaie/empire-of-companies/pull/1 (Draft)
- CI workflow: .github/workflows/build.yml
- Latest P2 commit: 83abfd219b27b6852b222679f40f5e0c25397fe8

## Implemented on the P2 branch
- Versioned local GameState v3 and guarded save parsing.
- Legacy save-key lookup.
- Passive income based on workers and office level.
- Desk capacity check before hiring.
- Desk construction with cash and proximity checks.
- Office upgrade with level-based cost.
- Offline earnings calculation capped at 8 hours.
- HUD updates for cash, income, employees and level.
- Persian/English labels for new actions.
- Updated product decisions and session handoff.
- Detailed end-to-end work breakdown at docs/WORK_BREAKDOWN_STRUCTURE.md.

## Verified
- Earlier baseline CI run 41986757841 passed.
- P2 PR workflow run 41987694567 completed with conclusion=success.
- In run 41987694567, npm install and npm run build passed.
- Repository visibility is Public.
- Branch build is verified; browser gameplay is not yet verified.

## Open issues / unverified
- No committed package-lock.json; CI still uses npm install rather than npm ci.
- No automated unit tests for economy/save behavior yet.
- No real browser gameplay smoke test yet.
- Offline earnings and save migration have not been manually tested.
- Supabase sign-up/sign-in and redirect settings have not been end-to-end tested.
- PWA behavior and Android packaging are not implemented/verified.
- Existing 3D worker visuals/animation and worker-to-desk assignment need implementation; the current economy model is ahead of visible character simulation.

## Current phase
P2 — Playable core loop. Initial economy implementation is submitted in Draft PR #1. CI passes. The next gate is deterministic tests plus real browser smoke testing, then lockfile/npm ci.

## Immediate next actions
1. Inspect the P2 branch diff for logic defects and fix them.
2. Add tests for parse/migration, income, hiring, desk placement, upgrade and offline cap.
3. Generate package-lock.json using npm install on the project toolchain and commit it.
4. Switch CI to npm ci and rerun.
5. Run browser smoke test: build desk, hire, earn, upgrade, refresh, close/reopen.
6. Merge PR #1 only after checks and manual gameplay pass.
