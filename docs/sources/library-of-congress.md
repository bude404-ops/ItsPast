# Library of Congress

## What it provides
Federal archive; photos, maps, newspapers, books, manuscripts, digitized collections and metadata.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key. No login. Official JSON API verified via loc.gov search endpoint.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Mixed item rights. Many items are public domain or no-known-restrictions, but ItsPast checks item rights and labels UNKNOWN when unclear.

## Attribution requirements
Attribution required/recommended to Library of Congress and item creator when present.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial use is conditional on item rights. AI processing only allowed automatically for public-domain/CC0 class records.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://www.loc.gov/search/?fo=json&c=1&q=Riverside%20Theater`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/libraryOfCongress.ts`

## Last verified date
2026-08-24
