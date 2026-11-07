# Project Status

Last verified: 2026-11-07

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: `main`; latest merged baseline: `7914290` (PR #2).
- Current work branch: `feat/p4-office-environment`.
- Local workspace: `C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies`.
- Latest pushed head before current local slice: `f94a5cb` (`feat: add emissive ceiling light panels`); CI #111 passed all steps. PR #3 remains open, Draft, mergeable and unmerged.

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
- Added canvas diagnostics for wall segments, windows, structural entrance parts, scene light count, 18 subtle floor-tile joints, nine entrance emblem/mat detail meshes, eight notice-board meshes and 15 clock-detail meshes (12 hour markers, two hands and a center pin).
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

## Latest continuation - shared book materials
- Reused four cached color materials across eight procedural book meshes; no geometry or worker animation changed.
- Added data-office-book-material-count=4 diagnostic and browser regression assertion.
- Verification: unit tests 22/22; production build passed; Playwright 19/19 passed. Baseline materials decreased from 50 to 46; 20-worker fixture decreased from 62 to 58. Existing Vite chunk-size warning remains.
- CI #108 for previous docs head passed all steps. Current optimization is locally verified and awaiting CI.

## Latest continuation - accessible account dialog
- The player-account sign-in/register dialog now exposes `role=dialog`, `aria-modal=true`, a labelled/described relationship, a translated accessible close-button name, and explicit accessible names for the email/password fields.
- Keyboard behavior: initial focus moves to the email field; Tab/Shift+Tab stay inside the dialog; Escape and backdrop/close-button dismissal return focus to the account opener.
- Added a Playwright regression for modal semantics, focus trapping and focus restoration.
- Local verification: unit tests 22/22; production build passed (466 modules; main JS 1,164.34 kB minified / 288.20 kB gzip; existing Vite chunk-size warning remains); focused browser regression 1/1; `git diff --check` passed.
- Current local work is not yet committed. CI #116 for prior head `eb3a883` has build and unit tests passing; full browser regression is still running.

## Latest continuation - merged plant foliage
- Combined five static leaf meshes per planter into one canopy mesh; the two planters now contribute two foliage meshes instead of ten (8 fewer scene meshes).
- Added `data-office-plant-foliage-mesh-count=2` and a Playwright assertion.
- Verification on current local tree: unit tests 22/22; production build passed; browser regression 19/19; `git diff --check` passed. The 20-worker profile reports 633 meshes (down from 641 after the shoe merge); materials 58, lights 5. Timing remains noisy and no FPS claim is made.
- Visual review via preview could not be completed because the preview process was not reachable from the browser capture; real-device and headed visual review remain open.
- Committed and pushed as `6b52839f8b189b99b86d2ae56f0ed4f9d3341d34` (`perf: merge static office plant foliage`). GitHub Actions run #110 passed all steps: https://github.com/ijoolaie/empire-of-companies/actions/runs/42348858343. PR #3 remains Draft and unmerged.

## Latest continuation - emissive ceiling panels
- Added a subtle emissive component to the three existing ceiling-panel materials; no additional geometry or lights were introduced.
- Added `data-office-ceiling-panel-count=3` and a Playwright assertion.
- Local verification on this tree: unit tests 22/22; production build passed (existing Vite chunk-size warning); Playwright 19/19 passed; `git diff --check` passed.
- Latest 20-worker profile: average CPU frame 11.949 ms, p95 27.5 ms, max 79.3 ms; 633 meshes, 58 materials, 5 lights. Headless SwiftShader timings are diagnostic only.
- Physical-device and headed visual/GPU review remain open. PR #3 stays Draft and unmerged.


## Latest continuation - planter finishing details
- Added a dark soil surface and decorative rim to each of the two existing planters (four meshes total); foliage remains merged into two canopy meshes.
- Added data-office-planter-detail-count=4 and a browser regression assertion.
- Local verification: unit tests 22/22; production build passed (466 modules; existing Vite >500 kB chunk warning); targeted office-shell Playwright regression passed 1/1.
- A full Playwright invocation reached 14 passing tests but exceeded the local 120-second process limit during the long scene-profiling test; the targeted office-shell test was rerun independently and passed. Full browser CI verification is still required for this slice.
- GitHub Actions #111 for prior head 94a5cb passed all steps: https://github.com/ijoolaie/empire-of-companies/actions/runs/42350040612.
- Current planter changes are local only; not yet committed or pushed. PR #3 remains Draft and unmerged.

## Latest continuation - window transom detail
- Added one horizontal transom to each of the three rear window panes, visually dividing the glazing into upper/lower sections without changing window openings or navigation space.
- Added `data-office-window-transom-count=3` and a Playwright assertion.
- Local verification: unit tests 22/22; production build passed (466 modules; existing Vite >500 kB chunk warning); focused office-shell browser regression 1/1.
- Latest planter-detail head `598c9b4` passed GitHub Actions #112 in full, including browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42350677749.
- PR #3 description now records the passing CI #112 and current verification. Physical-device visual/GPU acceptance remains open.

## Latest continuation - window grid detail
- Added one central vertical mullion to each of the three rear windows, creating a consistent four-pane grid with the existing edge mullions and horizontal transom.
- Added `data-office-window-center-mullion-count=3` and a Playwright assertion.
- Local verification: unit tests 22/22; production build passed (existing Vite >500 kB chunk warning); focused office-shell browser regression 1/1; `git diff --check` passed.
- Previous head `592257c` passed GitHub Actions #113 in full, including browser regression: https://github.com/ijoolaie/empire-of-companies/actions/runs/42351343608.
- Latest central-mullion change is committed/pushed separately and requires its own CI run.
- PR #3 remains Draft, open and unmerged. Physical-device visual/GPU acceptance remains open.
