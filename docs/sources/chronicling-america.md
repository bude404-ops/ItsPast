# Chronicling America via Library of Congress

## What it provides
Historical newspaper discovery through LOC collection JSON. Legacy chroniclingamerica.loc.gov JSON search returned 404 during verification, so core connector uses LOC collection JSON.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key. No login for LOC collection JSON.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Mixed newspaper rights; store metadata, source links, and permitted snippets only. Full article reproduction is not allowed by default.

## Attribution requirements
Attribution to LOC/Chronicling America and newspaper title where available.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial/AI use needs legal/terms review unless item rights clearly permit it.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://www.loc.gov/collections/chronicling-america/?fo=json&c=1&q=Riverside%20Theater`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/chroniclingAmerica.ts`

## Last verified date
2026-08-24
