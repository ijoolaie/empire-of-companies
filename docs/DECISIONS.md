# Architecture and Product Decisions

Last reviewed: 2026-11-08

| ID | Decision | Rationale / constraint |
|---|---|---|
| D-001 | Babylon.js + TypeScript + Vite | Existing prototype stack; browser-first 3D. |
| D-002 | Browser/PWA first; Android later via Capacitor | Reduce early platform complexity. |
| D-003 | Persian and English | Both locales are first-class; test RTL/LTR. |
| D-004 | Game saves remain local | Explicit product requirement; no cloud save/sync. |
| D-005 | Supabase Auth only | Identity/account separate from game state. |
| D-006 | Browser uses publishable/anon key only | Service-role and secret keys must never ship to clients. |
| D-007 | Procedural 3D art first; licensed GLB assets allowed | Blender is not a required workflow; track asset licenses. |
| D-008 | Public GitHub repository | User explicitly approved public visibility on 2026-11-05. |
| D-009 | Build verification before feature expansion | Avoid layering features on an unverified baseline. |
| D-010 | Approved Office Empire art direction is premium cinematic semi-realistic/stylized 3D with anime-inspired characters and an executive HUD | User approved the concept on 2026-11-08. Target visual quality through composition, lighting and reusable materials; no photorealism, paid assets or Blender dependency. |
| D-011 | Visual implementation must be incremental and performance-budgeted | Current recorded scene and bundle are substantial; measure mesh/material/light counts, bundle composition and device behavior before adding detail. Prefer shared materials, merged static geometry, cached procedural textures and lazy loading where safe. |
| D-012 | P4 visual acceptance gates P5 and platform expansion | Do not advance Supabase Auth, PWA, Android or deep business simulation until the office visual slice passes automated and real-device acceptance. |

## Change control
A decision changes only when the user explicitly approves a change or new evidence makes the current decision invalid. Update this file and the session handoff when changing a decision.
