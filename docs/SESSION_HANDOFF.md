# Session Handoff — Empire of Companies

Last updated: 2026-11-06

## Mission
Continue the browser-first 3D office/company management game:
https://github.com/ijoolaie/empire-of-companies

## Non-negotiable product decisions
- Babylon.js + TypeScript + Vite.
- Persian/English and RTL/LTR.
- Browser first; PWA next; Android via Capacitor later.
- Procedural art; do not require Blender or paid assets.
- Local-only game saves. Supabase is identity-only, not cloud save/sync.
- Do not merge PRs without explicit user approval.
- User asked for practical execution and verified status, not schedules.

## Repository state
- Local path: `C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies`.
- Baseline main commit: `7914290` (PR #2 merged).
- Current branch: `feat/p4-office-environment`.
- Latest pushed head before current optimization: `a90528be7cc1eeff8291607837e75474b990ec4e` (`test: profile office scenes with twenty employees`). CI run #101 passed build, unit tests and browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42251912036.
- Current local optimization freezes world matrices for static office geometry and desk/furniture meshes. Local unit, build and browser checks pass; awaiting final commit/push.
- PR #3 remains open, Draft and unmerged. PR URL: https://github.com/ijoolaie/empire-of-companies/pull/3.

## Current implementation
- Core economy, desk placement, hiring, upgrades, local persistence and bounded offline earnings.
- Progression schema v4, XP/levels, three ordered objectives, tutorial and accessible progression dialog.
- Procedural seated workers with deterministic appearance variants, three idle poses and arrival walking. Each worker now has a small color-varied necktie; regression coverage checks per-worker mesh counts and shared material reuse.
- Desk equipment: monitor stand/base, keyboard and mouse.
- Office-shell slice: five wall segments, open 2.5-unit entrance, entrance trim/threshold/sign, three framed rear windows, three ceiling panels, three warm point lights and baseboards. Added bookcase/books, wall clock, framed wall art, cork notice board with three pinned notes, a five-mesh waiting bench against the left wall, per-desk paper/mug/pen accessories and under-desk drawer units, a three-bar entrance emblem and a near-flush entry mat with trim.
- Entrance remains open; no door mesh blocks the existing arrival corridor.
- Canvas diagnostics: `data-office-wall-segment-count`, `data-office-window-count`, `data-office-entrance-part-count`, `data-office-light-count`, `data-office-furniture-count`, `data-office-notice-board-mesh-count`, `data-office-waiting-area-mesh-count`, `data-desk-accessory-mesh-count`, `data-desk-storage-mesh-count`.

## Verification
- Browser performance regression now profiles 0, 5, 10, 12 and 20 employees across a 20-desk stress layout. Latest SwiftShader sample: average CPU frame 7.353 / 8.824 / 9.856 / 13.328 / 12.145 ms; p95 17.5 / 20.0 / 18.9 / 40.9 / 26.9 ms; max spikes 63.0 / 74.3 / 67.1 / 78.4 / 89.9 ms; meshes 433 / 481 / 541 / 565 / 661; materials 50 / 62 / 62 / 62 / 62; lights remain 5. Timing is noisy/non-monotonic under headless SwiftShader and is diagnostic only, not real-device GPU acceptance.
- The alternate-layout rapid-arrival browser test now validates generated waypoints and eventual arrival without requiring all workers to still be walking at the exact assertion instant; this removes a renderer-speed-dependent timing race.
- Previous pushed head `706207b` passed GitHub Actions run #100 (build, unit tests and browser regression): https://github.com/ijoolaie/empire-of-companies/actions/runs/42246878178.
- Latest local verification after static-transform freezing: unit tests 22/22; build passed (466 modules; main JS 1,160.42 kB minified / 287.29 kB gzip; existing Vite chunk warning); browser tests 19/19. SwiftShader profile for 0/5/10/12/20 workers: average CPU frame 7.410 / 9.484 / 9.679 / 11.414 / 13.210 ms; p95 17.5 / 22.6 / 16.2 / 21.8 / 27.4 ms; max 59.9 / 58.9 / 84.3 / 67.1 / 78.5 ms. Mesh counts 433 / 481 / 541 / 565 / 661; materials 50 / 62 / 62 / 62 / 62; lights 5 throughout. Results are noisy and do not establish a consistent CPU improvement versus the prior sample.\n- Hardware-accelerated headless Chromium profile confirmed the AMD Radeon Graphics adapter via ANGLE/D3D11 (not SwiftShader). For 0/5/10/12/20 workers, average CPU frame times were 7.280 / 8.085 / 8.793 / 8.975 / 10.491 ms; p95 8.6 / 11.4 / 10.2 / 10.0 / 12.0 ms; max spikes 53.4 / 48.9 / 62.2 / 64.2 / 77.0 ms. Meshes 433 / 481 / 541 / 565 / 661; materials 50 / 62 / 62 / 62 / 62; lights 5. This is a real hardware-backed browser run on the local AMD adapter, but still headless; headed desktop/mobile and user-device acceptance remain open.
- Worker-detail slice adds one color-varied necktie mesh per worker, reusing four cached materials across appearance variants. Local verification: unit tests 22/22, build passed (1,160.29 kB minified / 287.25 kB gzip; existing Vite chunk warning), browser tests 19/19, diff check passed. Commit `7251334`; this slice is committed and pushed.
- Diff whitespace check: passed.
- Automated office-shell mesh/light counts passed, including 8 notice-board meshes, 9 entrance-detail meshes and 9 desk-accessory meshes across the three-desk fixture.
- Visual review completed from headless Chromium/SwiftShader captures: desktop 900×600, mobile 390×844, and alternate orbit views at both sizes. No obvious geometry clipping or entrance blockage was seen; browser page errors were absent. This does not replace real-device GPU review.
- GitHub Actions run #95 for pushed head `9915b33` passed all steps including browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42242077806.
- Latest local drawer-storage validation: unit tests 22/22, build passed (1,159.92 kB minified / 287.20 kB gzip; existing Vite chunk warning), browser tests 19/19, diff check passed.
- Waiting-bench local validation: unit tests 22/22, build passed, browser tests 19/19, diff check passed. The local build bundle is 1,159.47 kB minified / 287.11 kB gzip; existing Vite chunk warning remains.

## Exact next steps
1. Review PR #3; it is intentionally Draft and must not be merged without explicit approval.
2. Continue P4 with richer office furniture and environmental polish, maintaining desktop/mobile and alternate-angle checks.
3. Perform real-device GPU review when a physical test environment is available.
4. Keep business simulation, Supabase Auth, PWA and Android work in their planned phases.
