# ItsPast Free Historical Source Discovery Report

## Mission result
Core historical research now runs in **FREE RESEARCH MODE** with **zero required paid APIs** and **zero required API keys**.

## Free sources found
- Library of Congress
- Chronicling America via Library of Congress JSON collection endpoint
- Wikidata
- Wikimedia Commons
- Wikipedia / MediaWiki
- OpenStreetMap / Nominatim
- Internet Archive

## No-key sources implemented
- `loc` — Library of Congress
- `chronam` — Chronicling America via LOC
- `wikidata` — Wikidata SPARQL
- `commons` — Wikimedia Commons MediaWiki API
- `mediawiki` — Wikipedia MediaWiki API
- `osm` — OpenStreetMap/Nominatim
- `internet_archive` — Internet Archive Advanced Search

## Sources not implemented / excluded
- National Archives Catalog: high-value source, but excluded from core because the current developer/API path is documented as API-key-based. Status: `KEY_REQUIRED`, optional future enhancement only.
- State/city/university/museum/historical society collections: found as a class of future sources, not individually enabled until each has official API/download access and clear terms. Status for each future candidate should remain `SOURCE FOUND / AUTOMATED ACCESS: NOT CONFIRMED` until reviewed.

## License requirements
- Per-record license/provenance is mandatory.
- Public-domain/CC0 media can be copied and can be sent to AI processing by default.
- CC BY/CC BY-SA/other open licenses may be displayable but AI processing remains `UNKNOWN` until use-case review.
- Restricted/unknown media is metadata/link only.

## Attribution requirements
- LOC/Chronicling America: cite LOC and item creator/publisher where present.
- Wikimedia: preserve per-file attribution and license metadata.
- Wikipedia: CC BY-SA if text is reused; ItsPast uses it as discovery/context only.
- OSM: `© OpenStreetMap contributors`, ODbL 1.0.
- Internet Archive: cite item creator/publisher and Internet Archive where present.

## Rate limits
- All providers use caching, timeout, retry, exponential backoff and circuit breaker support.
- OSM/Nominatim is throttled with the strictest public-service policy: 1 request/sec, single thread, cache.
- CI uses mocks/fixtures only and never calls live services.

## Source quality scores
See `src/services/research/registry/sourceRegistry.ts` for full component scores. Highest initial priorities:
- Library of Congress — HIGH PRIORITY
- Wikimedia Commons — HIGH PRIORITY
- Wikidata — MEDIUM PRIORITY
- Internet Archive — MEDIUM PRIORITY
- Chronicling America via LOC — MEDIUM PRIORITY
- OpenStreetMap/Nominatim — MEDIUM PRIORITY
- MediaWiki/Wikipedia — MEDIUM PRIORITY for discovery only

## Files created
- Provider modules under `src/services/research/providers/`
- Registry/runtime/orchestrator/health modules under `src/services/research/`
- Migration `0008_free_historical_source_registry.sql`
- Tests and fixtures under `tests/unit/` and `tests/fixtures/research/`
- Source docs under `docs/sources/`

## Database changes
- Expanded `historical_source_providers` with legal/access/quality fields.
- Added `source_health_checks` for internal Source Test Lab.
- Expanded `source_records` with license class, attribution, provenance, media storage and AI-processing flags.

## 12 pilot locations researched by fixture evaluator
- Riverside Theater — building
- Pennsylvania Station — lost landmark
- Eads Bridge — bridge
- Pullman Historic District — neighborhood
- Fox Theatre — building
- Route 66 gas station — historic business
- Brooklyn Bridge — bridge
- Union Station Los Angeles — landmark
- Detroit Central Library — building
- Market Street Railway — infrastructure
- Cast Iron District / SoHo — neighborhood
- Old Post Office Washington DC — building

## Reconstruction eligibility rule
A reconstruction package is only eligible after evidence exists and the output must be labeled **AI HISTORICAL RECONSTRUCTION**, never historical photograph. Unknown features remain unknown; unsupported architectural details are not invented.

## Recommended next sources
Review, one by one, only if official APIs/downloads and terms are clear:
- Digital Public Library of America
- Harvard Library APIs
- New York Public Library Digital Collections API
- Smithsonian Open Access
- USGS historical topographic maps
- state historic preservation office GIS datasets
- city open-data historic landmarks datasets

## API keys still optional
Yes. The implemented core does not require API keys. API-key sources may be added later as optional enhancement providers, but they are not part of no-key automatic research.
