# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Visibility: Public (explicitly approved by user).
- Default branch: main
- Main contains P2 merge commit: 06ebb5c (feat: implement playable office economy loop).
- Current local development branch: feat/p3-progression-ux (not yet pushed).
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies
- Node v22.23.2; npm 10.9.8.

## Phase status
- P0 — project direction, decisions and continuity docs: complete.
- P1 — reproducible engineering foundation, lockfile and npm ci CI: complete.
- P2 — playable core economy loop: complete and merged to main.
- P3 — progression, onboarding and usability: active; first implementation slice is local and pending push/review.

## Implemented in the local P3 branch
- Save schema v4 adds player XP, completed objective IDs and tutorial dismissal state.
- Legacy save-key lookup and migration from v2/v3-shaped saves to v4.
- Three ordered milestones: build an extra desk, hire a second worker, upgrade the office.
- One-time cash and XP rewards for each milestone.
- Player level derived from XP, with a bounded level cap of 100.
- First-run tutorial with a skip action persisted locally.
- Persian/English labels and RTL/LTR switching for the new progression UI.
- Responsive layout adjustment for a 320x568 viewport.
- Unit coverage for objective ordering, one-time rewards, save migration, XP levels and level-cap progress display.

## Verified locally (current P3 working tree)
- npm test: 14 passed, 0 failed (including XP level-cap progress edge case).
- npm run build: passed locally (TypeScript + Vite production build); Vite reports the existing ~6.0 MB minified main chunk warning.
- Headless Chrome smoke test passed:
  - Initial tutorial and three objectives rendered.
  - Persian RTL and English LTR toggles passed.
  - Desk placement awarded the first objective and XP.
  - Hiring awarded the second objective and XP.
  - Office upgrade awarded the third objective; player level reached 2.
  - Refresh restored progress; simulated 60-second offline earnings appeared.
  - Tutorial skip persisted after refresh.
  - v3-shaped save migrated to v4.
  - No JavaScript runtime exceptions observed.
- Mobile layout probe at 320x568: document remained 320x568 with no horizontal overflow; toolbar buttons fit in two rows and the panel did not overlap the toolbar.
- Browser probes were temporary local scripts; they are not yet committed or wired into CI.
- Earlier P2 CI/build success does not constitute CI verification of the current P3 branch.

## Open / not verified
- Current P3 branch has not been pushed; no P3 PR or CI result exists yet.
- Supabase sign-up/sign-in, confirmation, redirects and session lifecycle are not end-to-end verified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.
- PWA behavior and Android packaging are not implemented/verified.
- Large Babylon.js bundle still needs measured performance/code-splitting work.
- Browser checks on additional viewport sizes and other browsers remain outstanding.

## Immediate next actions
1. Finish local build, tests, diff hygiene and documentation checks.
2. Remove temporary browser probe files from the repository working tree.
3. Commit and push the verified P3 slice to feat/p3-progression-ux.
4. Open/update a PR and wait for GitHub Actions before calling the slice CI-verified.
5. Add maintainable browser regression automation to the repository/CI.
6. Continue P3 progression screen, responsive UX and localization/accessibility.
7. Keep game saves device-local; Supabase remains identity-only if/when Auth is verified.
