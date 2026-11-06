# Product Roadmap — Empire of Companies

Last reviewed: 2026-11-06

## Product direction
A browser-first 3D idle office/company management game. The player starts with a small office, hires workers, creates production capacity, earns money, upgrades operations, and expands into a multi-company empire.

## Product principles
- Babylon.js + TypeScript; procedural meshes and code-authored art first. Blender is not a prerequisite.
- Persian and English from the beginning; RTL/LTR must be tested.
- Game progress and saves stay on the player's device. No cloud save or sync.
- Supabase Auth is identity only; never put service-role/secret keys in the browser.
- Browser/PWA first. Android packaging with Capacitor only after the browser build is stable.
- GitHub repository is public by explicit user approval.
- Ship small playable increments. A feature is not complete until implemented and verified.

## Phases and exit criteria

### P0 — Project continuity and baseline (complete)
Roadmap, architecture/decisions, status, handoff and reliable build workflow.

### P1 — Reproducible development build (complete)
Clean dependency install, lockfile, TypeScript/Vite build and CI.

### P2 — Playable core loop (complete)
Economy, build desks, hire workers, upgrades, local save/load and bounded offline earnings.

### P3 — Progression and UX (implemented; maintenance only)
Onboarding/tutorial, ordered milestones, XP/levels, rewards, Persian/English, responsive controls and accessible progression dialog. Reopen only for defects or targeted UX improvements.

### P4 — Content and visual identity (active)
- Procedural workers, appearance variants, arrival/idle animations and desk equipment are implemented.
- Current slice adds an office shell with side/front walls, a clear entrance, framed windows, trim, ceiling panels, warm fill lights, a bookcase/books, a wall clock and framed wall art.
- Headless Chromium/SwiftShader screenshots were reviewed at desktop (900×600) and mobile (390×844), including alternate orbit views; no obvious geometry clipping or entrance obstruction was observed. Real-device GPU review remains open.
- Next: refine furniture layout, visual hierarchy, lighting and material contrast, validating each slice at desktop/mobile sizes and alternate camera angles.
- Exit: coherent visual content slice, acceptable performance and documented asset provenance.

### P5 — Account and settings
Verify Supabase email sign-up/sign-in, session restore, password reset, redirect URLs and account/settings UI. Account identity must not silently migrate or sync local game saves.

### P6 — Quality, PWA and release
Automated unit/integration/browser tests, device QA, performance budgets, PWA install/offline behavior, local-save export/import, Capacitor Android build and smoke test.

### P7 — Business simulation (design and implement after the office content slice)
Departments, products, demand, inputs/outputs, salaries, operating expenses, pricing, contracts, R&D, multiple companies and holding overview.

## Prioritization
P0–P2 are complete. P3 is implemented and merged. P4 is active. Finish and visually validate a coherent office environment before deep business simulation, authentication, PWA or Android packaging.
