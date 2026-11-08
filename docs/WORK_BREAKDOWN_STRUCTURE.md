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
