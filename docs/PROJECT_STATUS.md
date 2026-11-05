# Project Status

Last verified: 2026-11-06

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main; P2 merge: 06ebb5c.
- Development branch: feat/p3-progression-ux.
- Latest pushed code commit: 8c445bc; local follow-up adjusts seated leg orientation and passes all local checks. Changes not yet committed.
- PR #2: https://github.com/ijoolaie/empire-of-companies/pull/2 (open, Draft, not merged).
- CI run #33 (42063106976) passed for bae936f, including Chromium browser tests.
- Local clone: C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies.

## Phase status
- P0/P1 complete.
- P2 playable core loop complete and merged.
- P3 progression/onboarding/UX active.
- P4 3D content active at an initial procedural-worker slice; not complete.

## P3 implemented and verified
- Save schema v4, legacy migration, player XP and level.
- Three ordered milestones with one-time cash/XP rewards.
- Skippable first-run tutorial.
- Persian/English and RTL/LTR.
- Progression dialog with current XP, milestone states/rewards, and planned roadmap at levels 3, 5 and 10.
- Dialog accessibility: modal semantics, accessible description, Escape/backdrop/close-button dismissal, keyboard focus containment and focus restoration.
- Playwright CI suite covering progression, persistence, localization, accessibility and responsive layouts.

## P4 initial procedural worker slice (pushed; follow-up leg-detail slice locally verified)
- Procedural seated worker models are attached to the first staffed desk positions.
- Hiring calls syncWorkers and creates the additional worker model at the next available desk.
- Workers have skin/shirt/hair meshes, seated torso/arm poses, procedural thighs, lower legs and shoes; lower-body positions were corrected to extend toward the desk. Subtle body motion and simple typing/arm motion remain.
- Desk furniture now includes a chair backrest.
- Canvas data attributes expose worker-model count and expected leg/shoe mesh count for browser regression checks.
- No external assets or Blender dependency.
- Work/walk animations, character variants, detailed poses, scene profiling and visual manual acceptance remain open.

## Local verification for current local slice
- npm test: 14 passed, 0 failed.
- npm run build: passed.
- npm run test:browser: 8 passed, 0 failed; progression/mobile/accessibility suite plus worker model and leg/shoe mesh-count assertions.
- git diff --check: passed.
- Babylon main chunk warning remains: 6,026.40 kB minified / 1,322.29 kB gzip.
- Initial worker model commit e506463 passed GitHub Actions run #35 (42106950970).
- Follow-up commit 2146410 passed GitHub Actions run #36 (42107749624).`r`n- Worker lower-body code commit 8c445bc passed GitHub Actions run #38 (42108661210).`r`n- Docs commit 7019cdc run #39 (42108774779) has build/unit tests passed; Chromium install was still running at last check.

## Open
- Review worker model proportions/placement visually in a real browser session.
- Commit and push the corrected seated leg placement; verify GitHub Actions.
- Continue P3 screen-reader, HUD hierarchy and responsive UX work.
- Continue P4 worker work-state animation, variants, furniture details and performance profiling.
- Supabase Auth lifecycle remains unverified.
- PWA and Android packaging remain unimplemented.

## Next actions
1. Commit/push corrected seated leg placement and verify CI.`r`n2. Perform a genuine visual review when a screenshot-capable browser surface is available.`r`n3. Continue worker animation/variants and scene profiling.`r`n4. Keep PR #2 Draft and unmerged unless explicitly requested.`r`n5. Keep game saves device-local; Supabase remains identity-only.
4. Keep PR #2 Draft and unmerged unless explicitly requested.
5. Keep game saves device-local; Supabase remains identity-only.
