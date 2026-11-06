# Session Handoff — Empire of Companies

Last updated: 2026-11-06

## Mission
Continue the browser-first 3D office/company management game:
https://github.com/ijoolaie/empire-of-companies

## Non-negotiable product decisions
- Babylon.js + TypeScript + Vite.
- Persian/English and RTL/LTR.
- Browser first; PWA next; Android via Capacitor later.
- Procedural art; do not require Blender or paid assets.
- Local-only game saves. Supabase is identity-only, not cloud save/sync.
- Do not merge PRs without explicit user approval.
- User asked for practical execution and verified status, not schedules.

## Repository state
- Local path: `C:\Users\Ali\local-mcp-bridge\workspaces\empire-of-companies`.
- Baseline main commit: `7914290` (PR #2 merged).
- Current branch: `feat/p4-office-environment`.
- Latest changes are local and uncommitted/unpushed. No PR or CI run exists for this slice yet.

## Current implementation
- Core economy, desk placement, hiring, upgrades, local persistence and bounded offline earnings.
- Progression schema v4, XP/levels, three ordered objectives, tutorial and accessible progression dialog.
- Procedural seated workers with deterministic appearance variants, three idle poses and arrival walking.
- Desk equipment: monitor stand/base, keyboard and mouse.
- Office-shell slice on current branch: five wall segments, open 2.5-unit entrance, entrance trim/threshold/sign, three framed rear windows, three ceiling panels, three warm point lights and baseboards.
- Entrance remains open; no door mesh blocks the existing arrival corridor.
- Canvas diagnostics: `data-office-wall-segment-count`, `data-office-window-count`, `data-office-entrance-part-count`, `data-office-light-count`.

## Verification
- Unit tests: 22/22 passed.
- Production build: passed; 466 modules, main bundle 1,154.46 kB minified / 285.72 kB gzip. Existing >500 kB Vite warning remains.
- Browser tests: 19/19 passed.
- Diff whitespace check: passed.
- Automated office-shell mesh/light counts passed.
- Manual visual acceptance is not complete. Do not claim the new environment looks correct from alternate angles until screenshots are captured and inspected.
- GitHub Actions has not yet run on this branch.

## Exact next steps
1. Review screenshots at desktop and mobile sizes plus an alternate camera angle.
2. Fix any visual occlusion or lighting issues found.
3. Re-run unit tests, build, browser tests and diff check.
4. Commit and push `feat/p4-office-environment`, open a PR and inspect its CI.
5. Do not merge without explicit approval.
