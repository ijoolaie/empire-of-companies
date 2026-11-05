# Product Roadmap — Empire of Companies

Last reviewed: 2026-11-05

## Product direction
A browser-first, 3D idle office/company management game. The player starts with a small office, hires workers, creates production capacity, earns money, upgrades operations, and expands into a multi-company empire.

## Product principles
- Babylon.js + TypeScript; procedural meshes and code-authored art first. Do not make Blender a prerequisite.
- Persian and English from the beginning; RTL/LTR must be tested.
- Game progress and saves stay on the player's device. No cloud save or sync.
- Supabase Auth is identity only; never put service-role/secret keys in the browser.
- Browser/PWA first. Android packaging with Capacitor only after the browser build is stable.
- GitHub repository is Public by explicit user approval.
- Ship small playable increments. A feature is not complete until it is implemented and verified.

## Phases and exit criteria

### P0 — Project continuity and baseline (complete)
Deliverables: roadmap, architecture/decisions, current status, session handoff, reliable build workflow.
Exit: repository documents the current truth; CI reaches a successful build.

### P1 — Reproducible development build (in progress)
Tasks: establish Node version, dependency lockfile, clean npm ci workflow; verify TypeScript/Vite build.
Exit: clean install and npm run build pass locally and in GitHub Actions.

### P2 — Playable core loop (active)
Tasks: typed game state and economy; timed income; build desks; hire workers; upgrades; local save/load; bounded offline earnings.
Exit: a new player can complete the core loop, refresh, and retain valid progress without cloud storage; income and costs are deterministic and testable.

### P3 — Game progression and UX
Tasks: onboarding/tutorial; goals and milestones; levels; unlocks; feedback; responsive controls; accessibility; complete Persian/English UI.
Exit: first-session flow is understandable and all core screens work in both languages and directions.

### P4 — Content and visual identity
Tasks: procedural office kit; worker variants; equipment; company types; floor/room expansion; visual polish; asset licensing register.
Exit: a coherent content slice with documented asset provenance and acceptable performance.

### P5 — Account and settings
Tasks: verify Supabase email sign-up/sign-in; session handling; password reset; redirect URLs; account/settings UI.
Exit: account lifecycle verified. Game save remains local and account deletion/sign-out does not silently erase local progress.

### P6 — Quality, PWA and release
Tasks: automated tests; browser/device QA; performance budgets; PWA install/offline behavior; backup/export/import of local save; Capacitor Android build and smoke test.
Exit: release checklist passes and known limitations are documented.

## Prioritization
P1 reproducibility and P2 gameplay proceed in small verifiable increments. Do not expand content or build Android packaging before a stable P2 loop. Keep each task small enough to verify in one session.
