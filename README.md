# ItsPast

**Everything has a story.**

ItsPast is a mobile-first historical discovery application that gives physical places, buildings, objects, infrastructure, businesses, landscapes, and landmarks a discoverable historical identity.

The core experience:

**SCAN → IDENTIFY → ITS PAST → TIMELINE → CHANGES → RECONSTRUCT → EXPLORE**

ItsPast is not a generic tourism app. It is the foundation for a structured, evidence-backed historical layer for the physical world.

## Current status

This repository contains the production-ready foundation for the ItsPast MVP:

- React + TypeScript + Vite frontend
- Mobile-first Tailwind interface
- PWA-ready metadata
- Route shell for Home, Scan, Explore, Map, Search, Discoveries, Profile, Entity, Timeline
- Supabase/PostgreSQL migration foundation
- RLS policies from day one
- Provider-independent AI service interfaces
- Map provider abstraction
- Stripe-ready mock payment service
- Demo data clearly marked as `DEMO DATA`
- GitHub Actions for CI, deployment, and security checks

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend foundation: Supabase, PostgreSQL, Row Level Security
- Auth: Supabase Auth
- Storage: Supabase Storage architecture
- Maps: MapLibre-ready adapter
- Payments: Stripe-ready service layer
- AI: provider-independent interfaces and mocks

## Development setup

```bash
npm install
npm run dev
```

## Environment variables

Copy `.env.example` to `.env.local` and fill public client values only.

Required for real Supabase mode:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not commit private keys, service-role keys, Stripe secret keys, AI provider secret keys, or database passwords.

## Database setup

Supabase schema lives in `supabase/migrations/0001_initial_schema.sql`.

Apply with the Supabase CLI when a project is configured:

```bash
supabase db push
```

Seed data in `supabase/seed/demo_data.sql` is fictional and for development only.

## Running locally

```bash
npm run dev
```

The app runs in demo mode if Supabase variables are missing.

## Testing

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment

GitHub Pages deployment is configured through `.github/workflows/deploy.yml` and only deploys from `main`.

Expected project site:

```text
https://bude404-ops.github.io/ItsPast/
```

Vite is configured with `base: /ItsPast/` so assets resolve correctly under the project path.

## Security

- RLS is enabled in the initial migration.
- Users can read public historical records.
- Users can manage their own private discoveries and collections.
- Users can submit contributions for moderation.
- Users cannot directly modify verified historical records.
- Secret-bearing AI, Stripe, and service-role Supabase calls must run server-side.

## Historical accuracy rules

ItsPast must never invent history.

- Historical claims require sources.
- AI reconstructions are labeled `AI GENERATED`.
- Generated images are never presented as authentic photographs.
- If evidence is insufficient, the system must say so.
- Demo records must remain clearly labeled `DEMO DATA`.

## Contributing

Use feature branches and pull requests. Every PR should pass type checking, linting, tests, and production build.

## Roadmap

See `docs/roadmap/roadmap.md`.
