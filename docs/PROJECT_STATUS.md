# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (verified through GitHub repository API; explicitly approved by user).
- Default branch: main
- Current development branch: feat/p2-core-game-loop
- Last verified main commit before this branch: d7a9f2acfa0b62afa483d4f45f066285cd825e31
- CI workflow: .github/workflows/build.yml

## Implemented
- Babylon.js 3D office scene with desks and basic placement interaction.
- Basic hire and collect buttons.
- Persian/English dictionary and UI styling.
- Supabase Auth client scaffold.
- localStorage save/load scaffold.
- GitHub Actions build workflow.
- Roadmap, decisions, development guide, status and session handoff.

## Verified
- GitHub Actions run 41986757841 completed successfully on commit 33249ef5c4b856a17f0ab31e103f247316864e01.
- Both npm install and npm run build passed in GitHub Actions using Node 22.
- Repository visibility is Public, matching the user's approved decision.

## Known gaps (not yet verified as fixed)
- No committed package-lock.json; CI currently uses npm install rather than npm ci.
- No browser gameplay smoke test yet.
- Current economy is mostly static: displayed income is not driven by employee/desk production.
- No upgrade mechanic or safe offline earnings yet.
- Supabase sign-up/sign-in and redirect settings have not been end-to-end tested.
- PWA behavior and Android packaging are not implemented/verified.

## Current phase
P2 — Playable core loop. Work is beginning on a coherent economy/state model and its local persistence. P1's GitHub Actions build passes, but reproducible clean install remains open until a lockfile and npm ci are in place.

## Next actions
1. Implement a typed game state/economy model with validated local save loading.
2. Connect hiring, desk placement, upgrades and timed income to that model.
3. Add bounded offline earnings based on the last saved timestamp.
4. Add tests or deterministic checks for economy calculations and migration.
5. Generate/commit package-lock.json and move CI to npm ci.
6. Run a real browser smoke test before marking P2 complete.
