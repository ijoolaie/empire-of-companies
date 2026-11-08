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

### P4-A — Baseline and technical budget (next)
- [ ] Reconfirm branch head and worktree state before code changes.
- [ ] Run/confirm production build, unit suite and full browser suite on the exact head.
- [ ] Capture consistent headed desktop and mobile scene views at fixed camera positions.
- [ ] Record current mesh/material/light counts and bundle/chunk composition.
- [ ] Identify top bundle contributors and safe lazy-loading/code-splitting candidates.
- [ ] Separate software-renderer/CI diagnostics from real GPU/device evidence.

### P4-B — Visual composition and lighting
- [ ] Refine camera framing and scene focal hierarchy.
- [ ] Balance warm/cool lighting, exposure, shadow softness and contrast.
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
