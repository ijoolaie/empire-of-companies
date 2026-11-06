# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest pushed implementation head: 9a3eab4. CI run #62 (42178572610) passed; rapid consecutive-hire browser regression is now added locally and awaiting commit/CI.
- A* arrival routing starts at a shared office entrance and avoids desk, planter, and structural wall footprints; seven navigation tests cover entrance routing, fixed obstacles, blocked entrance fallback, deterministic routing, office bounds, and alternate entry lanes around a reserved worker route. Active worker routes are reserved for later hires; an 11th browser test covers two consecutive hires.
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
- Arrival now uses deterministic bounded A* from a shared entrance to each assigned desk, avoiding desk footprints, the two planter footprints, and the structural back/side wall footprints while remaining inside office bounds. The office has no modeled door mesh or doorway state; navigation is still static and uses temporary corridor reservations to separate new hires while an earlier worker is still walking; it does not replan dynamically after movement starts. Character variants, detailed poses, scene profiling and broader mobile/multi-angle visual acceptance remain open.
- Direct Babylon module imports replaced the root barrel import; Vite transforms 464 modules instead of 2,221.
- Material reuse now prevents per-worker duplication of shared skin/hair/trouser/shoe materials and desk furniture materials; only four shirt-color variants are allocated.

## Verification
- npm test: 21 passed, 0 failed (includes 7 navigation-planner tests).
- npm run build: passed.
- npm run test:browser: 11 passed, 0 failed; includes a rapid consecutive-hire regression verifying two workers can walk concurrently using separate reserved entrance corridors.
- git diff --check: passed.
- Babylon/main application chunk after direct module imports: about 1,142.55 kB minified / 282.20 kB gzip (about 81% smaller minified and 79% smaller gzip than the previous 6,026.40 / 1,322.29 kB bundle). The >500 kB warning remains.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for historical commit 1991369. Head 7a1c861 passed CI run #55 (42170042512); head 87c3939 is under CI run #56 (42174090774).
- Automated tests verify model synchronization and mesh counts; manual Chromium review separately verified that the worker is visible in the 1280x720 default camera view after the angle correction.

## Open
- Manual Chromium visual review completed at 1280x720 and 375x667: default camera angle now shows the seated worker; compact mobile panel keeps the worker/office visible while tutorial and progression remain reachable. Alternate camera angles and other device sizes remain open.
- Continue P3 screen-reader, HUD hierarchy and responsive UX work.
- Continue P4 worker work-state animation, variants, furniture details and performance profiling.
- Supabase Auth lifecycle remains unverified.
- PWA and Android packaging remain unimplemented.

## Next actions
1. Review alternate camera angles and additional device sizes; desktop and 375x667 default views now show the seated worker.
2. Commit/push the rapid consecutive-hire browser regression and refreshed handoff, then verify CI. Model an actual doorway only when the office scene gains a front wall/door mesh.
3. Profile scene mesh/material counts and address the large Babylon bundle with measured changes.
4. Keep PR #2 Draft and unmerged unless explicitly requested.
5. Keep game saves device-local; Supabase remains identity-only.