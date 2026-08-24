# National Archives Catalog

## What it provides
High-value federal records, excluded from core no-key mode because the current developer API path is key-based/optional.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
KEY REQUIRED / optional future enhancement. Not used by FREE RESEARCH MODE.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Mixed federal/public-domain and rights-specific records.

## Attribution requirements
Attribution required/recommended.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Excluded from automatic core until optional credential mode exists.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://www.archives.gov/developer`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/nationalArchivesProvider.ts`

## Last verified date
2026-08-24
