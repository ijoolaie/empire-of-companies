# Work Breakdown Structure — Empire of Companies

Last reviewed: 2026-11-08 — approved Office Empire art direction and P4 implementation order recorded
Owner: Product / engineering
Status: Living plan; task status is only changed after observable verification.

## Product definition and release boundary
A browser-first, bilingual 3D idle management game. The player starts with one small office, builds productive capacity, hires staff, earns and reinvests cash, unlocks departments and companies, and grows a business empire. The first release is a polished, stable vertical slice, not an endless content catalogue.

### Product constraints
- Babylon.js + TypeScript + Vite.
- Persian/English, RTL/LTR.
- Browser first; PWA and Android packaging only after core browser gameplay is stable.
- Saves stay local on the device. No cloud save or cross-device sync.
- Supabase Auth is optional account identity only.
- Procedural 3D art first; free/licensed assets allowed with provenance records. Blender is not a prerequisite.
- Public GitHub repository, explicitly approved by the user.
- No feature is complete until its acceptance checks pass.
- Approved visual direction: premium cinematic semi-realistic/stylized office + anime-inspired characters + executive HUD; no photorealism requirement.

## P4 — Approved Office Empire visual slice (active; top priority)
The user approved the concept on 2026-11-08. Detailed feasibility, risks, implementation order and acceptance criteria are in [docs/VISUAL_DIRECTION_AND_IMPLEMENTATION_PLAN.md](VISUAL_DIRECTION_AND_IMPLEMENTATION_PLAN.md).

### P4-A — Baseline and technical budget (complete locally on 2026-11-08)
- [x] Reconfirm branch head and worktree state before code changes.
- [x] Run/confirm production build, unit suite and full browser suite on the exact head (build pass; 24/24 unit; 28/28 browser).
- [x] Capture desktop 960x540 and mobile 390x844 reference views (headless SwiftShader; physical device still pending).
- [x] Record scene mesh/material/light counts and production bundle/chunk sizes.
- [x] Identify the main Babylon.js chunk and defer Supabase auth loading to account interaction.
- [x] Separate SwiftShader/CI diagnostics from real GPU/device evidence; real-device acceptance remains a P4-F gate.

### P4-B — Visual composition and lighting (active; first visual refinement pushed)

Initial pass on c1e1a3e: warm limestone/ivory/navy/walnut palette, procedural city skyline texture on three window panes, short-desktop HUD spacing, and mobile movement-hint spacing. Lighting refinement is locally verified on the current uncommitted tree: warm hemispheric/sun lighting, two warm and one cool fill light, softer shadow kernel, and tighter exposure/contrast. Next: camera focal hierarchy and alternate-angle review. Latest local checks: build pass, 24/24 unit, 28/28 browser; SwiftShader only.
- [ ] Refine camera framing and scene focal hierarchy.
- [x] Balance warm/cool lighting, exposure, shadow softness and contrast (first pass locally verified; final art-direction review still open).
- [ ] Ensure entrance, reception/founder, employee work area and windows read as one space.
- [ ] Prefer reuse/tuning of current lights over adding more lights.
- [ ] Verify alternate camera angles and navigation clearance.

### P4-C — Materials and environment finish
- [ ] Refine existing stone, plaster, walnut, upholstery, glass and metal response.
- [ ] Reuse cached procedural textures and shared materials.
- [ ] Consolidate repeated static furniture details where safe.
- [ ] Avoid unique high-resolution textures or one-off meshes without measured value.

### P4-D — Character presentation
- [ ] Refine founder/worker silhouette, clothing, facial readability and pose variety.
- [ ] Preserve movement, collision, route avoidance, arrival and employee/desk behavior.
- [ ] Prefer shared materials and simple animation over heavyweight rigs.
- [ ] Verify appearance at normal gameplay camera distance.

### P4-E — HUD and gameplay readability
- [ ] Validate approved executive HUD at 320x568, 375x667, 390x844 and desktop sizes.
- [ ] Verify no overlap between top bar, progression panel, status notices and command dock.
- [ ] Audit Persian/English copy, RTL/LTR, keyboard access and touch target sizes.
- [ ] Avoid duplicative decorative panels.

### P4-F — Performance and acceptance
- [ ] Reduce avoidable draw calls, material duplication and unnecessary per-frame work.
- [ ] Investigate main bundle size and safe code splitting.
- [ ] Keep unit, build and full Playwright checks green.
- [ ] Make scene-profile regression deterministic; document timing-only CI anomalies accurately.
- [ ] Complete headed desktop/mobile and physical-device GPU/touch review.
- [ ] Record tested devices, browser versions, viewport, GPU and observed performance.
- [ ] Obtain user acceptance of completed P4 experience before moving to P5.

## Deferred phases
P5 Supabase Auth, P6 PWA/release, Android packaging, and deep P7 business simulation remain deferred until P4 exit criteria pass.

## Definition of done for every task
- Code/documentation exists in the intended branch.
- Build passes.
- Relevant tests pass.
- User-visible behavior is manually checked when applicable.
- Save compatibility and security constraints are respected.
- Status and handoff docs reflect only verified facts.
- No task is marked complete solely because code was written.