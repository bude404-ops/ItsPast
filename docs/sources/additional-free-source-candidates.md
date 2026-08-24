# Additional free historical source candidates

Last verified: 2026-08-24

These sources were discovered for the ItsPast free historical source network. They are **not enabled for automatic public research** until a provider is implemented, mocked tests exist, and current terms are reviewed.

## Candidate summary

| Source | Access classification | Key/auth | Automated access | Bulk | License/commercial posture | Status |
| --- | --- | --- | --- | --- | --- | --- |
| National Archives Catalog API Review | UNKNOWN | No key indicated for public API paths, but verify current terms | NOT CONFIRMED | NOT CONFIRMED | Mixed federal and restricted records; NEEDS LEGAL/TERMS REVIEW | Found, not implemented |
| Smithsonian Open Access | NO_KEY_REQUIRED | No key for open-access/bulk paths | Confirmed for official open access data | Yes | CC0 only for Open Access subset; other records vary | Found, not implemented |
| USGS Historical Topographic Map Collection | NO_KEY_REQUIRED | No key for many official map/download paths | Confirmed for official services/downloads | Yes | Generally U.S. government public domain, verify product metadata | Found, not implemented |
| GeoNames Bulk Gazetteer | NO_KEY_REQUIRED | Bulk dumps no key; web services need username | Confirmed for dumps | Yes | CC BY 4.0, attribution required | Found, not implemented |
| HathiTrust Bibliographic API | NO_KEY_REQUIRED | Bibliographic API has no-key paths | Confirmed for documented bibliographic APIs | NOT CONFIRMED | Bibliographic metadata and full-text rights differ; NEEDS LEGAL/TERMS REVIEW | Found, not implemented |
| DPLA | KEY_REQUIRED | Free API key required | Confirmed via API after key | NOT CONFIRMED | Mixed contributor rights | Excluded from core no-key mode |
| Europeana | KEY_REQUIRED | Free API key required | Confirmed via API after key | NOT CONFIRMED | Metadata often CC0; digital objects vary | Excluded from core no-key mode |
| NYPL Digital Collections API | KEY_REQUIRED | Free token required | Confirmed via API after token | NOT CONFIRMED | Public-domain subset usable; item rights vary | Excluded from core no-key mode |

## Implementation priority

1. **Smithsonian Open Access** — high quality, clear CC0 subset, strong media value.
2. **USGS Historical Topographic Map Collection** — critical historic map layer for reconstruction.
3. **GeoNames bulk dumps** — useful place-name and alternate-name enrichment.
4. **HathiTrust Bibliographic API** — useful for directories, books, and bibliographic leads; content rights need care.
5. **National Archives Catalog** — high authority, but current automated access and rights behavior must be validated before enabling.
6. **DPLA / Europeana / NYPL** — valuable optional providers, but not core because keys are required.

## Rules for future onboarding

A candidate can move to implemented only when:

- official API/bulk access is documented,
- no login/API key is required for core mode,
- automated access is allowed or explicitly documented,
- rate limits and attribution requirements are recorded,
- item-level rights and AI-processing caveats are represented,
- mocked fixtures and provider tests are added,
- public UI does not expose provider internals.

If a permission is unclear, the source remains marked **NEEDS LEGAL/TERMS REVIEW** or **UNKNOWN**.