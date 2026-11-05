# Development Guide

## Requirements
- Node.js 22 (CI baseline)
- npm
- Git

## Setup (PowerShell)
```powershell
git clone https://github.com/ijoolaie/empire-of-companies.git
cd empire-of-companies
npm ci
Copy-Item .env.example .env.local
```

Edit `.env.local` with the Supabase project URL and publishable/anon key only. If not testing account features, leave the values unset; never paste a service-role or secret key into a Vite variable.

## Commands
```powershell
npm run dev
npm run build
npm run preview
```

## Browser regression tests
- npm run test:browser runs the committed Playwright suite against the production preview build.
- Install the local browser once with npx playwright install chromium.
- CI installs Chromium and runs the browser suite after unit tests.
- The suite covers tutorial dismissal, Persian RTL / English LTR, progression rewards and persistence, offline earnings, and a 320x568 layout check.

## Data boundaries
- Game economy, workers, desks, progression and saves: device-local only.
- Supabase: authentication/identity only.
- Do not upload local save data to Supabase.
- Do not commit `.env.local`, credentials, tokens or secret keys.

## Build discipline
- Use Node 22.
- Commit package-lock.json and use `npm ci` in CI after lockfile exists.
- A feature is complete only after its behavior is verified; distinguish implemented, documented and tested.