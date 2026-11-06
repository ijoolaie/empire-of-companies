# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: `main`; latest merged baseline: `7914290` (PR #2).
- Current work branch: `feat/p4-office-environment`.
- Local workspace: `C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies`.
- Latest remote head before this slice: `565dfbc`; the entrance-emblem/entry-mat polish is locally validated and awaiting commit/push. PR #3 is open as Draft.

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
- P4: active; procedural workers, arrival, desk equipment, office shell, furniture details and entrance identity accents are implemented. Headless browser regression covers the new entrance details; real-device GPU review remains open.
- P5: Supabase Auth lifecycle not yet verified.
- P6: quality/release, PWA and Android packaging remain.

## Latest P4 office-shell slice
- Added the right-side wall and split front wall, leaving a 2.5-unit-wide open entrance aligned with the existing worker arrival lane.
- Added entrance header, jambs, threshold and sign; the entrance remains physically open (no door leaf blocking arrivals).
- Added window mullions and sills to the three rear glass panes.
- Added three ceiling light panels, three warm point fill lights and wall baseboards.
- Reused cached materials for architectural trim and finish surfaces.
- Added a compact bookcase with shelves and books, a wall clock, framed wall art, and desk-level paper, mug and pen accessories. Bookcase is registered as a worker-path obstacle; desk accessories are attached to each desk.
- Added canvas diagnostics for wall segments, windows, structural entrance parts, scene light count and nine entrance emblem/mat detail meshes.
- Added Playwright regressions asserting 5 wall segments, 3 windows, 5 structural entrance parts, 5 total lights, 3 office detail features, 9 entry-detail meshes and 9 desk accessory meshes in the 3-desk fixture, with no browser page errors.
- No external art assets introduced.

## Verification for this working branch
- `npm test`: 22 passed, 0 failed.
- `npm run build`: passed (466 modules); latest main JS 1,156.68 kB minified / 286.34 kB gzip. Existing Vite >500 kB chunk warning remains.
- `npm run test:browser`: 19 passed, 0 failed, including office shell, desk accessories, entrance emblem and entry mat regressions.
- `git diff --check`: passed.
- Visual review: captured and inspected 900×600 desktop and 390×844 mobile views, plus alternate orbit views at both sizes using headless Chromium/SwiftShader. Walls, entrance, window framing and lighting rendered coherently; no obvious mesh clipping or browser page errors observed. This is simulated-browser review, not a physical-device/GPU acceptance test.
- GitHub Actions run #90 passed for head `565dfbc0ce411759fbfc9041258856590a6f4b63` (build, unit tests and browser regression). The current entrance-detail slice passes local unit tests 22/22, production build and browser tests 19/19; its CI will run after push.

## Next actions
1. PR #3 is open as Draft; review the diff and keep it unmerged until explicitly approved.
2. Continue P4 with more furniture and environmental polish; validate each slice at desktop/mobile sizes and alternate camera angles.
3. Add real-device GPU/browser review when a physical test environment is available.
4. Keep business simulation, Supabase Auth, PWA and Android work in their planned phases.
