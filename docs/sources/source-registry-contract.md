# Historical source provider registry contract

Last verified: 2026-08-24

ItsPast stores source metadata in a canonical `historical_source_providers` shape. The registry is the source of truth for whether a provider can be used automatically in **FREE RESEARCH MODE**.

## Core rule

Only providers classified as `NO_KEY_REQUIRED`, enabled, and not requiring authentication may run automatically in the core research engine.

Optional providers may exist in the registry, but they stay disabled until explicitly enabled later. The public app must never expose keys, provider controls, rate-limit debugging, or source test results.

## Required fields

- `id`
- `name`
- `description`
- `website`
- `api_url`
- `api_key_required`
- `authentication_required`
- `automated_access_allowed`
- `bulk_download_available`
- `license`
- `commercial_use`
- `attribution_required`
- `rate_limit`
- `robots_policy`
- `terms_url`
- `documentation_url`
- `source_type`
- `geographic_coverage`
- `historical_coverage`
- `media_available`
- `text_available`
- `maps_available`
- `enabled`
- `status`
- `access_classification`
- `quality_score`
- `last_tested`

## Access classifications

- `NO_KEY_REQUIRED` — eligible for core mode if enabled and terms permit automated access.
- `OPTIONAL_KEY` — can run without a key but may support enhanced access later.
- `KEY_REQUIRED` — excluded from core mode.
- `LOGIN_REQUIRED` — excluded from core mode.
- `RESTRICTED` — excluded from automatic access.
- `UNKNOWN` — excluded until reviewed.

## Quality score

Every source is scored 0–100 across:

- authority
- historical depth
- metadata quality
- geographic coverage
- media availability
- structured data
- searchability
- licensing clarity
- automated access
- reliability

Scores rank source priority. Scores do **not** override license or access restrictions.

## Provenance mandate

Every source record must preserve:

- source provider
- source ID
- source URL
- retrieved timestamp
- license
- creator
- publication date
- evidence type
- confidence

AI may not skip the source-record → entity-match → claim → evidence → cross-check → confidence → timeline pipeline.

## Media and AI processing

Historical media must be classified as:

- `PUBLIC_DOMAIN`
- `CC0`
- `CC_BY`
- `CC_BY_SA`
- `OTHER_OPEN_LICENSE`
- `RESTRICTED`
- `UNKNOWN`

If license or AI-processing permission is uncertain, ItsPast stores metadata and source links only. It must not copy media into storage or send media to image-generation systems until the intended use is permitted.

## CI behavior

Provider tests use mocks and fixtures. Live external checks are opt-in only with `RESEARCH_LIVE_TESTS=true` and must stay conservative.