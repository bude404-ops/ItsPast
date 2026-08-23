# ItsPast Architecture Overview

ItsPast is a mobile-first React/Vite application backed by Supabase/PostgreSQL. The app is organized around physical entities and evidence-backed historical layers.

## Frontend
React, TypeScript, Vite, Tailwind CSS, component-based pages, and mobile-first navigation.

## Backend
Supabase provides authentication, PostgreSQL, row level security, and storage. Service-role operations must only run server-side.

## Database
The core model is `physical_entities`, connected to locations, historical events, timeline events, sources, media, reconstructions, contributions, verification, saved discoveries, subscriptions, and audit logs.

## Storage
Buckets should be separated by trust and privacy: public historical images, private user contributions, reconstruction outputs, and avatars.

## AI
AI services are provider-independent. Frontend mocks define interfaces only. Real providers must be called through secure backend functions.

## Maps
Map code uses an adapter layer so MapLibre or another provider can be swapped without rewriting entity features.

## Payments
Stripe architecture is mocked until publishable and server-side secret credentials are configured.

## Authentication
Supabase Auth is the target. Local demo auth allows development without credentials.

## Deployment
GitHub Pages hosts the static frontend with Vite `base: /ItsPast/`.
