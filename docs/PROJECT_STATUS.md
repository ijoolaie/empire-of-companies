# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest implementation commit: d662645 — perf: narrow Babylon imports and reduce bundle; a documentation-only handoff follow-up is also pushed.
- PR #2 remains open and Draft; one additional local documentation-only commit is pending push after a temporary GitHub connectivity failure.
- CI for the latest remote head has not yet been confirmed.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2 (open, Draft, not merged).
- GitHub Actions run #40 (42109392998) passed for 1991369, including Chromium browser regression tests.
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

## P4 initial procedural worker slice
- Procedural seated worker models are attached to the first staffed desk positions.
- Hiring calls syncWorkers and creates the additional worker model at the next available desk.
- Workers have skin/shirt/hair meshes, seated torso/arm poses, procedural thighs, lower legs and shoes; lower-body positions are oriented toward the desk. Subtle body motion and simple typing/arm motion remain.
- Desk furniture includes a chair backrest.
- Canvas data attributes expose worker-model count and expected leg/shoe mesh count for browser regression checks.
- No external assets or Blender dependency.
- Work/walk animations, character variants, detailed poses, scene profiling and visual manual acceptance remain open.
- Direct Babylon module imports replaced the root barrel import; Vite transformed 464 modules instead of 2,221 and reduced the largest application chunk substantially.

## Verification
- npm test: 14 passed, 0 failed.
- npm run build: passed.
- npm run test:browser: 8 passed, 0 failed.
- git diff --check: passed.
- Babylon/main application chunk after direct module imports: 1,141.33 kB minified / 281.81 kB gzip (about 81% smaller minified and 79% smaller gzip than the previous 6,026.40 / 1,322.29 kB bundle). The >500 kB warning remains.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for latest commit 1991369, including Chromium tests.
- Automated tests verify model synchronization and mesh counts, not aesthetic quality; visual acceptance remains outstanding.

## Open
- Review worker model proportions/placement visually in a real browser session.
- Continue P3 screen-reader, HUD hierarchy and responsive UX work.
- Continue P4 worker work-state animation, variants, furniture details and performance profiling.
- Supabase Auth lifecycle remains unverified.
- PWA and Android packaging remain unimplemented.

## Next actions
1. Obtain a screenshot-capable browser review of worker proportions and placement.
2. Improve worker poses/variants and add meaningful visual regression coverage where feasible.
3. Profile scene mesh/material counts and address the large Babylon bundle with measured changes.
4. Keep PR #2 Draft and unmerged unless explicitly requested.
5. Keep game saves device-local; Supabase remains identity-only.
