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
