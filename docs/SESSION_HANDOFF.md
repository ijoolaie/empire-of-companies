# Session Handoff — Read First

Last updated: 2026-11-06 — worker lower-body orientation corrected; CI run #40 passed.

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
- Latest pushed commit: 1991369 — fix: orient seated worker legs toward desk.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2.
- CI run #40 (42109392998) passed for 1991369, including Chromium browser tests.
- Local path: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Current phase and work
P3 progression/usability remains active. P4 has started with an initial procedural worker visual slice:
- OfficeGame.syncWorkers(count) creates seated procedural worker models for staffed desks and removes excess worker nodes.
- Hiring synchronizes the scene after the economy action succeeds.
- Models use primitive Babylon meshes/materials, seated torso/arms, procedural thighs, lower legs and shoes, subtle body motion and typing/arm motion; desk chair backrests are added.
- Lower-body coordinates were corrected so thighs, shins and shoes extend toward the desk rather than the rear of the chair.
- Canvas data-worker-model-count and data-worker-leg-mesh-count are used by Playwright to verify initial/hired worker and leg/shoe mesh counts.
- No external assets or Blender.

## Local verification
- npm test: 14/14 passed.
- npm run build: passed.
- npm run test:browser: 8/8 passed.
- git diff --check: passed.
- Babylon main chunk warning: 6,026.40 kB minified / 1,322.29 kB gzip.
- CI run #36 (42107749624) passed for 2146410.
- CI run #37 (42108774779) passed for 7019cdc.
- CI run #38 (42108661210) passed for 8c445bc.
- CI run #40 (42109392998) passed for 1991369.
- Visual acceptance on a real browser display is still outstanding; automated checks do not prove model aesthetics.

## Exact next task
Obtain a screenshot-capable browser review of worker proportions/placement. Then improve worker poses/variants, add meaningful visual regression coverage, and profile scene complexity. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.
