# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest pushed head: a4f2889; CI run #74 (42195334818) passed for 3256a3d. CI run #75 (42195870111) is running for a4f2889. A local follow-up makes profiling opt-in via `?profile=1`; latest local verification includes 22 unit tests, production build, 16 browser tests and diff check.
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
- Canvas data attributes expose worker-model count and leg/shoe mesh count. Optional profiling is enabled only with `?profile=1`; it publishes rolling CPU render timing (average/p95/max over 120 frames) and scene mesh/active-mesh/material/light counts. Normal play does not register the profiling after-render observer. A same-session headless Chromium comparison (same five desks) measured zero workers at 2.478 ms average / 8.9 ms p95 / 29.2 ms max, with 71 meshes, 15 materials and 2 lights; five workers measured 3.635 ms average / 10.6 ms p95 / 24.6 ms max, with 115 meshes, 18 materials and 2 lights. The five-worker case added 44 scene meshes and 3 materials. CPU timings cover the scene render call, not GPU completion; this is a single headless-browser comparison, not a target-device benchmark.
- Desk materials are cached and reused; worker skin/hair/trousers/shoes share materials, and shirt material is cached per one of four palette variants. Browser coverage verifies the fifth worker reuses the first variant without allocating a new material.
- No external assets or Blender dependency.
- Arrival uses deterministic bounded A* from a shared entrance to each assigned desk, avoiding desk, planter and structural wall footprints. Active routes are temporarily reserved for later hires; there is no dynamic replanning or modeled door yet. Worker route lengths are cached at hire time. Character variants, detailed poses and broader mobile/multi-angle visual acceptance remain open.
- Direct Babylon module imports replaced the root barrel import; Vite transforms 464 modules instead of 2,221.
- Material reuse now prevents per-worker duplication of shared skin/hair/trouser/shoe materials and desk furniture materials; only four shirt-color variants are allocated.

## Verification
- npm test: 22 passed, 0 failed (includes 8 navigation-planner tests; new edge-layout test checks 84 desk/lane combinations).
- npm run build: passed.
- npm run test:browser: 16 passed, 0 failed; includes rapid-hire routing, camera zoom clamping and pointer-drag orbit, six viewport sizes, and rolling CPU frame/scene profiling with five workers.
- git diff --check: passed.
- Babylon/main application chunk after direct module imports: about 1,142.55 kB minified / 282.20 kB gzip (about 81% smaller minified and 79% smaller gzip than the previous 6,026.40 / 1,322.29 kB bundle). The >500 kB warning remains.
- GitHub Actions run #62 (42178572610) passed for 9a3eab4; run #64 (42179352858) passed for 195f2c5; run #66 (42180394613) passed for 08e2cfa; CI run #67 (42181556728) passed for ad9d934, including build, unit tests, Chromium and all 12 browser tests.
- Automated tests verify model synchronization and mesh counts; manual Chromium review separately verified that the worker is visible in the 1280x720 default camera view after the angle correction.

## Open
- Manual Chromium visual review completed at 1280x720 and 375x667: default camera angle now shows the seated worker; compact mobile panel keeps the worker/office visible while tutorial and progression remain reachable. Alternate camera angles and other device sizes remain open.
- Continue P3 screen-reader, HUD hierarchy and responsive UX work.
- Continue P4 worker work-state animation, variants, furniture details and performance profiling. Camera beta is constrained to 0.7–1.35 radians and zoom radius to 10–22; zoom clamping and pointer-drag orbit are automated. Alternate-angle visual/screenshot acceptance remains unverified.
- Supabase Auth lifecycle remains unverified.
- PWA and Android packaging remain unimplemented.

## Next actions
1. Perform visual acceptance of alternate camera angles and additional device sizes; automated responsive checks now cover six viewport sizes, but alternate-angle screenshots have not been reviewed.
2. CI run #73 passed for 3c6d180. New rolling frame-time and scene-count instrumentation is locally verified; push and verify CI. Edge-of-office routes have unit coverage across 84 combinations. Alternate-angle visual acceptance remains open.
3. Profile scene mesh/material counts and address the large Babylon bundle with measured changes.
4. Keep PR #2 Draft and unmerged unless explicitly requested.
5. Keep game saves device-local; Supabase remains identity-only.
6. Profile worker/render-loop cost with measured frame-time and scene-count evidence before further optimization.