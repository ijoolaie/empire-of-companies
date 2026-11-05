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

## Data boundaries
- Game economy, workers, desks, progression and saves: device-local only.
- Supabase: authentication/identity only.
- Do not upload local save data to Supabase.
- Do not commit `.env.local`, credentials, tokens or secret keys.

## Build discipline
- Use Node 22.
- Commit package-lock.json and use `npm ci` in CI after lockfile exists.
- A feature is complete only after its behavior is verified; distinguish implemented, documented and tested.
