# Session Handoff — Read First

Last updated: 2026-11-05 — progression dialog keyboard accessibility committed and pushed; CI run #33 pending

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
- Latest functional commit: bae936f — a11y: contain progression dialog keyboard focus.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2.
- CI run #32 (42061404610) passed for be73756.
- CI run #33 (42063106976) is running for bae936f. Build and unit tests passed; Chromium installation is in progress and browser tests are pending.
- Local path: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Current phase and work
P3 progression and usability. Progression dialog contains player XP/level, ordered milestone states/rewards and future roadmap at levels 3, 5 and 10; future entries are explicitly planned, not playable. Latest functional slice adds accessible dialog description, keyboard focus containment, Escape dismissal, and focus restoration to the opener. Browser coverage includes 320, 375, 768 and 1366px widths.

## Local verification for bae936f
- npm test: 14/14 passed.
- npm run build: passed.
- npm run test:browser: 8/8 passed.
- git diff --check: passed.
- Build warning: Babylon main chunk about 6,023.70 kB minified / 1,321.52 kB gzip.
- CI run #33 must complete before this slice is described as CI-verified.

## Exact next task
Check run #33 (42063106976). If it passes, record the verified CI result and continue P3 accessibility. If it fails, inspect the failed step and repair it. Keep PR #2 Draft and unmerged.

## Session update rule
Update PROJECT_STATUS and SESSION_HANDOFF with verified facts after substantial work. Update ROADMAP/WBS when scope changes. Never claim a feature is complete solely because code was written.
