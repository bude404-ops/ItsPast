# Wikimedia Commons

## What it provides
Historical images, maps, media and per-file license metadata via MediaWiki API.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key. No login for public API. Use API, not page scraping.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Per-file license. CC0/public domain/CC BY/CC BY-SA/open licenses handled individually; restricted/unknown files are metadata/link only.

## Attribution requirements
Attribution from extmetadata artist/credit/license is mandatory when required by file license.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial use depends on per-file license. AI processing is automatic only for public-domain/CC0; other open licenses are UNKNOWN until reviewed.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=historic%20building&gsrlimit=1&prop=imageinfo&iiprop=url|extmetadata&format=json`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/wikimediaCommons.ts`

## Last verified date
2026-08-24
