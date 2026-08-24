# Public App vs Reaper Admin Boundary

ItsPast has two separate experiences.

## Public ItsPast

The public application is the user-facing time machine. Its navigation is limited to Home, Explore, Scan, Discoveries, and Profile. Public users can scan/search places, view approved stories, see timelines, save discoveries, and share public cards.

The public app must not expose administrative routes, source management, research queues, AI prompt controls, provider configuration, API usage, database controls, moderation, approval, or reconstruction generation controls.

## Reaper Admin / Research Command Center

The internal command center is private machinery for research operations: source ingestion, entity discovery, evidence review, claim approval, timeline inspection, reconstruction studio, API monitoring, costs, conflicts, and publication review.

The internal module is isolated outside the public source tree and is not imported by the public router. Feature flags are allowed for product rollout, but they are not a security boundary. Privileged actions require server-side authorization and Supabase RLS.

## Data visibility

Public users may read published/verified historical records and create their own private discoveries, collections, and contributions. They must not modify claims, sources, confidence, reconstructions, research jobs, provider state, logs, or credentials.

The user gets the magic. Reaper gets the machinery.
