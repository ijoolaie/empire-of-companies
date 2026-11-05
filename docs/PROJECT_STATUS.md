# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (explicitly approved by user).
- Default branch: main; P2 merge commit: 06ebb5c.
- Current development branch: feat/p3-progression-ux.
- Local HEAD: f2985290ef164d7a2c08e806fec17997859d339b (pushed and matches origin/feat/p3-progression-ux).
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2 (open, Draft, not merged; do not merge automatically).
- GitHub Actions run #30: 42054389812, Build, completed successfully for commit f298529, including Chromium installation and all browser regression tests.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies
- Node v22.23.2; npm 10.9.8.

## Phase status
- P0 — project direction, decisions and continuity docs: complete.
- P1 — reproducible engineering foundation, lockfile and npm ci CI: complete.
- P2 — playable core economy loop: complete and merged to main.
- P3 — progression, onboarding and usability: active; first slice is in PR #2, and repeatable browser regression tests are implemented locally but await push and CI verification.

## Implemented in P3
- Save schema v4 adds player XP, completed objective IDs and tutorial dismissal state.
- Legacy save-key lookup and migration from v2/v3-shaped saves to v4.
- Three ordered milestones: build an extra desk, hire a second worker, upgrade the office.
- One-time cash and XP rewards for each milestone.
- Player level derived from XP, with a bounded level cap of 100.
- First-run tutorial with a skip action persisted locally.
- Persian/English labels and RTL/LTR switching for the progression UI.
- Responsive layout adjustment for a 320x568 viewport.
- Unit coverage for objective ordering, one-time rewards, save migration, XP levels and level-cap progress display.
- Playwright browser regression suite and CI workflow step for Chromium.
- Fixed a real UI hit-testing issue: topbar language/account buttons were behind the full-screen Babylon canvas; .topbar and .stats now explicitly receive pointer events.

## Verified locally in the current working tree
- npm run build: passed; TypeScript + Vite production build. The existing main bundle remains about 6.0 MB minified (about 1.32 MB gzip); Vite still emits its >500 kB chunk warning.
- npm ci: passed; audit reported 0 vulnerabilities. npm test: 14 passed, 0 failed.
- npm run test:browser: 4 passed, 0 failed:
  - First-run tutorial dismissal persists across reload.
  - Language toggle changes document language and direction (English LTR / Persian RTL).
  - Objective rewards and XP are awarded; completed objectives persist after reload.
  - Offline earnings render from a saved timestamp.
  - 320x568 viewport has no horizontal overflow and panel does not overlap toolbar.
- Browser suite runs against Vite production preview and uses Playwright Chromium with SwiftShader flags.
- Browser automation was verified locally on Windows; the newly added GitHub Actions Chromium installation/test steps have not yet run in CI. git diff --check passed.

## Open / not verified
- Browser automation changes are committed and pushed in f298529; CI run #30 completed successfully, including the Playwright browser suite.
- Supabase sign-up/sign-in, confirmation, redirects and session lifecycle are not end-to-end verified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.
- PWA behavior and Android packaging are not implemented/verified.
- Large Babylon.js bundle still needs measured performance/code-splitting work.
- Browser checks on Firefox, Edge and additional mobile sizes remain outstanding.

## Immediate next actions
1. Continue P3 by implementing a progression/unlock screen that explains the next goals and locked features.
2. Expand responsive and localization/accessibility checks beyond 320x568.
3. Keep the PR in Draft until the remaining P3 acceptance criteria are reviewed; do not merge automatically.
4. Keep game saves device-local; Supabase remains identity-only if/when Auth is verified.