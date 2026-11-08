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
