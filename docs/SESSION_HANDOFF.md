# Session Handoff — Read First

Last updated: 2026-11-05 — progression screen implemented locally; CI verification pending

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
- HEAD at start of this slice: 238f914; current progression screen is uncommitted.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2.
- CI run #30 (42054389812) passed for f298529, not the current uncommitted changes.
- Local path: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Current phase and work
P3 progression and usability. This session added a progression dialog with player XP/level, ordered milestone states and rewards, plus future roadmap entries at levels 3, 5 and 10. Future entries are explicitly marked planned, not playable in this build.

Local checks: 14/14 unit tests; production build passed; 6/6 Playwright browser tests passed. Browser tests cover tutorial, rewards/persistence, offline earnings, 320x568 layout, progression content, Escape dismissal, and Persian localization. Current changes still need clean-install verification, diff review, commit/push and CI.

## Exact next task
Run npm ci, npm test, npm run build, npm run test:browser and git diff --check. Review and push this slice to feat/p3-progression-ux, then verify GitHub Actions. Keep PR #2 Draft and unmerged. Next improve dialog focus management and wider responsive/accessibility coverage.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.
