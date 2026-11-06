# Session Handoff — Read First

Last updated: 2026-11-06 — CI #66 passed for three-hire routing across two desk layouts; cached worker path lengths to reduce per-frame work; local verification: 21 unit tests, build and 12 browser tests.

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
- Latest pushed implementation/test head: 08e2cfa; CI run #66 (42180394613) passed.
- Committed: shared-entrance A* routing with desk/planter/structural-wall obstacles, temporary active-worker corridor reservations, and rapid-hire coverage across two desk layouts.
- Local uncommitted optimization: cache each worker path's segment lengths and total length at hire time instead of allocating/recalculating them every render.
- Local verification: 21 unit tests, production build, 12 browser tests and diff check pass.
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
- npm test: 21/21 passed.
- npm run build: passed.
- npm run test:browser: 12/12 passed; rapid-hire regression verifies three concurrent arrivals in two desk layouts, valid waypoint paths, and their transition back to seated state.
- git diff --check: passed.
- Previous Babylon/main chunk: 6,026.40 kB minified / 1,322.29 kB gzip.
- Current build after direct module imports: largest app chunk 1,141.33 kB minified / 281.81 kB gzip; >500 kB warning remains.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for 1991369.
- Manual Chromium screenshots at 1280x720 and 375x667 confirm the seated worker is visible in the default view. The mobile panel hides XP/objective details but keeps the tutorial and progression dialog reachable; alternate camera angles remain to review.

## Exact next task
Commit and push the worker path-length caching optimization, then verify CI. Next review alternate camera angles and edge-of-office desk layouts. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.

## Latest navigation refinement
- `src/navigation.ts` uses bounded deterministic A* from a shared entrance to each assigned desk, avoiding desk, planter and structural wall footprints.
- Each active arrival path is converted to temporary obstacle corridors; subsequent hires try alternate entrance lanes to avoid overlapping earlier routes.
- Seven unit tests cover entrance routing, obstacle avoidance, deterministic results, office bounds, blocked entrance fallback and alternate lane routing.
- Browser regression now hires three workers in rapid succession, verifies three concurrent walking states, waits for all to settle, and checks persisted worker count.
- Limitation: the office has an open front and no modeled door mesh/state; reservations are static for the 1.6-second walk and do not dynamically replan after movement starts.