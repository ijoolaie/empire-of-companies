# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: `main`; latest merged baseline: `7914290` (PR #2).
- Current work branch: `feat/p4-office-environment`.
- Local workspace: `C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies`.
- Current change is not yet committed or pushed; CI has not run for it.

## Product decisions
- Browser-first 3D office/company management game, Babylon.js + TypeScript + Vite.
- Persian/English with RTL/LTR.
- Procedural original visuals; no Blender or paid asset dependency.
- Game saves stay local. Supabase is identity-only when its phase is implemented.
- PWA, then Android/Capacitor after browser stability.

## Phase status
- P0/P1: complete.
- P2: playable core loop complete and merged.
- P3: progression, onboarding, responsive UX and accessibility slice implemented and merged.
- P4: active; procedural workers, arrival, desk equipment and first office-shell pass implemented. Visual acceptance across alternate camera angles is still open.
- P5: Supabase Auth lifecycle not yet verified.
- P6: quality/release, PWA and Android packaging remain.

## Latest P4 office-shell slice
- Added the right-side wall and split front wall, leaving a 2.5-unit-wide open entrance aligned with the existing worker arrival lane.
- Added entrance header, jambs, threshold and sign; the entrance remains physically open (no door leaf blocking arrivals).
- Added window mullions and sills to the three rear glass panes.
- Added three ceiling light panels, three warm point fill lights and wall baseboards.
- Reused cached materials for architectural trim and finish surfaces.
- Added canvas diagnostics for wall segments, windows, entrance parts and scene light count.
- Added a Playwright regression asserting 5 wall segments, 3 windows, 5 entrance parts and 5 total lights, with no browser page errors.
- No external art assets introduced.

## Verification for this working branch
- `npm test`: 22 passed, 0 failed.
- `npm run build`: passed (466 modules); main JS 1,154.46 kB minified / 285.72 kB gzip. Existing Vite >500 kB chunk warning remains.
- `npm run test:browser`: 19 passed, 0 failed, including the new office-shell regression.
- `git diff --check`: passed.
- Automated scene-composition checks passed; this is not a substitute for manual visual review of screenshots or alternate camera angles.
- GitHub Actions has not yet run for this branch.

## Next actions
1. Capture and inspect desktop/mobile screenshots and at least one alternate camera angle; adjust geometry if the entrance/walls occlude the office or workers.
2. Commit and push this slice, open a PR, and verify GitHub Actions.
3. Continue P4 with richer office furniture and environmental polish only after visual acceptance.
4. Keep business simulation, Supabase Auth, PWA and Android work in their planned phases.
