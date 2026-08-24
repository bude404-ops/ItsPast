# Internet Archive

## What it provides
Scanned books, directories, documents, photos, maps, publications and archived web material.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key for Advanced Search. No login for public metadata. Downloads vary by item rights and file availability.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Mixed per item; do not assume public domain. Store metadata and links when license unclear.

## Attribution requirements
Attribution to Internet Archive plus item creator/publisher when present.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial/AI use conditional on item license/terms; restricted or unknown media is not copied.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://archive.org/advancedsearch.php?q=title%3A%28Riverside%20Theater%29&fl%5B%5D=identifier&fl%5B%5D=title&rows=1&page=1&output=json`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/internetArchive.ts`

## Last verified date
2026-08-24
