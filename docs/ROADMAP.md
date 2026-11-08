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