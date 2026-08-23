# Database Schema

The initial Supabase migration creates the production foundation for ItsPast.

## Core tables
- `profiles`
- `entity_types`
- `locations`
- `physical_entities`
- `historical_events`
- `timeline_events`
- `historical_sources`
- `historical_images`
- `historical_documents`
- `entity_relationships`
- `reconstructions`
- `reconstruction_evidence`
- `user_contributions`
- `verification_records`
- `saved_discoveries`
- `collections`
- `business_accounts`
- `subscriptions`
- `reconstruction_credits`
- `audit_logs`

## Confidence
`CONFIRMED`, `HIGH`, `MEDIUM`, `LOW`, and `SPECULATIVE` are enforced by database enum.

## RLS posture
Public historical data is readable. Private saves, collections, subscriptions, credits, and contributions are scoped to the owner. Verified records are not directly user-editable.
