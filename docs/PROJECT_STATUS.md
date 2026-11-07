# Project Status

Last verified: 2026-11-07

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: `main`; latest merged baseline: `7914290` (PR #2).
- Current work branch: `feat/p4-office-environment`.
- Local workspace: `C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies`.
- Latest pushed head: `7628d55bbe5bb19251f0c3d6032aefad5e47cab1` (`perf: merge static worker shoe meshes`); PR #3 contains 23 commits. GitHub Actions run #107 for the latest branch head passed install, build, unit tests, Chromium installation and browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42344605316. PR #3 remains open, Draft, mergeable and unmerged.

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
- P4: active; procedural workers, arrival, desk equipment, office shell, furniture details, entrance identity accents, static-transform freezing, 30 Hz worker animation updates and merged static shoe geometry are implemented. Full local and CI browser regressions pass. Real-device headed desktop/mobile visual and GPU review remain open.
- P5: Supabase Auth lifecycle not yet verified.
- P6: quality/release, PWA and Android packaging remain.

## Latest P4 office-shell slice
- Added the right-side wall and split front wall, leaving a 2.5-unit-wide open entrance aligned with the existing worker arrival lane.
- Added entrance header, jambs, threshold and sign; the entrance remains physically open (no door leaf blocking arrivals).
- Added window mullions and sills to the three rear glass panes.
- Added three ceiling light panels, three warm point fill lights and wall baseboards.
- Reused cached materials for architectural trim and finish surfaces.
- Added a compact bookcase with shelves and books, a wall clock, framed wall art, a cork notice board with three pinned notes, a five-mesh waiting bench against the left wall, and desk-level paper, mug, pen and under-desk drawer storage. Bookcase and bench are registered as worker-path obstacles; desk accessories and storage are attached to each desk.
- Added canvas diagnostics for wall segments, windows, structural entrance parts, scene light count, nine entrance emblem/mat detail meshes and eight notice-board meshes.
- Added Playwright regressions asserting 5 wall segments, 3 windows, 5 structural entrance parts, 5 total lights, 4 office detail features, 8 notice-board meshes, 5 waiting-area meshes, 9 entry-detail meshes, 9 desk accessory meshes and 6 desk-storage meshes in the 3-desk fixture, with no browser page errors.
- No external art assets introduced.

## Verification for this working branch
- Latest local verification at head `7628d55`: `npm test` 22/22; `npm run build` passed (466 modules; main JS approximately 1,160.62 kB minified / 287.41 kB gzip; existing Vite >500 kB chunk warning remains); full Playwright browser regression 19/19 passed, including the 20-worker profile and 30 Hz animation cadence assertion; `git diff --check` passed.
- GitHub Actions run #106 for `7628d55` passed every step: dependency installation, production build, unit tests, Chromium installation and all browser regression tests: https://github.com/ijoolaie/empire-of-companies/actions/runs/42265597027.
- Latest worker-mesh optimization merges the two static shoe meshes into one per employee; the animated thighs/shins remain independent. Local `npm test` 22/22, build and Playwright 19/19 pass. In the 20-worker browser fixture, scene meshes fell from 661 to 641 (20 fewer, one per employee); CPU timing remains noisy and no performance gain is claimed from this single browser sample.
- Worker-detail slice adds one color-varied necktie mesh per employee, reusing four cached tie materials across worker variants. Browser regressions assert one/two worker tie meshes and updated shared-material counts.
- Scene profiling now samples 0, 5, 10, 12 and 20 employees across a 20-desk stress layout. Latest SwiftShader sample: CPU frame averages 7.353 / 8.824 / 9.856 / 13.328 / 12.145 ms; p95 17.5 / 20.0 / 18.9 / 40.9 / 26.9 ms; maximum spikes 63.0 / 74.3 / 67.1 / 78.4 / 89.9 ms. Meshes 433 / 481 / 541 / 565 / 661; materials 50 / 62 / 62 / 62 / 62; lights remain 5. Timing is noisy/non-monotonic under headless SwiftShader and is diagnostic only, not real-device GPU acceptance.
- Visual review: inspected desktop views at two orbit angles in headless Chromium/SwiftShader. Corrected the notice board to mount flat on the rear wall and moved the clock to the right wall to remove the placement conflict. Re-captured the scene after the fix; the wall-mount diagnostics report `rear-wall` and `right-wall`, with no browser page errors. This remains simulated-browser review, not physical-device/GPU acceptance.
- GitHub Actions run #92 passed for code head `64e1e9b0771eeb8825c0c860aca1b56517534d96`: https://github.com/ijoolaie/empire-of-companies/actions/runs/42235641909
- GitHub Actions run #99 passed for head `acbd573`; run #100 passed for current pushed head `706207b`: build, unit tests and browser regression all succeeded. https://github.com/ijoolaie/empire-of-companies/actions/runs/42246878178
- Latest local validation: `npm test` 22/22, build passed (1,160.29 kB minified / 287.25 kB gzip; existing Vite chunk warning), browser tests 19/19, diff check passed.

## Next actions
1. PR #3 is open as Draft; review the diff and keep it unmerged until explicitly approved.
2. Continue P4 with furniture and environmental polish; validate each slice at desktop/mobile sizes and alternate camera angles.
3. Add real-device GPU/browser review when a physical test environment is available.
4. Keep business simulation, Supabase Auth, PWA and Android work in their planned phases.
