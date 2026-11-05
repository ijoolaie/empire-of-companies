# Project Status

Last verified: 2026-11-05 (documentation and workflow bootstrap updated)

## Repository
- GitHub: https://github.com/ijoolaie/empire-of-companies
- Default branch: main
- Verified baseline commit: 7d210c2f0362fb445b87fbf455a3a4f8439b5e64
- Existing app files verified: package.json, index.html, tsconfig.json, src/main.ts, src/game.ts, src/auth.ts, src/i18n.ts, src/style.css, .env.example, README.fa.md.
- CI workflow exists at .github/workflows/build.yml (not ci.yml).
- Vite config file is not present; Vite can use its defaults, so this is not automatically a defect.

## Implemented (repository inspection only)
- Babylon.js 3D scene and initial office prototype.
- Basic interaction/economy prototype as described in README.fa.md.
- Persian/English dictionary and UI styling.
- Supabase Auth client scaffold.
- localStorage-based game progress approach documented.
- GitHub Actions build workflow.

## Not yet verified
- Clean dependency install.
- TypeScript compilation and production build.
- Actual gameplay loop and save/load behavior in a running browser.
- Supabase sign-up/sign-in, redirect configuration and email confirmation.
- PWA behavior and Android packaging.

## CI baseline
Workflow run 41985209822 for commit 7d210c2f0362fb445b87fbf455a3a4f8439b5e64 failed before npm install/build. The exact failure was: setup-node could not find a dependency lock file because package-lock.json/yarn.lock was absent while npm cache was enabled. This is a workflow setup failure, not evidence of a TypeScript or application build failure.

## Current phase
P0 continuity documentation is committed. P1 reproducible build is underway.

## Documentation commits
Roadmap, status, decisions, development guide and session handoff are committed under docs/. README.md now links to them. The workflow no longer enables npm cache before a lockfile exists.

## Latest CI observation
Run 41986757841 completed successfully on commit 33249ef5c4b856a17f0ab31e103f247316864e01. Both npm install and npm run build passed in GitHub Actions (Node 22). This verifies the current repository build in CI; a local clean install and browser gameplay smoke test are still pending.

## Repository privacy warning
The GitHub repository API currently reports private=false and visibility=public. This conflicts with the product decision that the repository be private. The available GitHub connection cannot change repository visibility. Do not commit additional project details until the owner changes it to Private in GitHub Settings → General → Danger Zone → Change repository visibility (or explicitly approves keeping it public).

## Next action
Inspect run 41986757841. If it reaches npm install/build, fix any actual errors. Then create and commit package-lock.json and switch CI to npm ci with caching. Verify the repository visibility setting because the workflow API payload reported `private: false`, despite the intended private-repository requirement.
