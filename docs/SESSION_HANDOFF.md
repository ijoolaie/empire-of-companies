# Session Handoff — Read First

Last updated: 2026-11-06 — refined A* worker routing to use a shared entrance and fixed obstacle footprints; local verification: 20 unit tests, production build and 10 browser tests.

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
- Latest pushed implementation head: 534577e; CI run #58 (42174797995) passed for that commit; current branch head before this local change is 3bd75c6.
- Local uncommitted refinement: route workers from a shared office entrance to their desks, avoiding desk, planter, and structural wall footprints; added 4 focused navigation tests, including a reserved entrance-lane case.
- Local verification after refinement: 21 unit tests, production build, 10 browser tests and diff check pass.
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
- npm test: 14/14 passed.
- npm run build: passed.
- npm run test:browser: 10/10 passed; hiring regression asserts walking count becomes 1 then returns to 0.
- git diff --check: passed.
- Previous Babylon/main chunk: 6,026.40 kB minified / 1,322.29 kB gzip.
- Current build after direct module imports: largest app chunk 1,141.33 kB minified / 281.81 kB gzip; >500 kB warning remains.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for 1991369.
- Manual Chromium screenshots at 1280x720 and 375x667 confirm the seated worker is visible in the default view. The mobile panel hides XP/objective details but keeps the tutorial and progression dialog reachable; alternate camera angles remain to review.

## Exact next task
Current local refinement routes new hires from the shared entrance to their assigned desks using bounded A*, avoiding desk, planter and structural wall footprints. Active worker paths are temporarily reserved as obstacle corridors, and subsequent hires try alternate entrance lanes. Local checks pass (21 unit tests, production build, 10 browser tests, diff check). Next: add browser coverage for rapid consecutive hires, then verify CI. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.

## Latest navigation refinement
- Added src/navigation.ts: tests two lateral approach routes against nearby desk footprints and selects a clear route when one is available.
- Worker animation now follows the selected waypoint path while retaining eased timing and alternating limb swing.
- Three unit tests cover direct-lane obstruction, nearby desk layouts and deterministic route selection.
- Limitation: the office has an open front and no modeled door mesh/state; structural walls are represented as fixed navigation footprints and floor bounds. Dynamic replanning and worker-worker collision avoidance remain future work.