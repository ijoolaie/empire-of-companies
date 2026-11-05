# Work Breakdown Structure — Empire of Companies

Last reviewed: 2026-11-05 — P3 initial progression slice verified locally
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

## Phase 0 — Direction, scope and continuity
**Status: complete**

0.1 Define game concept, target platform and first-release boundary.  
0.2 Select technology stack and repository structure.  
0.3 Record privacy, save ownership, authentication and asset constraints.  
0.4 Create roadmap, status, development guide and session handoff.  
0.5 Establish GitHub Actions build.

**Exit:** decisions and current state are documented; baseline CI build has passed.

## Phase 1 — Reproducible engineering foundation
**Status: complete**

1.1 Pin supported Node major version in project docs and CI.  
1.2 Generate and commit package-lock.json using the project npm version.  
1.3 Replace npm install with npm ci in CI.  
1.4 Verify clean dependency install and production build locally and in CI.  
1.5 Add formatting/lint rules only if they can be enforced without slowing feature work.  
1.6 Add test runner and a minimal test command.  
1.7 Add a pull-request check that runs build and tests.  
1.8 Document environment variables; ensure .env.local and secrets remain ignored.

**Exit:** a fresh clone installs deterministically and build/tests pass locally and in CI.

## Phase 2 — Playable core loop
**Status: complete; PR #1 merged after local interactive browser acceptance**

### 2A. Game state and persistence
2.1 Define a versioned GameState schema.  
2.2 Validate every loaded field and apply safe defaults.  
2.3 Add save migration from the prototype's previous keys/schema.  
2.4 Save after meaningful actions and periodically without excessive writes.  
2.5 Handle malformed, missing, and future-version saves safely.  
2.6 Add explicit reset-save action with confirmation.  
2.7 Add import/export backup in a later quality task.

### 2B. Economy simulation
2.8 Define currency, starting cash, income rates and cost curves in one module.  
2.9 Derive income from staffed production capacity and upgrades.  
2.10 Use elapsed-time accumulation that does not lose fractional seconds.  
2.11 Prevent negative balances and invalid worker/desk states.  
2.12 Cap offline earnings and ignore negative/future clock deltas safely.  
2.13 Show cash, rate, workers, capacity, level and offline reward clearly.  
2.14 Add deterministic unit tests for income, costs, hiring, building and upgrades. (Implemented: 10 tests; CI run 41988139202 passed.)

### 2C. First playable actions
2.15 Place a desk on valid floor cells. (Bounds, overlap and interactive browser placement verified.)
2.16 Reject overlap, wall, blocked and out-of-bounds placements.  
2.17 Hire only when an unstaffed desk and enough cash exist.  
2.18 Show staff assignment on the 3D desk/worker. (Deferred to Phase 4 worker visuals.)
2.19 Upgrade office and expose the exact effect and cost.  
2.20 Provide clear success/failure feedback and prevent double-click exploits.

### 2D. First-session validation
2.21 New player starts with a valid office and understandable objective.  
2.22 Complete one loop: build capacity → hire → earn → upgrade.  
2.23 Refresh page and confirm all progress persists.  
2.24 Close/reopen after a delay and confirm bounded offline earnings.  
2.25 Test corrupt save, insufficient cash, full capacity and clock rollback.

**Exit:** a new player can complete the loop, refresh/reopen, and retain valid local progress; economy tests pass; browser smoke test passes.

## Phase 3 — Progression, onboarding and usability
**Status: in progress**

3.1 Add a short first-run tutorial with skippable steps. (Implemented and browser-verified.)
3.2 Add objectives and reward milestones. (Three initial milestones implemented with one-time cash/XP rewards.)
3.3 Define XP/level progression and unlock requirements. (Player XP and level 2 threshold implemented; further unlocks remain.)
3.4 Add a progression screen explaining next unlocks.  
3.5 Add contextual hints, confirmation dialogs and error messages.  
3.6 Improve HUD hierarchy and responsive layouts for desktop/tablet/mobile.  
3.7 Ensure all interactive actions are keyboard reachable where practical.  
3.8 Add sound settings and restrained UI feedback (sound can be deferred).  
3.9 Complete Persian and English copy; audit RTL/LTR, numbers, currency and layout.  
3.10 Add settings for language, audio, graphics and save management.

**Exit:** first-time users can understand the goal and complete the first progression milestone on supported screen sizes and both locales.

## Phase 4 — 3D content and company identity
**Status: planned**

4.1 Define visual direction, palette, scale and camera conventions.  
4.2 Build reusable procedural furniture: desk, chair, monitor, lamp, cabinet, plant.  
4.3 Build worker character variants using procedural meshes or licensed assets.  
4.4 Add idle/work/walk animations or simple readable motion.  
4.5 Add room modules, walls, doors, windows and floor materials.  
4.6 Add departments with distinct furniture and production roles.  
4.7 Add additional company types with different production loops.  
4.8 Add office/floor expansion and placement grid rules.  
4.9 Add asset register with source, license, attribution and modification notes.  
4.10 Profile draw calls, texture sizes, loading and memory; use instancing where useful.

**Exit:** one visually coherent office/department set with identifiable workers, readable production states, documented asset provenance and acceptable browser performance.

## Phase 5 — Business simulation depth
**Status: planned; scope to be balanced against first-release size**

5.1 Define departments and their inputs/outputs.  
5.2 Add production capacity, throughput and bottlenecks.  
5.3 Add products/services and market demand abstraction.  
5.4 Add operating expenses, wages and maintenance.  
5.5 Add pricing and profit/loss summaries.  
5.6 Add contracts/orders or customer demand.  
5.7 Add research/technology upgrades.  
5.8 Add multiple companies and shared holding-level overview.  
5.9 Add staff roles, skills and management bonuses.  
5.10 Add balancing simulations and progression curves.

**Exit:** players make meaningful trade-offs beyond clicking the highest-return upgrade; simulation remains understandable and balanced.

## Phase 6 — Account, settings and optional identity
**Status: scaffold exists; end-to-end verification pending**

6.1 Configure Supabase email authentication and redirect URLs.  
6.2 Verify sign-up, email confirmation, sign-in and sign-out.  
6.3 Add password reset and session restoration.  
6.4 Explain clearly that account identity does not sync game saves.  
6.5 Test auth unavailable/offline and expired-session states.  
6.6 Keep only publishable client key in browser; no service-role key.  
6.7 Ensure sign-out/account deletion does not erase local game progress.  
6.8 Add privacy notice and account deletion guidance if accounts are enabled for release.

**Exit:** account lifecycle passes end-to-end tests; local save remains independent of account state. If accounts add no launch value, defer them rather than block release.

## Phase 7 — Quality, reliability and release readiness
**Status: planned**

7.1 Unit tests for economy, save migration and progression.  
7.2 Integration tests for player actions and state transitions.  
7.3 Browser smoke tests on current Chrome, Firefox and Edge.  
7.4 Mobile browser tests for touch, layout and performance.  
7.5 Test refresh, crash/reopen, offline mode, storage full and invalid save.  
7.6 Add telemetry only if privacy-safe and explicitly approved; no personal data by default.  
7.7 Define performance budgets and profile low-end hardware.  
7.8 Add error boundary/fallback UI and graceful WebGL failure handling.  
7.9 Add backup export/import and save schema compatibility tests.  
7.10 Prepare release checklist, known issues and version notes.

**Exit:** release checklist passes; critical defects are zero; known limitations are documented.

## Phase 8 — PWA and distribution
**Status: planned**

8.1 Add web app manifest and app icons.  
8.2 Add service worker with safe cache versioning.  
8.3 Verify installability and offline launch.  
8.4 Verify update flow does not corrupt local saves.  
8.5 Configure production hosting and HTTPS.  
8.6 Add privacy/support/about pages.  
8.7 Prepare public web release and collect feedback.  
8.8 Fix release-blocking feedback before mobile packaging.

**Exit:** installable web app works online/offline and updates without losing local progress.

## Phase 9 — Android packaging
**Status: later; do not start before browser release candidate**

9.1 Add Capacitor Android wrapper.  
9.2 Configure app ID, icons, splash screen and permissions minimally.  
9.3 Test WebGL/Babylon rendering and touch on real Android devices.  
9.4 Test pause/resume, background/foreground and local persistence.  
9.5 Test performance, memory and thermal behavior.  
9.6 Configure signing and release build securely.  
9.7 Prepare store assets and privacy declarations if publishing to a store.

**Exit:** signed Android release candidate passes device smoke tests and preserves local saves.

## Phase 10 — Post-launch operations and expansion
**Status: future**

10.1 Maintain prioritized bug backlog.  
10.2 Add analytics only with privacy review and explicit product approval.  
10.3 Plan new departments, companies, events and progression content.  
10.4 Add localization and accessibility improvements.  
10.5 Maintain save migrations and backward compatibility.  
10.6 Publish changelog and release cadence.

**Exit:** sustainable update process with regression coverage and safe save compatibility.

## Current execution order (do not skip ahead)

1. Complete P3 tutorial/objective/XP browser regression checks and save migration edge cases.
2. Add repeatable browser automation to the repository and CI.
3. Improve HUD and responsive layout for desktop, tablet and mobile.
4. Add a progression screen for upcoming unlocks and contextual guidance.
5. Continue Persian/English accessibility and settings work.
6. Defer worker animation/art to Phase 4 and Supabase Auth lifecycle to Phase 6.

## Definition of done for every task

- Code/documentation exists in the intended branch.
- Build passes.
- Relevant tests pass.
- User-visible behavior is manually checked when applicable.
- Save compatibility and security constraints are respected.
- Status and handoff docs reflect only verified facts.
- No task is marked complete solely because code was written.
