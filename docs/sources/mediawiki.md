# Wikipedia / MediaWiki

## What it provides
Discovery/context source for names, dates, references, alternate names and candidate entities.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key. No login. Use MediaWiki API.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Wikipedia text is CC BY-SA; references and external linked sources have separate rights.

## Attribution requirements
Attribution required under CC BY-SA if text is reused. ItsPast uses snippets only for discovery/context.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial use conditional on CC BY-SA compliance. Wikipedia alone is not definitive historical evidence.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=Riverside%20Theater&format=json&srlimit=1`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/mediaWiki.ts`

## Last verified date
2026-08-24
