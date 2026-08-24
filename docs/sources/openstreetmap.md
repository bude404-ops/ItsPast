# OpenStreetMap / Nominatim

## What it provides
Current structures, roads, coordinates, landmarks, addresses and historic tags where present.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key. No login for public Nominatim, but strict usage policy applies: max 1 request/sec, single thread, cache, identifying User-Agent.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
OSM data is ODbL 1.0. Derived databases may trigger share-alike obligations.

## Attribution requirements
Attribution: © OpenStreetMap contributors.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial use conditional under ODbL. Do not bulk geocode on public Nominatim; use caching and throttling.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=Riverside%20Theater`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/openStreetMap.ts`

## Last verified date
2026-08-24
