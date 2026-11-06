# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest pushed branch head before current camera work: 8e06623; CI runs #69 (42183091200) and #70 (42183189353) passed. Current local camera/viewport changes: 22 unit tests, build, 14 browser tests.
- A* arrival routing starts at a shared office entrance and avoids desk, planter, and structural wall footprints; eight navigation tests cover entrance routing, fixed obstacles, blocked entrance fallback, deterministic routing, office bounds, alternate entry lanes around a reserved worker route, and 84 edge-desk/entrance-lane combinations. Active worker routes are reserved for later hires; the 12th browser test verifies three rapid arrivals in two desk layouts and checks each gets a non-fallback path.
- New hires walk from the open side of the office toward their assigned desk for 1.6 seconds, swing their arms/legs, then transition into seated typing. Restored employees remain seated on reload.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2 (open, Draft, not merged).
- GitHub Actions run #61 (42177670283) passed for 07551af; run #62 (42178572610) passed for 9a3eab4.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Phase status
- P0/P1 complete.
- P2 playable core loop complete and merged.
- P3 progression/onboarding/UX active; mobile office panel now collapses nonessential XP/objective details while preserving tutorial controls and progression access.
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
- Hiring calls syncWorkers and creates the additional worker model at the next available desk; only newly hired workers animate their arrival, while restored workers load directly into their seated state.
- Workers have skin/shirt/hair meshes, torso/arm poses, procedural thighs, lower legs and shoes; lower-body positions are oriented toward the desk. New hires perform a short arrival walk with alternating leg/arm swing, then settle into subtle idle and typing motion.
- Desk furniture includes a chair backrest.
- Canvas data attributes expose worker-model count, expected leg/shoe mesh count and scene material count for browser regression checks.
- Desk materials are cached and reused; worker skin/hair/trousers/shoes share materials, and shirt material is cached per one of four palette variants. Browser coverage verifies the fifth worker reuses the first variant without allocating a new material.
- No external assets or Blender dependency.
- Arrival now uses deterministic bounded A* from a shared entrance to each assigned desk, avoiding desk footprints, the two planter footprints, and the structural back/side wall footprints while remaining inside office bounds. The office has no modeled door mesh or doorway state; navigation is still static and uses temporary corridor reservations to separate new hires while an earlier worker is still walking; it does not replan dynamically after movement starts. Worker route segment lengths are now cached at hire time instead of recalculated each render. Character variants, detailed poses, scene profiling and broader mobile/multi-angle visual acceptance remain open.
- Direct Babylon module imports replaced the root barrel import; Vite transforms 464 modules instead of 2,221.
- Material reuse now prevents per-worker duplication of shared skin/hair/trouser/shoe materials and desk furniture materials; only four shirt-color variants are allocated.

## Verification
- npm test: 22 passed, 0 failed (includes 8 navigation-planner tests; new edge-layout test checks 84 desk/lane combinations).
- npm run build: passed.
- npm run test:browser: 14 passed, 0 failed; includes rapid-hire routing, camera zoom clamping, and six viewport sizes (320x568 through 1920x1080) for canvas, toolbar and camera bounds.
- git diff --check: passed.
- Babylon/main application chunk after direct module imports: about 1,142.55 kB minified / 282.20 kB gzip (about 81% smaller minified and 79% smaller gzip than the previous 6,026.40 / 1,322.29 kB bundle). The >500 kB warning remains.
- GitHub Actions run #62 (42178572610) passed for 9a3eab4; run #64 (42179352858) passed for 195f2c5; run #66 (42180394613) passed for 08e2cfa; CI run #67 (42181556728) passed for ad9d934, including build, unit tests, Chromium and all 12 browser tests.
- Automated tests verify model synchronization and mesh counts; manual Chromium review separately verified that the worker is visible in the 1280x720 default camera view after the angle correction.

## Open
- Manual Chromium visual review completed at 1280x720 and 375x667: default camera angle now shows the seated worker; compact mobile panel keeps the worker/office visible while tutorial and progression remain reachable. Alternate camera angles and other device sizes remain open.
- Continue P3 screen-reader, HUD hierarchy and responsive UX work.
- Continue P4 worker work-state animation, variants, furniture details and performance profiling. Camera beta is constrained to 0.7–1.35 radians and zoom radius to 10–22; zoom clamping is automated. Interactive orbit and alternate-angle visual acceptance remain unverified.
- Supabase Auth lifecycle remains unverified.
- PWA and Android packaging remain unimplemented.

## Next actions
1. Perform visual acceptance of alternate camera angles and additional device sizes; automated responsive checks now cover six viewport sizes, but alternate-angle screenshots have not been reviewed.
2. CI runs #69 and #70 passed; edge-of-office routes have unit coverage across 84 combinations. Camera zoom limits and responsive viewport checks are covered locally. Complete visual acceptance for alternate angles; model an actual doorway only when the office scene gains a front wall/door mesh.
3. Profile scene mesh/material counts and address the large Babylon bundle with measured changes.
4. Keep PR #2 Draft and unmerged unless explicitly requested.
5. Keep game saves device-local; Supabase remains identity-only.