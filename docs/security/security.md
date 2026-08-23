# Security

## Secrets
Never commit `.env`, Supabase service-role keys, Stripe secret keys, AI provider secrets, or database passwords.

## RLS
Supabase RLS is enabled from the first migration. Users can read public historical records, manage their own saves/collections, and submit contributions for moderation. Users cannot modify verified records directly.

## Authentication
Supabase Auth owns user identity. Admin operations require role checks and server-side enforcement.

## API security
Secret-bearing calls must run through server-side functions, never directly from the browser.

## Private data
Private discoveries remain private by default. User location history should not be sold or retained unnecessarily.
