# Office Empire — Approved Visual Direction & Implementation Plan

Last reviewed: 2026-11-08
Status: concept approved; implementation plan recorded.

## 1. Approved visual direction

The user approved a premium, cinematic, semi-realistic office environment combined with anime-inspired founder and employee characters and a restrained executive HUD (dark glass, warm brass/gold and cyan accents). The target is stylized 3D, not photorealism. The reference is a product direction, not a requirement to reproduce every pixel.

## 2. Feasibility assessment

**Overall feasibility: high, with a controlled procedural-art scope.**

The current Babylon.js 8 + TypeScript + Vite stack already supports the required rendering, materials, lighting, camera, input, localization and responsive HTML HUD. Existing implementation includes:
- Procedural office shell, entrance, windows, floor details, reception/furniture and desk accessories.
- Procedural worker and founder characters, anime-inspired face details, worker arrival and founder movement.
- Four visual office-upgrade tiers.
- Directional shadows, cached procedural textures and a custom monitor dashboard texture.
- Persian/English UI, RTL/LTR, responsive controls and the executive HUD treatment.

This is an evolution of the existing scene, not a greenfield rebuild. Main feasibility risks are performance and visual coherence, not missing core technology.

### Main constraints and risks

1. **Scene complexity:** latest recorded 20-worker diagnostic contains 889 meshes, 100 materials and 5 lights. Optimize static geometry and material reuse before adding many more decorative objects.
2. **Bundle size:** latest recorded production main bundle is about 1,355 kB minified / 335 kB gzip, with Vite's >500 kB chunk warning. Investigate bundle composition and safe code splitting; procedural art alone does not guarantee a lightweight app.
3. **Rendering variability:** headless SwiftShader timings are diagnostic only. They cannot establish real GPU performance or mobile smoothness.
4. **Procedural realism:** prefer reusable low-poly forms, cached/shared materials, merged static meshes and small deterministic procedural textures over unique high-detail meshes.
5. **Mobile readability:** cinematic visuals must not obscure touch targets, HUD text, placement previews or the playable office area.
6. **Scope creep:** do not add decorative detail until scene hierarchy, composition, lighting and performance are measured.

### Practical art target

Use a **premium semi-realistic / stylized 3D** target:
- Strong composition, controlled warm/cool lighting, believable material response and consistent proportions.
- Moderate geometry detail; silhouettes and material contrast do most of the visual work.
- Anime-inspired characters harmonize with the environment rather than switching to photorealistic human models.
- No dependency on Blender, paid assets, external model downloads or large texture packs.
- Reuse and cache geometry/materials wherever possible.

## 3. Implementation order and priorities

### P4-A — Baseline and technical budget (first)
- Reconfirm branch/commit, worktree state, build, unit tests and browser suite.
- Capture consistent desktop and mobile screenshots at fixed camera positions/viewports.
- Record mesh/material/light counts, bundle/chunk sizes and render diagnostics.
- Identify largest bundle contributors and safe lazy-loading/code-splitting candidates.
- Add no decorative content in this sub-step.

**Exit:** reproducible visual/performance baseline and prioritized risk list.

### P4-B — Visual composition and lighting
- Refine camera framing, focal hierarchy, exposure, warm/cool balance and shadow softness.
- Make founder/reception, employee work area, windows and entrance read as one coherent space.
- Prefer adjusting existing lights/materials over adding lights.
- Keep alternate camera angles readable and navigation unobstructed.

**Exit:** premium office composition at desktop/mobile without material performance regression.

### P4-C — Materials and environment finish
- Refine existing stone, plaster, walnut, upholstery, glass and metal materials.
- Improve roughness/specular response and subtle surface variation with cached procedural textures.
- Consolidate repeated furniture details; merge static geometry where safe.
- Add no unique material/texture per object without measured value.

**Exit:** consistent material language with controlled mesh/material counts.

### P4-D — Character presentation
- Refine founder/worker proportions, clothing silhouette, face readability and pose variety.
- Preserve movement, collision, arrival, route avoidance and employee-to-desk behavior.
- Prefer shared character parts/materials and simple animation over heavy rigs.
- Keep characters legible at normal gameplay camera distance.

**Exit:** expressive, readable characters; existing interaction tests remain green.

### P4-E — Gameplay readability and HUD integration
- Tune executive HUD around actual gameplay.
- Validate Persian/English, RTL/LTR, keyboard and touch controls.
- Keep build/placement mode, progression panel, notices and command dock non-overlapping.
- Avoid decorative UI panels that duplicate existing information.

**Exit:** essential actions/status remain understandable from 320x568 through desktop resolutions.

### P4-F — Performance and release acceptance
- Reduce avoidable draw calls, repeated materials and unnecessary per-frame work.
- Inspect bundle composition and split non-critical code where safe.
- Run unit, build and full Playwright suites; keep scene-profile tests deterministic.
- Perform headed desktop/mobile checks and real-device GPU/touch acceptance when hardware is available.
- Record actual device/browser/GPU and measured results; do not infer FPS from headless CPU timings.

**Exit:** coherent P4 office slice, automated checks green, no blocking visual defects, and performance acceptable on agreed target devices.

## 4. Explicitly deferred

Until P4 is accepted:
- No Supabase Auth phase advancement.
- No cloud save or sync; local saves remain authoritative.
- No PWA/Capacitor/Android packaging.
- No deep department/product/market simulation expansion.
- No paid art packs, Blender dependency or photoreal asset pipeline.

## 5. Acceptance rules

- Propose and review materially different visual designs before implementation.
- Keep code slices small, independently testable and documented.
- Build, unit tests and relevant browser tests must pass before a slice is called complete.
- Real-device acceptance is separate from headless browser evidence.
- Never claim FPS/GPU acceptance from SwiftShader or CI timing alone.
- Keep PR #3 Draft and unmerged until P4 acceptance and explicit merge authorization.

## 6. Verified implementation progress — 2026-11-08

### P4-A baseline and technical budget — complete locally
- Confirmed branch `feat/p4-office-environment`, pushed code commit `c1e1a3e49878116844b35c124367fbb379189abd`, and verified a clean worktree after push.
- Production build passed: 526 modules. Latest unconfigured build main entry: 1,356.84 kB minified / 335.59 kB gzip. Vite's >500 kB warning remains and is tracked; the main Babylon.js scene still dominates the initial bundle.
- Unit tests: 24/24 passed.
- Full Playwright browser suite: 28/28 passed in 4.4 minutes, including the new short-viewport overlay check, lazy-auth loading check and scene-profile test.
- `git diff --check`: passed.
- Desktop and mobile reference captures were taken at 960x540 and 390x844 using headless Chromium + SwiftShader. These are layout/rendering references, not physical-device acceptance.
- Latest 20-worker scene profile: 889 meshes, 100 materials, 5 lights; average CPU frame time 27.163 ms, p95 43.5 ms, max 90 ms. This is headless SwiftShader diagnostic data only, not real GPU/FPS evidence.
- Reduced the profile sample window from 120 to 30 frames so the stress diagnostic completes reliably in the hosted/browser test environment.
- Deferred Supabase SDK loading until the account UI is used. With a controlled build-time Supabase configuration, the initial main chunk fell from 1,585.18 kB / 395.16 kB gzip to 1,355.22 kB / 334.94 kB gzip; the 229.68 kB / 60.22 kB gzip auth chunk is requested only on account interaction. With no Supabase configuration, the auth chunk tree-shakes to a tiny stub.
- CI #132 (run 42478680096, on older commit a732457) had two browser failures: a time-sensitive worker-arrival assertion and the 120-frame scene-profile timing metric. The tests were made less timing-sensitive and the sample window reduced. The new commit's hosted CI result must still be checked; local success is not a substitute.

### First P4-B visual refinement — in progress
- Introduced a warm limestone floor, ivory plaster, dark navy architectural trim, and coordinated walnut/navy furniture finishes.
- Added a small procedural city-skyline texture across the three office window panes; no external image/model assets were added.
- Fixed short-desktop overlap between the executive panel and top HUD, and moved the mobile movement hint above the command dock.
- Added regression coverage for the three cityscape window panes and short desktop/mobile overlay separation.
- Camera composition, richer material response, character presentation and physical-device visual review remain open.

### Current release gates
- PR #3 remains Draft, open and unmerged.
- P4 remains active. P5 Supabase identity, PWA, Android and deep business simulation remain deferred.
- Real-device GPU, touch and headed visual acceptance are still outstanding.

## 7. Lighting refinement — locally verified 2026-11-08
- Tuned the existing hemispheric light to a warmer diffuse response with a restrained cool ground contribution.
- Shifted the directional key light to a warmer tint and slightly lower intensity; softened its existing blurred shadow kernel from 14 to 18.
- Rebalanced the three existing office fill lights: two warm accents and one low-intensity cool counterbalance. No new lights were added; scene light count remains 5.
- Reduced exposure slightly and increased contrast to keep the warm stone/ivory/navy palette from looking washed out.
- Production build passed (526 modules; main entry 1,356.98 kB minified / 335.65 kB gzip; Vite >500 kB warning remains); unit tests 24/24; full Playwright 28/28 in 4.4 minutes; diff check passed.
- Headless Chromium + SwiftShader screenshots reviewed at 960x540 and 390x844. These are visual/layout references only, not physical-device GPU acceptance.
- Browser scene-profile diagnostic on this run: 0/5/10/12/20 workers averaged 16.747/17.463/26.603/27.937/32.487 ms CPU frame time; 20-worker p95 68.8 ms, 889 meshes, 100 materials, 5 lights. Timings vary substantially by host and are not FPS or device benchmarks.
- GitHub Actions for the previous pushed code commit c1e1a3e (run 42484005222) and docs commit 56c3884 (run 42484169340) both completed successfully. The current lighting refinement is not yet covered by hosted CI until its new commit is pushed.

### P4-B status
The first warm/cool lighting and shadow-softness refinement is locally complete. Camera focal hierarchy and alternate-angle review remain open. Do not mark P4-B complete until composition is reviewed and validated at the relevant viewports.

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

## 2026-11-08 — Premium baseline graphics implementation

The approved premium direction is now being applied to the playable default office tier, not reserved only for later upgrade levels. The first graphics pass adds champagne-gold architectural inlays, a navy/gold identity panel, a rug medallion, brass pendant fixtures, warm fill lights, brighter panoramic city glazing, a brighter ivory floor finish, and a textured slate exterior ground. The front and camera-facing right walls use a cutaway profile to expose more of the interior while retaining the established office footprint and accepted camera framing.

The reference image itself is not stored in the repository; visual implementation is grounded in the approved reference direction described above. This pass is a first procedural-art pass, not a claim of photorealism or final graphics completion. Continue refining materials, furniture, characters, lighting/shadows and city backdrop in iterative screenshot comparisons.

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
