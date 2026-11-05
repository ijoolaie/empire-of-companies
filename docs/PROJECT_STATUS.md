# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest remote functional commit before this local slice: bae936f.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2 (open, Draft, not merged).
- CI run #33 (42063106976) passed for bae936f, including Chromium browser tests.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Phase status
- P0/P1 complete.
- P2 playable core loop complete and merged.
- P3 progression/onboarding/UX active.
- P4 3D content active at an initial procedural-worker slice; not complete.

## P3 implemented and verified
- Save schema v4, legacy migration, player XP and level.
- Three ordered milestones with one-time cash/XP rewards.
- Skippable first-run tutorial.
- Persian/English and RTL/LTR.
- Progression dialog with current XP, milestone states/rewards, and planned roadmap at levels 3, 5 and 10.
- Dialog accessibility: modal semantics, accessible description, Escape/backdrop/close-button dismissal, keyboard focus containment and focus restoration.
- Playwright CI suite covering progression, persistence, localization, accessibility and responsive layouts.

## P4 initial procedural worker slice (local, not yet pushed)
- Procedural seated worker models are attached to the first staffed desk positions.
- Hiring calls syncWorkers and creates the additional worker model at the next available desk.
- Workers have basic skin/shirt/hair meshes and a subtle idle vertical motion.
- A canvas data attribute exposes current rendered worker-model count for browser regression checks.
- No external assets or Blender dependency.
- Work/walk animations, character variants, detailed poses, scene profiling and visual manual acceptance remain open.

## Local verification for current uncommitted slice
- npm test: 14 passed, 0 failed.
- npm run build: passed.
- npm run test:browser: 8 passed, 0 failed; existing progression/mobile/accessibility suite plus worker model-count assertion.
- git diff --check: passed.
- Babylon main chunk warning remains: about 6,025.15 kB minified / 1,321.96 kB gzip.
- Current worker visual slice is not yet committed, pushed or CI-verified.

## Open
- Review worker model proportions/placement visually in a real browser session.
- Commit and push the worker slice; verify GitHub Actions.
- Continue P3 screen-reader, HUD hierarchy and responsive UX work.
- Continue P4 worker work-state animation, variants, furniture details and performance profiling.
- Supabase Auth lifecycle remains unverified.
- PWA and Android packaging remain unimplemented.

## Next actions
1. Review the worker model implementation and browser regression changes.
2. Commit and push to feat/p3-progression-ux; verify CI before calling the slice CI-verified.
3. Improve worker poses/work animation and profile scene complexity.
4. Keep PR #2 Draft and unmerged unless explicitly requested.
5. Keep game saves device-local; Supabase remains identity-only.
