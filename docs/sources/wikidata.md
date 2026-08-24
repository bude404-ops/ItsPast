# Wikidata

## What it provides
Open knowledge graph for entities, coordinates, dates, relationships, alternate names and identifiers.

## How ItsPast accesses it
Official documented public API endpoint only. No random website scraping, no CAPTCHA bypass, no paywall bypass, no authentication bypass.

## API key required
No API key. No login. SPARQL endpoint verified. Must obey query service usage policy.

## Rate limits
ItsPast applies conservative cache, timeout, retry, exponential backoff and provider-specific throttling. OpenStreetMap/Nominatim is capped at 1 request/second and should not be used for bulk geocoding on the public service.

## License
Wikidata data is CC0, but service usage limits still apply.

## Attribution requirements
Attribution is requested by Wikimedia norms even where CC0 applies.

## Allowed uses
Metadata storage is allowed for implemented no-key sources unless an item-level statement says otherwise. Media copying/display depends on item-level license class.

## Restrictions
Commercial use friendly; AI processing of structured facts is allowed, but do not treat statements as definitive without corroboration.

If permission is unclear, mark `NEEDS LEGAL/TERMS REVIEW` and store metadata/source link only.

## Example query
`https://query.wikidata.org/sparql?format=json&query=SELECT%20%3Fitem%20WHERE%20%7B%20%3Fitem%20wdt%3AP625%20%3Fcoord%20%7D%20LIMIT%201`

## Example response
CI uses fixtures in `tests/fixtures/research/` and does not depend on live external services.

## Implementation file
`src/services/research/providers/wikidata.ts`

## Last verified date
2026-08-24
