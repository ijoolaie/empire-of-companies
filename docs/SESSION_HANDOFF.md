# Session Handoff — Read First

Last updated: 2026-11-06 — CI #74 passed for 3256a3d; zero/five-worker profiling comparison added. Profiling is now opt-in with `?profile=1`; latest local verification 22 unit tests, build and 16 browser tests.

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
- Latest pushed branch head: a4f2889; CI run #74 (42195334818) passed for 3256a3d. A follow-up local change makes profiling opt-in with `?profile=1`; full-suite verification and push remain.
- Committed: shared-entrance A* routing with desk/planter/structural-wall obstacles, temporary active-worker corridor reservations, rapid-hire coverage across two desk layouts, cached route lengths, and 84 edge-of-office desk/lane regression combinations.
- Local verification after profiling instrumentation: 22 unit tests, production build, 16 browser tests and diff check pass.
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
- npm run test:browser: 16/16 passed; includes three concurrent arrivals in two desk layouts, camera zoom clamping and pointer-drag orbit, responsive checks at six viewport sizes, and rolling scene profiling with five workers.
- git diff --check: passed.
- Previous Babylon/main chunk: 6,026.40 kB minified / 1,322.29 kB gzip.
- Current build after direct module imports: largest app chunk 1,145.60 kB minified / 283.55 kB gzip; >500 kB warning remains.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for 1991369.
- Manual Chromium screenshots at 1280x720 and 375x667 confirm the seated worker is visible in the default view. The mobile panel hides XP/objective details but keeps the tutorial and progression dialog reachable; alternate camera angles remain to review.

## Exact next task
CI run #73 (42188157426) passed for 3c6d180; CI run #74 (42195334818) passed for profiling commit 3256a3d. CI run #75 (42195870111) is running for comparison-test commit a4f2889. Optional render-loop profiling (enabled with `?profile=1`) samples CPU timing in fixed 120-frame windows and publishes average/p95/max CPU frame duration plus scene mesh/active-mesh/material/light counts. Normal play does not register the profiling after-render observer. A same-session headless Chromium comparison with identical five-desk layouts measured zero workers at 2.478 ms average / 8.9 ms p95 / 29.2 ms max, with 71 meshes, 15 materials and 2 lights; five workers measured 3.635 ms average / 10.6 ms p95 / 24.6 ms max, with 115 meshes, 18 materials and 2 lights. Five workers added 44 meshes and 3 materials. Timing covers CPU scene-render duration, not GPU completion; this single headless comparison is not a target-device benchmark. Local checks: 22 unit tests, production build, 16 browser tests and git diff --check pass. A follow-up browser test now measures both zero-worker and five-worker cases with the same five-desk layout. Local comparison: zero workers 2.478 ms average / 8.9 ms p95 / 29.2 ms max, 71 meshes and 15 materials; five workers 3.635 ms average / 10.6 ms p95 / 24.6 ms max, 115 meshes and 18 materials. Five workers add 44 meshes and 3 materials. Next: finish CI #74, push the comparison-test/documentation refinement, then inspect whether repeated worker parts can be combined without harming animation or appearance. Alternate-angle visual/screenshot acceptance remains unverified. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.

## Latest navigation refinement
- `src/navigation.ts` uses bounded deterministic A* from a shared entrance to each assigned desk, avoiding desk, planter and structural wall footprints.
- Each active arrival path is converted to temporary obstacle corridors; subsequent hires try alternate entrance lanes to avoid overlapping earlier routes.
- Eight unit tests cover entrance routing, obstacle avoidance, deterministic results, office bounds, blocked entrance fallback, alternate lane routing, and 84 edge-of-office desk/entrance-lane combinations against the scene's fixed obstacles.
- Browser regression now hires three workers in rapid succession, verifies three concurrent walking states, waits for all to settle, and checks persisted worker count.
- Limitation: the office has an open front and no modeled door mesh/state; reservations are static for the 1.6-second walk and do not dynamically replan after movement starts.