# ItsPast Free Historical Source Discovery Report

Last verified: 2026-08-24

## Mission result

ItsPast now has a free-source-first historical research engine foundation that requires **zero paid APIs** and **zero required API keys** for core mode.

API-key providers may be added later, but the core engine only auto-runs enabled `NO_KEY_REQUIRED` sources.

## Free sources found

### Primary no-key sources

- Library of Congress
- Chronicling America via Library of Congress JSON collection path
- Wikidata
- Wikimedia Commons
- Wikipedia / MediaWiki
- OpenStreetMap / Nominatim
- Internet Archive

### Additional candidates discovered

- National Archives Catalog API Review — high value, automated access/licensing still needs review before enabling.
- Smithsonian Open Access — no-key Open Access/bulk candidate, not implemented yet.
- USGS Historical Topographic Map Collection — no-key historic map candidate, not implemented yet.
- GeoNames bulk gazetteer — no-key dump candidate for place-name enrichment, not implemented yet.
- HathiTrust Bibliographic API — no-key bibliographic candidate, content rights need review.
- DPLA — valuable but key-required, optional only.
- Europeana — valuable but key-required, optional only.
- NYPL Digital Collections — valuable but token-required, optional only.

## No-key sources implemented

- `loc` — Library of Congress
- `chronam` — Chronicling America through the LOC collection JSON path
- `wikidata` — Wikidata SPARQL
- `commons` — Wikimedia Commons MediaWiki API
- `mediawiki` — Wikipedia MediaWiki API
- `osm` — OpenStreetMap/Nominatim
- `internet_archive` — Internet Archive Advanced Search

## Sources not implemented / excluded

- `nara` — previous National Archives optional provider remains disabled because the earlier path was treated as key-required.
- `nara_catalog` — added as a separate review candidate; disabled until current official API terms, automated access, rate limits, and item-level rights are reviewed.
- `smithsonian_open_access` — not implemented yet; promising no-key candidate, CC0 only for Open Access subset.
- `usgs_historical_topo` — not implemented yet; promising no-key historic map layer.
- `geonames_dumps` — not implemented yet; useful no-key bulk gazetteer, attribution required.
- `hathitrust_bib` — not implemented yet; useful bibliographic lead source, full-text rights vary.
- `dpla` — excluded from core because an API key is required.
- `europeana` — excluded from core because an API key is required.
- `nypl_digital` — excluded from core because an API token is required.

Any source with unclear automated access is marked `UNKNOWN`, `FOUND_NOT_IMPLEMENTED`, or `NEEDS LEGAL/TERMS REVIEW`; it is not auto-used.

## License requirements

- Per-record license/provenance is mandatory.
- Public-domain and CC0 media are the safest candidates for storage and reconstruction workflows.
- CC BY, CC BY-SA, and other open licenses require attribution and may impose reuse/share-alike obligations.
- Mixed-rights archives require item-level review.
- Restricted or unknown media is metadata/link only.
- AI processing remains `UNKNOWN` unless the license/terms clearly permit the intended use.

## Attribution requirements

- Library of Congress / Chronicling America: cite LOC and item creator/publisher where present.
- Wikidata: CC0 data, but keep provider/source attribution for provenance.
- Wikimedia Commons: preserve per-file creator, license, attribution, and URL.
- Wikipedia / MediaWiki: do not use as definitive evidence; if text is reused, respect CC BY-SA.
- OpenStreetMap: include `© OpenStreetMap contributors`; comply with ODbL.
- Internet Archive: cite item creator/publisher and Internet Archive where present.
- GeoNames future provider: CC BY 4.0 attribution required.
- Smithsonian future provider: CC0 only for Open Access subset.

## Rate limits

- All providers use conservative caching, timeout, retry, exponential backoff, and circuit-breaker support.
- OSM/Nominatim uses the strictest public-service posture: one request per second, single thread, cache results, identifying User-Agent.
- Public CI never depends on live services.
- Live source health checks are opt-in only through `RESEARCH_LIVE_TESTS=true`.

## Source quality scores

Highest current priorities:

- Library of Congress — HIGH PRIORITY
- Wikimedia Commons — HIGH PRIORITY
- Internet Archive — MEDIUM/HIGH value but mixed rights
- Wikidata — MEDIUM/HIGH structured authority
- Chronicling America via LOC — MEDIUM/HIGH, rights/snippet caution
- OpenStreetMap/Nominatim — MEDIUM, essential current geography but not deep history
- Wikipedia / MediaWiki — discovery/context only

Promising next additions:

- Smithsonian Open Access
- USGS Historical Topographic Map Collection
- GeoNames bulk gazetteer
- HathiTrust Bibliographic API

## Files created or changed

- Source registry schema and database-row export
- Registry validation tests
- Source health snapshot utility
- Additional source candidate documentation
- Source registry contract documentation
- Free source discovery report refresh
- Registry entries for additional candidates and optional/excluded sources

## Database changes

The code now exports a database-ready `historical_source_providers` row shape with all required fields:

- access classification
- key/auth requirements
- automated access status
- bulk availability
- licensing/commercial-use posture
- attribution requirements
- rate limits
- source coverage
- media/text/map availability
- implementation status
- quality score
- last tested date

No paid provider or API-key provider is enabled for core mode.

## 12 pilot locations researched by fixture evaluator

- Riverside Theater — historic building/business
- Pennsylvania Station — lost landmark
- Eads Bridge — bridge
- Pullman Historic District — neighborhood
- Fox Theatre — historic building
- Route 66 gas station — historic business
- Brooklyn Bridge — bridge
- Union Station Los Angeles — landmark
- Detroit Central Library — building
- Market Street Railway — infrastructure
- Cast Iron District / SoHo — neighborhood
- Old Post Office Washington DC — building

## Reconstruction eligibility results

The fixture evaluator covers 12 pilot location types and requires source-backed claims/evidence before a location can be marked eligible.

Generated outputs must be labeled:

**AI HISTORICAL RECONSTRUCTION**

Never:

**historical photograph**

## Recommended next sources

1. Smithsonian Open Access
2. USGS Historical Topographic Map Collection
3. GeoNames bulk dumps
4. HathiTrust Bibliographic API
5. National Archives Catalog after terms/API review
6. DPLA / Europeana / NYPL only as optional key-based enhancements

## API keys still optional

Yes. Core ItsPast historical research remains no-key. Optional API-key sources can be added later, but they are excluded from automatic free research mode by default.