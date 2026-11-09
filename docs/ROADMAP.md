# Product Roadmap — Empire of Companies

Last reviewed: 2026-11-08

## Product direction
A browser-first 3D idle office/company management game. The player starts with a small office, hires workers, creates production capacity, earns money, upgrades operations, and expands into a multi-company empire.

## Approved visual direction
The user approved a premium, cinematic, semi-realistic office direction combined with anime-inspired characters and an executive management HUD. This is stylized 3D, not photorealism. See [Office Empire Visual Direction & Implementation Plan](VISUAL_DIRECTION_AND_IMPLEMENTATION_PLAN.md).

## Product principles
- Babylon.js + TypeScript; procedural meshes and code-authored art first. Blender is not a prerequisite.
- Persian and English from the beginning; RTL/LTR must be tested.
- Game progress and saves stay on the player's device; no cloud save or sync.
- Supabase Auth is identity only; never put service-role/secret keys in the browser.
- Browser/PWA first. Android packaging with Capacitor only after the browser build is stable.
- GitHub repository is public by explicit user approval.
- Ship small playable increments. A feature is not complete until implemented and verified.
- Prefer visual quality through composition, lighting, silhouette and reusable materials over unbounded mesh/texture growth.

## Phases and exit criteria

### P0 — Project continuity and baseline (complete)
Roadmap, architecture/decisions, status, handoff and reliable build workflow.

### P1 — Reproducible development build (complete)
Clean dependency install, lockfile, TypeScript/Vite build and CI.

### P2 — Playable core loop (complete)
Economy, desk placement, hiring, upgrades, local save/load and bounded offline earnings.

### P3 — Progression and UX (implemented; maintenance only)
Onboarding/tutorial, ordered milestones, XP/levels, rewards, Persian/English, responsive controls and accessible progression dialog. Reopen only for defects or targeted UX improvements.

### P4 — Approved office visual slice (active; highest priority)
- Existing procedural office shell, founder/workers, four office tiers, lighting/shadows, procedural materials and executive HUD form the baseline.
- P4-A baseline/performance audit is complete locally on commit c1e1a3e: build, 24 unit tests, 28 browser tests, bundle/scene metrics and desktop/mobile reference captures. Real-device GPU acceptance remains open.
- P4-B is active. First visual pass adds warm stone/ivory/navy/walnut finishes, procedural city views in the three windows, and short-viewport HUD spacing fixes. A first warm/cool lighting and shadow-softness refinement is now locally verified (28/28 browser tests); camera focal hierarchy and alternate-angle review remain open.
- Keep the scene premium and semi-realistic but stylized; no photorealism or paid-asset dependency.
- Main risks: latest 20-worker scene at 889 meshes / 100 materials / 5 lights; main JS bundle 1,356.84 kB minified / 335.59 kB gzip with the Vite chunk warning still present; and outstanding physical-device GPU/touch acceptance.
- Exit: coherent, attractive office scene, automated regressions green, bundle/scene complexity measured and controlled, and real-device acceptance documented.

### P5 — Account and settings
Verify Supabase email sign-up/sign-in, session restore, password reset, redirect URLs and account/settings UI. Account identity must not silently migrate or sync local game saves. Do not advance P5 until P4 is accepted.

### P6 — Quality, PWA and release
Automated unit/integration/browser tests, device QA, performance budgets, PWA install/offline behavior, local-save export/import, Capacitor Android build and smoke test.

### P7 — Business simulation
Departments, products, demand, inputs/outputs, salaries, operating expenses, pricing, contracts, R&D, multiple companies and holding overview. Expand after the approved office slice is stable.

## Prioritization
1. P4-A baseline and technical/performance audit (complete locally).
2. P4-B visual composition and lighting.
3. P4-C material consistency and environment finish.
4. P4-D founder/worker presentation without heavy rigs or mesh explosion.
5. P4-E HUD/gameplay readability and bilingual responsive QA.
6. P4-F optimization, automated verification and real-device acceptance.
7. Only after P4 exit: P5/P6/P7 sequencing based on release value.

Do not skip P4 acceptance to start authentication, deep simulation, PWA or Android packaging.
## 2026-11-08 — Camera focal hierarchy pass
- Applied the approved composition direction to the default Babylon.js camera: the playable founder and central work area are brought closer to the visual center while the rear windows remain in frame.
- Default/reset camera: alpha π/4, beta 1.05, radius 16.5, target (0, 0.9, 0.85). The reset action now restores the same focal composition.
- Added canvas diagnostics for camera target X/Y/Z and browser regression assertions for initial framing, bounded zoom/orbit, and reset consistency.
- Local verification: production build passed (526 modules; main entry 1,357.13 kB minified / 335.68 kB gzip; existing Vite >500 kB chunk warning remains); unit tests 24/24; focused camera regression passed; full Playwright suite 28/28 in 3.6 minutes; `git diff --check` passed.
- Scene profile remains 889 meshes / 100 materials / 5 lights at 20 workers. SwiftShader timing is diagnostic only; no GPU/FPS claim.
- This camera slice is locally verified and awaits commit/push and its own hosted CI run. PR #3 remains Draft, open and unmerged. Headed physical-device visual/GPU/touch acceptance remains open; P4 is not accepted and P5 remains deferred.

## 2026-11-08 — Authoritative handoff: approved premium graphics direction

**User approval:** The user explicitly approved the generated premium Office Empire visual concept on 2026-11-08. Treat this as the active art-direction decision and do not ask for approval of the overall style again.

### Approved target
- Premium, high-end, cinematic 3D office; polished stone/marble, refined wood, glass and metal, carefully controlled reflections and believable material response.
- Warm architectural/golden practical lighting balanced with cool city-window light; rich but readable contrast and soft, intentional shadows.
- Professional anime-inspired founder and staff characters, consistent with the stylized 3D world (not photorealistic).
- Executive dark-navy/glass HUD with restrained gold/brass highlights and limited cyan accents.
- Large, aspirational office atmosphere and city skyline as the visual north star. Adapt the reference to the actual playable office, camera, game state and responsive layout; do not copy its fictional statistics, labels, or every UI panel literally.

### User acceptance notes / constraints
- The user accepted the current camera framing (item 1: yes) and said the second reviewed aspect was good (item 2: no change).
- The side panel is visibly positioned toward the front of the environment. Preserve its current placement for now; do not move or redesign it without showing a focused preview and receiving approval.
- The generated concept is an approved art-direction reference, not proof that the game already looks like it and not a pixel-perfect implementation spec.
- The user expects the assistant to lead the professional design work: prepare a concrete visual proposal, show it, obtain approval, then implement that approved proposal. Do not substitute camera tweaks, diagnostics, or test work for the promised graphics design.
- For each materially new visual treatment (environment, furniture/materials, lighting, characters, HUD/layout), show a preview first and wait for explicit approval before implementing that treatment. The overall premium art direction itself is already approved.

### Next work — graphics first
1. Audit the current rendered scene and identify the highest-impact visual gap against the approved reference.
2. Prepare a specific, high-quality visual proposal for the existing playable office (not another generic mood board). Show the proposed composition/material/lighting/furniture treatment and explain exactly what will change.
3. Wait for explicit user approval of that concrete proposal.
4. Implement only the approved slice in Babylon.js/TypeScript, keeping gameplay, navigation, responsive HUD and performance constraints intact.
5. Capture comparable desktop/mobile views; inspect them visually where possible. Run build, unit and browser regressions, git diff --check, then verify hosted CI for the pushed commit.
6. Update this handoff and status with exact commit/test/CI evidence. Never describe a generated mockup or headless diagnostic as implemented visual acceptance.

### Release gates remain unchanged
- P4 graphics and real-device/headed desktop/mobile GPU/touch acceptance are not complete.
- P5 Supabase identity/auth, PWA, Android and broader business simulation remain deferred until P4 is accepted.
- PR #3 must remain Draft/open/unmerged. Never merge without the user's explicit instruction.

### Repository checkpoint
- Branch: feat/p4-office-environment
- Local HEAD at this handoff: b652cfb654beb474ff2fcc5a15fe5ab7bce398dd (feat: refine office camera composition)
- The camera composition refinement is implemented and pushed; it is not the promised premium graphics redesign.
- PR #3: https://github.com/ijoolaie/empire-of-companies/pull/3

## 2026-11-08 — P4 premium graphics work

- [x] Begin premium baseline procedural scene pass in the default office tier.
- [x] Add navy/champagne-gold identity and floor/rug details.
- [x] Add brass pendant fixtures and warm point lighting.
- [x] Improve ivory floor, slate exterior ground and city-window brightness.
- [x] Open the front/right cutaway walls for clearer gameplay visibility.
- [ ] Continue material/asset/character refinement against the approved reference direction.
- [ ] Complete headed desktop/mobile, real GPU and touch acceptance.
- [ ] Obtain user acceptance before P4 closure and any P5 work.

## Latest continuation - premium furniture and semi-realistic character pass (local, not pushed)
- Furniture pass: walnut desk edge banding, brass collars, ergonomic rounded lumbar/headrest cushions, upholstery seam accents, refined monitor bezel/camera, keyboard keycaps (merged into one mesh per desk) and mouse wheel. Existing room scale, camera framing and management panel were not changed.
- Character pass: worker torsos now use smoother tailored silhouettes; jacket lapels and shirt fronts add layered clothing; heads use improved proportions and smoother geometry; hair uses side-part/fringe shapes rather than spiky anime locks; subtle beard details add variation. Founder hair was similarly refined while preserving movement controls, seated poses, arrival routing and desk assignment.
- Added canvas diagnostics for the semi-realistic business character style and tailored-jacket counts, with Playwright assertions.
- Local verification: production build passed (526 modules; main JS 1,364.46 kB minified / 337.53 kB gzip; existing >500 kB Vite chunk warning); unit tests 24/24; focused character/material/pose/20-worker profile tests 4/4; targeted furniture test 1/1; `git diff --check` passed.
- The 20-worker headless profile in the focused run reported 1,177 meshes and 109 materials (8 lights); average frame sample 39.793 ms, p95 52.9 ms, max 162.8 ms. This is a diagnostic headless run, not a device FPS claim. The full browser suite is still running; two narrow-viewport tests have failed and require investigation. Do not mark full browser acceptance green.
- Current changes are local only. PR #3 remains Draft/open/unmerged. Physical headed desktop/mobile and real-device GPU/touch acceptance remain outstanding.
- Follow-up isolated rerun of the two narrow-viewport tests passed 2/2. The full 28-test run reported 26 passed and two transient browser-server/canvas startup failures (`#game` null and `ERR_CONNECTION_REFUSED`); the two failed tests passed when rerun alone. Full-suite acceptance is therefore not marked green pending a clean complete rerun.
- Character screenshot saved locally as `artifacts/office-character-premium-pass.jpg` (1280x720 Chromium capture); this is a real app capture, not an AI concept render. Visual inspection on a headed physical device remains outstanding.


## Character refinement follow-up � 2026-11-09 (local verification complete)
- Visual review of the real application screenshot exposed residual stylized elements that the prior pass had not removed. Corrected the actual geometry: removed founder/worker blush marks and worker anime hair spikes; refined eye proportions and smoothed the worker hair cap.
- Worker clothing now separates a neutral shirt front and tie from a dark tailored jacket. Four reusable jacket color/material variants distinguish hires; facial hair is conditional rather than applied uniformly.
- Added browser assertions confirming zero worker anime hair-lock/blush meshes and zero founder anime blush meshes. Updated material-count expectations to account for the new reusable jacket material.
- Latest local checks: production build passed (526 modules; 1,364.36 kB minified main JS / 337.49 kB gzip; Vite chunk-size warning remains); unit tests 24/24; complete Playwright browser suite 28/28 passed in 3.9 minutes; `git diff --check` passed.
- 20-worker headless scene profile: 1,175 meshes, 1,152 active meshes, 112 materials, 8 lights; average sample 35.633 ms, p95 46.5 ms, max 152.6 ms. These are diagnostic headless measurements, not real-device FPS guarantees.
- Refreshed actual-app screenshot: `artifacts/office-character-premium-pass.jpg`.
- Changes are local pending commit/push. PR #3 stays Draft/open/unmerged. Real headed GPU/touch acceptance remains outstanding; P5 remains deferred.

## Employee appearance diversity follow-up — 2026-11-09
- Added four distinct, non-spiky hairstyle silhouettes (short crop, side-swept, brushed-back and soft-wave), plus three head/face proportions and three seated body silhouettes. Reused existing materials and merged hair/face details to avoid per-worker material growth.
- Added canvas diagnostics and Playwright assertions for the hairstyle set, face-shape count and body-shape count. The 20-worker profile still reports 1,175 meshes, 1,152 active meshes, 112 materials and 8 lights; latest full-suite sample: average 29.140 ms, p95 46.4 ms, max 134.6 ms. Headless SwiftShader diagnostics only, not real-device FPS.
- Production build passed; unit tests 24/24; focused diversity and 20-worker browser checks 2/2; complete Playwright browser suite 28/28 passed in 3.4 minutes with the new assertions; `git diff --check` passed.
- New actual-app capture: `artifacts/office-character-variation-pass.jpg` (1280x720 Chromium, 4 workers; diagnostics show all four hairstyles; no page errors). It is a headless capture, not headed physical-device acceptance.
- P4 remains in progress. PR #3 remains Draft/open/unmerged; physical headed GPU/touch acceptance remains outstanding; P5 remains deferred.

## Headed GPU acceptance and favicon polish — 2026-11-09
- Ran the production build in a visible headed Chrome session at 1280x720 using the host AMD Radeon(TM) Graphics adapter through ANGLE / Direct3D 11 (hardware-backed renderer; not SwiftShader). Four workers loaded with all four hairstyle types and three face/body shapes.
- Browser diagnostics after favicon correction: zero page/console errors, zero HTTP responses >=400, and zero failed requests. The prior 404 was only the missing `/favicon.ico`; added a project SVG favicon at `public/favicon.svg` and linked it from `index.html`.
- Added a Playwright regression test for the SVG favicon. Full browser suite: 29/29 passed in 3.8 minutes; unit tests: 24/24; production build passed (526 modules); `git diff --check` passed.
- Captured `artifacts/office-headed-gpu-review.jpg` at 1280x720 from the visible headed Chrome session. This verifies one desktop GPU/browser configuration only; it is not a physical mobile/touch acceptance or a multi-device performance guarantee.
- Headless SwiftShader 20-worker profile during the complete suite: 1,175 meshes, 1,152 active meshes, 112 materials, 8 lights; average 35.287 ms, p95 70.4 ms, max 138.4 ms. Do not compare directly with the headed GPU run.
- PR #3 remains Draft/open/unmerged; P5 remains deferred. Await hosted CI for this new favicon/test commit before considering the slice complete.
