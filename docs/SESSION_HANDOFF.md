# Session Handoff — Read First

Last updated: 2026-11-06 — worker leg/shoe detail added locally; previous CI runs #36 and #37 passed

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
- Latest pushed feature commit before current local changes: 669f48c — docs: record procedural worker progress. CI run #36 (42107749624) passed for 2146410 and CI run #37 (42107889996) passed for 669f48c.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2.
- CI run #33 (42063106976) passed for bae936f.
- Local path: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Current phase and work
P3 progression/usability remains active. P4 has started with an initial procedural worker visual slice:
- OfficeGame.syncWorkers(count) creates seated procedural worker models for staffed desks and removes excess worker nodes.
- Hiring synchronizes the scene after the economy action succeeds.
- Models use primitive Babylon meshes/materials, seated torso/arms, procedural thighs, lower legs and shoes, subtle body motion and typing/arm motion; desk chair backrests are added. No external assets or Blender.
- Canvas data-worker-model-count and data-worker-leg-mesh-count are used by Playwright to verify initial/hired worker and leg/shoe mesh counts.

## Local verification
- npm test: 14/14 passed.
- npm run build: passed.
- npm run test:browser: 8/8 passed, including initial worker count and second worker after hiring.
- git diff --check: passed.
- Babylon main chunk warning: about 6,025.15 kB minified / 1,321.96 kB gzip.
- CI run #35 (42106950970) passed for e506463.
- CI run #36 (42107749624) is in progress for 2146410; local unit/build/browser tests passed.
- Visual acceptance on a real browser display is still outstanding; automated checks do not prove model aesthetics.

## Exact next task
Review the worker model placement/proportions and diff. Then commit/push to feat/p3-progression-ux and verify GitHub Actions. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.
