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
- Latest verified pushed code head: `7e4c048b5e8ca678a505f04471e0cae593da4850`; GitHub Actions #123 passed build, unit tests and browser regression. PR #3 remains open, Draft and unmerged.
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


## Latest continuation - planter finishing details
- Added soil surfaces and decorative rims to both planters; four meshes total, no navigation geometry changed.
- Added browser diagnostic data-office-planter-detail-count=4; the focused office-shell browser regression passes.
- Local unit tests 22/22 and production build pass. Full Playwright invocation passed 14 tests before reaching the long scene-profile test and hitting the local 120-second process limit; the targeted office-shell test was rerun and passed. CI verification for this new slice remains pending.
- Previous pushed head 94a5cb passed GitHub Actions #111: https://github.com/ijoolaie/empire-of-companies/actions/runs/42350040612.
- Current changes are local only. Keep PR #3 Draft and unmerged.

## Latest continuation - window transom detail
- Three rear window panes now each include a horizontal transom; no opening size or worker navigation geometry changed.
- Added a browser diagnostic/assertion for exactly three transoms.
- Local validation: 22/22 unit tests, production build passed (existing Vite chunk warning), focused office-shell browser regression 1/1.
- Previous head `598c9b4` is fully green on GitHub Actions #112; the transom slice is being committed/pushed next and requires its own CI run.
- PR #3 remains Draft, open and unmerged; real-device visual/GPU acceptance remains outstanding.

## Latest continuation - window grid detail
- Added a centered vertical mullion to each of the three rear window panes; the three windows now have a four-pane grid with their existing transoms and edge mullions.
- Browser regression asserts exactly three center mullions.
- Local validation: 22/22 unit tests, production build passed (existing Vite chunk warning), focused office-shell browser regression 1/1, diff check passed.
- Previous head `592257c` is fully green on GitHub Actions #113. The new center-mullion commit needs its own CI.
- PR #3 remains Draft, open and unmerged; real-device visual/GPU acceptance remains outstanding.

## Latest continuation - wall clock detailing
- Rebuilt the right-wall clock face as a readable dial with 12 hour markers, distinct minute/hour hands and a center pin (15 detail meshes total).
- Added `data-office-clock-detail-count=15` and a browser regression assertion; clock remains on the right wall and does not affect worker navigation.
- Local verification: unit tests 22/22; production build passed (466 modules; existing Vite >500 kB chunk warning remains); focused office-shell Playwright regression 1/1; `git diff --check` passed.
- This slice is locally verified and awaits commit/push and GitHub Actions. PR #3 remains Draft and unmerged; physical-device visual/GPU acceptance remains open.

## Latest continuation - cancellable desk placement
- Added Escape-key and visible toolbar cancellation for desk placement; action is conditionally shown only while placement mode is active and localized in English/Persian.
- Playwright regression checks both cancellation routes and verifies the save still contains only the two starter desks.
- Local verification: unit tests 22/22; production build passed (466 modules; main JS 1,164.73 kB minified / 288.33 kB gzip; existing Vite chunk warning); focused browser test 1/1; diff check passed.
- Local work is not yet committed. CI #119 for earlier pushed head 72f29c5 is in progress.

## Latest continuation - accessible account dialog
- The sign-in/register dialog now has modal semantics (`role=dialog`, `aria-modal=true`, labelled/described relationships), a translated accessible close-button label, and explicit accessible names for email/password inputs.
- Initial focus moves to email; Tab/Shift+Tab remain inside the dialog; Escape, backdrop click and close button restore focus to the account opener.
- Added Playwright coverage for dialog semantics, focus trapping and focus restoration.
- Local verification: unit tests 22/22; production build passed (466 modules; main JS 1,164.34 kB minified / 288.20 kB gzip; existing Vite chunk warning); focused browser test 1/1; diff check passed.
- This change is local only. CI #116 for previous head `eb3a883` has build/unit tests green; browser regression is still running. PR #3 remains Draft and unmerged.

## Latest continuation - tiled office floor finish
- Added a restrained one-metre floor-joint layout: 10 longitudinal and 8 transverse seams (18 total), using one shared material and thin geometry at floor level.
- Added `data-office-floor-joint-count=18` and a browser regression assertion.
- Local verification: unit tests 22/22; production build passed (466 modules; existing Vite >500 kB chunk warning remains); focused office-shell Playwright regression 1/1 passed after correcting the expected seam count; `git diff --check` passed.
- This floor-finish slice is locally verified and awaits commit/push and its own GitHub Actions run. PR #3 remains Draft and unmerged; real-device visual/GPU acceptance remains open.

## Latest continuation - desk placement preview and validation
- Added one reusable, translucent desk-footprint preview. It follows the pointer over the office floor and switches to green for a valid position and red for an invalid/overlapping position; the guide is localized in English and Persian.
- Preview validation calls the same canPlaceDesk rule used by buildDesk, and also checks the full desk-and-chair footprint against planters, bookcase, waiting bench, entrance mat and office boundaries. Insufficient cash also marks the preview invalid.
- Placement works from pointer movement/down events, covering mouse and touch input. Desktop clicks commit valid positions; touch requires two taps on the same valid spot so the first tap previews and the second commits. Invalid clicks do not change cash or saved desks; changing or losing the touch target clears pending confirmation. Escape and the cancel toolbar action hide the preview.
- Added a unit test proving preview validation does not mutate state, plus a browser regression that finds invalid and valid floor positions, verifies the red/green states, checks invalid placement does not charge, and confirms valid placement commits.
- Local verification: unit tests 24/24; production build passed (469 modules; main JS 1,179.21 kB minified / 292.47 kB gzip; existing Vite >500 kB chunk warning remains); focused desktop/touch tests 2/2; full browser suite 23/23; git diff --check passed.
- Previous pushed head 3242c54 passed GitHub Actions #120, including build, unit tests and browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42353651375. This new placement-preview slice is local only and still needs its own commit/push and CI.
- PR #3 remains Draft and unmerged. Real-device touch and visual/GPU acceptance remain outstanding.


## Latest continuation - camera reset control
- Added a visible, accessible camera-reset control in the top bar. It restores the default orbit angle, tilt, radius and target, and clears pending camera inertia.
- Reset-camera label is localized in English and Persian; browser regression checks that drag changes the view, reset restores all three camera values, and the accessible label changes with the UI language.
- Local verification: unit tests 24/24; production build passed (469 modules; main JS 1,179.75 kB minified / 292.62 kB gzip; existing Vite >500 kB chunk warning remains); focused camera test 1/1; browser suite excluding the long scene-profile test 22/22; diff check passed. The scene-profile test was not rerun in this slice; it passed in CI #121 on the preceding code head.
- Current camera-reset slice is local only; commit/push and its own CI remain next. PR #3 remains Draft and unmerged; physical-device visual/GPU acceptance remains open.


## Latest continuation - Persian camera-reset accessibility label
- Corrected the Persian camera-reset accessible name. The previous source used escaped backslashes, so the rendered accessible label was not actual Persian text. The existing browser assertion already checks the exact Persian accessible name.
- Verified the exact Persian accessible name in the existing browser regression and checked its Unicode code points in the source (Arabic/Persian letters U+0628...U+0646).
- Local verification: unit tests 24/24; production build passed (469 modules; main bundle 1,179.75 kB minified / 292.62 kB gzip; existing Vite chunk warning remains); focused camera browser regression 1/1 passed, including English and Persian accessible-name assertions; git diff --check passed.
- This correction is local pending commit/push and CI. PR #3 remains Draft and unmerged.


## Latest continuation - mobile build-mode toolbar regression
- Added a Playwright test for desk-placement mode at 390x844, 375x667 and 320x568; it verifies all five toolbar actions remain within viewport bounds.
- Focused browser test 1/1, unit tests 24/24, production build and diff check pass. New test awaits commit/push and CI.
- Keep PR #3 Draft and unmerged; physical-device touch/visual acceptance remains open.
