# Session Handoff — Read First

Last updated: 2026-11-06 — CI #67 passed; added edge-of-office navigation regression coverage for 84 desk/lane combinations; local verification: 22 unit tests, build and 12 browser tests.

## Mission
Continue Empire of Companies: https://github.com/ijoolaie/empire-of-companies

## Decisions
- Babylon.js + TypeScript + Vite.
- Persian/English, RTL/LTR.
- Browser/PWA first; Android later via Capacitor.
- Procedural art first; Blender is not required.
- Game saves remain local-only; no cloud save/sync.
- Supabase Auth is identity only; no service-role secret in frontend.
- Keep PR #2 Draft; never merge without explicit request.

## Repository
- Branch: feat/p3-progression-ux.
- Latest pushed implementation head before the current uncommitted test change: ad9d934; CI run #67 (42181556728) passed, including Chromium and browser regression.
- Committed: shared-entrance A* routing with desk/planter/structural-wall obstacles, temporary active-worker corridor reservations, rapid-hire coverage across two desk layouts, and cached route lengths.
- Local verification after edge-layout coverage: 22 unit tests, production build, 12 browser tests and diff check pass.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2.
- CI run #40 (42109392998) passed for 1991369, including Chromium browser tests.
- Local path: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Current phase and work
P3 progression/usability remains active. P4 has started with an initial procedural worker visual slice:
- OfficeGame.syncWorkers(count, animateNewWorkers) creates procedural worker models for staffed desks and removes excess worker nodes; existing saves load seated, newly hired workers can animate arrival.
- Hiring synchronizes the scene after the economy action succeeds.
- Models use primitive Babylon meshes/materials, torso/arms, procedural thighs, lower legs and shoes, subtle body motion and typing/arm motion; desk chair backrests are added. New hires walk from the office open side to their assigned desk with alternating arm/leg swing, then settle into seated typing.
- Lower-body coordinates were corrected so thighs, shins and shoes extend toward the desk rather than the rear of the chair.
- Canvas data-worker-model-count, data-worker-leg-mesh-count and data-scene-material-count are used by Playwright. Desk materials are cached; worker materials are shared, with four shirt palette variants. Five-worker browser coverage verifies the fifth worker reuses variant one without increasing material count.
- No external assets or Blender.

## Local verification
- npm test: 22/22 passed, including eight navigation-planner tests.
- npm run build: passed.
- npm run test:browser: 12/12 passed; rapid-hire regression verifies three concurrent arrivals in two desk layouts, valid waypoint paths, and their transition back to seated state.
- git diff --check: passed.
- Previous Babylon/main chunk: 6,026.40 kB minified / 1,322.29 kB gzip.
- Current build after direct module imports: largest app chunk 1,145.60 kB minified / 283.55 kB gzip; >500 kB warning remains.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for 1991369.
- Manual Chromium screenshots at 1280x720 and 375x667 confirm the seated worker is visible in the default view. The mobile panel hides XP/objective details but keeps the tutorial and progression dialog reachable; alternate camera angles remain to review.

## Exact next task
CI run #67 passed for ad9d934. Edge-of-office routing is now covered by 84 desk/lane combinations in a new unit test. Next review alternate camera angles and additional device sizes. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.

## Latest navigation refinement
- `src/navigation.ts` uses bounded deterministic A* from a shared entrance to each assigned desk, avoiding desk, planter and structural wall footprints.
- Each active arrival path is converted to temporary obstacle corridors; subsequent hires try alternate entrance lanes to avoid overlapping earlier routes.
- Eight unit tests cover entrance routing, obstacle avoidance, deterministic results, office bounds, blocked entrance fallback, alternate lane routing, and 84 edge-of-office desk/entrance-lane combinations against the scene's fixed obstacles.
- Browser regression now hires three workers in rapid succession, verifies three concurrent walking states, waits for all to settle, and checks persisted worker count.
- Limitation: the office has an open front and no modeled door mesh/state; reservations are static for the 1.6-second walk and do not dynamically replan after movement starts.