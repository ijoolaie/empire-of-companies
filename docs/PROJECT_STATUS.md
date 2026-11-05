# Project Status

Last verified: 2026-11-05

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest functional commit: bae936f (progression dialog keyboard accessibility).
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2 (open, Draft, not merged).
- CI run #32 (42061404610) succeeded for be73756.
- CI run #33 (42063106976) is running for bae936f; build and unit tests passed, Chromium installation is in progress, browser tests are pending.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Phase status
- P0/P1 complete.
- P2 playable core loop complete and merged.
- P3 progression/onboarding/UX active.

## P3 implemented
- Save schema v4, legacy migration, player XP and level.
- Three ordered milestones with one-time cash/XP rewards.
- Skippable first-run tutorial.
- Persian/English and RTL/LTR.
- Playwright browser suite in CI.
- Progression dialog: current level/XP, ordered milestone states, rewards, and future roadmap at levels 3, 5 and 10. Future features are clearly marked planned/not yet available.
- Progression dialog accessibility: modal semantics, accessible description, Escape/backdrop/close-button dismissal, keyboard focus containment and focus restoration to the opener.
- Responsive progression dialog coverage at 320, 375, 768 and 1366 CSS-pixel viewport widths.

## Verification for latest functional slice (bae936f)
- npm test: 14 passed, 0 failed.
- npm run build: passed.
- npm run test:browser: 8 passed, 0 failed.
- git diff --check: passed.
- Build warning remains: Babylon main chunk about 6,023.70 kB minified / 1,321.52 kB gzip.
- GitHub Actions run #33 is not yet complete; do not report CI success for bae936f.

## Open
- Verify CI run #33 completion.
- Supabase Auth lifecycle remains unverified.
- Worker visuals/animation and visible worker-to-desk assignment remain incomplete.
- PWA and Android packaging remain unimplemented.
- Babylon bundle optimization remains open.

## Next actions
1. Verify GitHub Actions run #33 for bae936f.
2. Continue P3 keyboard/screen-reader and responsive UX review.
3. Keep PR #2 Draft and unmerged unless explicitly requested.
4. Keep game saves device-local; Supabase remains identity-only.
