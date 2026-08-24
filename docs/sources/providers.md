# Source Providers

Initial providers:

1. Library of Congress — public API, attribution required.
2. National Archives Catalog — requires `VITE_NARA_API_KEY`; do not commit real keys. Display NARA attribution when NARA content is used.
3. Wikidata/Wikimedia — structured relationships and licensed media; preserve license/attribution.
4. OpenStreetMap — place/geographic context; respect OSM/Nominatim usage policy.

## Copyright rule

Never assume an online image is public domain. Store license, copyright status, creator, provider, URL, and attribution requirement. If reuse rights are unclear, store metadata and source link only.

## Adding a provider

Create a file in `src/services/research/providers/`, implement `SourceProvider`, export it from the registry, add provider metadata to the migration seed, and write mocked unit tests. Do not make live API calls in CI.
