# Session Handoff — Empire of Companies

Last updated: 2026-11-07

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
- Latest code head: `b64a164e6ea4cabe7adf0136d54bac506b76fe34` (`perf: reuse office book materials`); CI #109 passed. PR #3 remains open, Draft and unmerged.
- Static office geometry and furniture world matrices are frozen; worker animation updates at 30 Hz; both static shoes are merged per worker. Latest commit is pushed and CI #106 is green.
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
- Latest static-shoe optimization: both non-animated shoes per employee are merged into one worker-local mesh; animated thighs and shins remain separate. The 20-worker browser fixture now has 641 meshes versus 661 before (20 fewer). Local unit tests 22/22, build passed (main JS 1,160.62 kB minified / 287.41 kB gzip), Playwright 19/19 passed, and GitHub Actions run #106 passed all steps. CPU timings remain noisy; no speed gain is claimed.
- Browser performance regression now profiles 0, 5, 10, 12 and 20 employees across a 20-desk stress layout. Latest SwiftShader sample: average CPU frame 7.353 / 8.824 / 9.856 / 13.328 / 12.145 ms; p95 17.5 / 20.0 / 18.9 / 40.9 / 26.9 ms; max spikes 63.0 / 74.3 / 67.1 / 78.4 / 89.9 ms; meshes 433 / 481 / 541 / 565 / 661; materials 50 / 62 / 62 / 62 / 62; lights remain 5. Timing is noisy/non-monotonic under headless SwiftShader and is diagnostic only, not real-device GPU acceptance.
- The alternate-layout rapid-arrival browser test now validates generated waypoints and eventual arrival without requiring all workers to still be walking at the exact assertion instant; this removes a renderer-speed-dependent timing race.
- Previous pushed head `706207b` passed GitHub Actions run #100 (build, unit tests and browser regression): https://github.com/ijoolaie/empire-of-companies/actions/runs/42246878178.
- Latest local verification after static-transform freezing: unit tests 22/22; build passed (466 modules; main JS 1,160.42 kB minified / 287.29 kB gzip; existing Vite chunk warning); browser tests 19/19. SwiftShader profile for 0/5/10/12/20 workers: average CPU frame 7.410 / 9.484 / 9.679 / 11.414 / 13.210 ms; p95 17.5 / 22.6 / 16.2 / 21.8 / 27.4 ms; max 59.9 / 58.9 / 84.3 / 67.1 / 78.5 ms. Mesh counts 433 / 481 / 541 / 565 / 661; materials 50 / 62 / 62 / 62 / 62; lights 5 throughout. Results are noisy and do not establish a consistent CPU improvement versus the prior sample.\n- Hardware-accelerated headless Chromium profile confirmed the AMD Radeon Graphics adapter via ANGLE/D3D11 (not SwiftShader). Before animation throttling, for 0/5/10/12/20 workers, average CPU frame times were 7.280 / 8.085 / 8.793 / 8.975 / 10.491 ms; p95 8.6 / 11.4 / 10.2 / 10.0 / 12.0 ms; max spikes 53.4 / 48.9 / 62.2 / 64.2 / 77.0 ms. After limiting worker pose/path updates to 30 Hz, a repeat sample measured averages 7.335 / 7.740 / 8.563 / 8.608 / 9.404 ms; p95 9.1 / 8.8 / 9.0 / 9.6 / 11.5 ms; max spikes 53.7 / 51.6 / 64.8 / 67.9 / 64.7 ms. Meshes remain 433 / 481 / 541 / 565 / 661. The 20-worker average fell about 10.4% in this sample, but single-run results are noisy and do not establish a guaranteed gain. Worker animation now updates at 30 Hz; the regression suite verifies this setting and worker poses/arrival still pass. This is a hardware-backed headless run; headed desktop/mobile and user-device acceptance remain open.
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

## Latest continuation - shared book materials
- Reused four cached color materials across the eight procedural book meshes in the bookcase.
- Added data-office-book-material-count=4 diagnostic and a browser regression assertion.
- Verification: unit tests 22/22; production build passed; Playwright 19/19 passed. Baseline materials decreased from 50 to 46; 20-worker fixture decreased from 62 to 58.
- CI #108 for prior docs head passed. Current optimization is locally verified and awaits CI.

## Latest continuation - merged plant foliage
- Static leaves are merged per planter: 10 leaf meshes become 2 canopy meshes, saving 8 scene meshes.
- Added canvas diagnostic `data-office-plant-foliage-mesh-count=2` and regression coverage.
- Local verification: unit tests 22/22, build passed, Playwright 19/19, diff check passed. Latest 20-worker scene profile: 633 meshes, 58 materials, 5 lights. CPU timings vary between runs; no FPS improvement is claimed.
- The preview process could not be reached for a screenshot, so visual review is still pending. Do not claim a visual inspection was completed.
- Current foliage changes and this handoff update are local only; commit/push and CI verification remain next. PR #3 stays Draft and unmerged.

## Latest verified continuation — plant foliage
- Commit `6b52839f8b189b99b86d2ae56f0ed4f9d3341d34` pushed to `feat/p4-office-environment`.
- Five static leaves per planter are merged into one canopy; total foliage meshes are 2 rather than 10.
- Local verification: unit tests 22/22, production build, Playwright 19/19, diff check all passed. GitHub Actions run #110 passed install, build, unit tests, Chromium install and browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42348858343.
- 20-worker fixture scene meshes: 633; materials: 58; lights: 5. Mesh reduction is not an FPS claim.
- Fresh screenshot/visual check was not completed; physical-device GPU review remains open.
- PR #3 is still Draft and unmerged.

## Latest continuation - emissive ceiling panels
- Added subtle emissive material response to the three existing ceiling panels and a diagnostic/assertion for exactly three panels.
- Local verification: unit tests 22/22; production build passed; Playwright 19/19 passed; diff check passed. The 20-worker fixture reports 633 meshes, 58 materials and 5 lights.
- The previous browser run's 19/19 suite completed in 1.9 minutes with exit code 0. Headless SwiftShader timings are diagnostic only; no FPS claim.
- Next: commit/push this slice and verify GitHub Actions. PR #3 remains Draft and unmerged; physical-device/visual review remains open.
