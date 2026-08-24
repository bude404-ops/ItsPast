alter table historical_source_providers
  add column if not exists description text,
  add column if not exists website text,
  add column if not exists api_key_required boolean not null default false,
  add column if not exists authentication_required boolean not null default false,
  add column if not exists automated_access_allowed text not null default 'UNKNOWN',
  add column if not exists bulk_download_available text not null default 'UNKNOWN',
  add column if not exists license text,
  add column if not exists commercial_use text not null default 'NEEDS LEGAL/TERMS REVIEW',
  add column if not exists robots_policy text,
  add column if not exists documentation_url text,
  add column if not exists source_type text,
  add column if not exists geographic_coverage text,
  add column if not exists historical_coverage text,
  add column if not exists media_available boolean not null default false,
  add column if not exists text_available boolean not null default true,
  add column if not exists maps_available boolean not null default false,
  add column if not exists access_classification text not null default 'UNKNOWN',
  add column if not exists status text not null default 'NEEDS_LEGAL_TERMS_REVIEW',
  add column if not exists quality_score jsonb not null default '{}'::jsonb,
  add column if not exists last_tested date;

create table if not exists source_health_checks (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references historical_source_providers(id) on delete cascade,
  status text not null check (status in ('ONLINE','DEGRADED','RATE_LIMITED','OFFLINE','CHANGED','DISABLED')),
  response_time_ms integer,
  checked_at timestamptz not null default now(),
  errors jsonb not null default '[]'::jsonb,
  api_key_required boolean not null default false
);

alter table source_records
  add column if not exists license_class text not null default 'UNKNOWN',
  add column if not exists attribution text,
  add column if not exists provenance jsonb not null default '{}'::jsonb,
  add column if not exists can_store_metadata boolean not null default true,
  add column if not exists can_store_media text not null default 'UNKNOWN',
  add column if not exists can_use_for_ai_processing text not null default 'UNKNOWN';

alter table source_health_checks enable row level security;
create policy "admins manage source health checks" on source_health_checks for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create index if not exists source_health_provider_idx on source_health_checks(provider_id, checked_at desc);

insert into historical_source_providers (id, name, provider_type, base_url, api_endpoint, requires_api_key, api_key_required, authentication_required, enabled, rate_limit, terms_url, attribution_required, description, website, automated_access_allowed, bulk_download_available, license, commercial_use, robots_policy, documentation_url, source_type, geographic_coverage, historical_coverage, media_available, text_available, maps_available, access_classification, status, quality_score, last_tested) values
  ('loc','Library of Congress','LIBRARY_OF_CONGRESS','https://www.loc.gov','https://www.loc.gov/search/',false,false,false,true,'No hard public limit published for JSON API; ItsPast caches and throttles conservatively.','https://www.loc.gov/legal/',true,'Federal library collections: photos, maps, books, manuscripts, newspapers, digitized collections and metadata.','https://www.loc.gov','true','true','Mixed: public domain and rights-specific item statements.','CONDITIONAL','Respect loc.gov robots and API guidance.','https://www.loc.gov/apis/','federal archive','United States and international','Broad LOC historical coverage',true,true,true,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":94,"priority":"HIGH PRIORITY"}'::jsonb,'2026-08-24'),
  ('chronam','Chronicling America via Library of Congress','CHRONICLING_AMERICA','https://www.loc.gov/collections/chronicling-america/','https://www.loc.gov/collections/chronicling-america/',false,false,false,true,'Conservative cache/throttle; legacy host returned 404 during verification, so use LOC JSON collection endpoint.','https://www.loc.gov/legal/',true,'Historical newspaper metadata and pages discoverable through LOC Chronicling America collection.','https://www.loc.gov/collections/chronicling-america/','true','NOT_CONFIRMED','Mixed newspaper rights; metadata/snippets only until reviewed.','NEEDS LEGAL/TERMS REVIEW','Respect LOC robots/API guidance.','https://www.loc.gov/apis/json-and-yaml/','newspaper archive','United States','Historic U.S. newspapers',true,true,false,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":81,"priority":"MEDIUM PRIORITY"}'::jsonb,'2026-08-24'),
  ('wikidata','Wikidata','WIKIDATA','https://www.wikidata.org','https://query.wikidata.org/sparql',false,false,false,true,'Follow Wikidata Query Service usage policy; cache and keep queries narrow.','https://www.wikidata.org/wiki/Wikidata:Data_access',true,'Open knowledge graph for entities, coordinates, dates, relationships, alternate names and identifiers.','https://www.wikidata.org','true','true','CC0 data; attribution requested by norms.','YES','Use documented SPARQL endpoint politely.','https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/Wikidata_Query_Help','open knowledge graph','Global','Entity-dependent',false,true,false,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":84,"priority":"MEDIUM PRIORITY"}'::jsonb,'2026-08-24'),
  ('commons','Wikimedia Commons','WIKIMEDIA_COMMONS','https://commons.wikimedia.org','https://commons.wikimedia.org/w/api.php',false,false,false,true,'Follow Wikimedia API etiquette; cache extmetadata.','https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use',true,'Open media repository with per-file license metadata.','https://commons.wikimedia.org','true','true','Per-file license; never assume a shared license.','CONDITIONAL','Use MediaWiki API; no file-page scraping.','https://www.mediawiki.org/wiki/API:Main_page','open media collection','Global','Item-dependent',true,true,true,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":87,"priority":"HIGH PRIORITY"}'::jsonb,'2026-08-24'),
  ('mediawiki','Wikipedia / MediaWiki','MEDIAWIKI','https://en.wikipedia.org','https://en.wikipedia.org/w/api.php',false,false,false,true,'Follow Wikimedia API etiquette; context/discovery only.','https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use',true,'Discovery source for names, dates, references and candidate entities.','https://www.wikipedia.org','true','true','CC BY-SA text; references have separate rights.','CONDITIONAL','Use MediaWiki API; no page scraping.','https://www.mediawiki.org/wiki/API:Search','open encyclopedia/discovery index','Global','Entity-dependent',false,true,false,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":78,"priority":"MEDIUM PRIORITY"}'::jsonb,'2026-08-24'),
  ('osm','OpenStreetMap / Nominatim','OPENSTREETMAP','https://www.openstreetmap.org','https://nominatim.openstreetmap.org/search',false,false,false,true,'Nominatim public service: max 1 request/sec, single thread, cache results, identifying User-Agent.','https://operations.osmfoundation.org/policies/nominatim/',true,'Current buildings, roads, addresses, coordinates, landmarks and historic tags where available.','https://www.openstreetmap.org','true','true','ODbL 1.0.','CONDITIONAL','Do not bulk geocode on public service.','https://nominatim.org/release-docs/latest/api/Search/','open GIS/current geography','Global','Current data with some historic tags',false,true,true,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":73,"priority":"MEDIUM PRIORITY"}'::jsonb,'2026-08-24'),
  ('internet_archive','Internet Archive','INTERNET_ARCHIVE','https://archive.org','https://archive.org/advancedsearch.php',false,false,false,true,'Use advancedsearch API conservatively; cache results; item downloads depend on item rights and files.','https://archive.org/about/terms.php',true,'Scanned books, directories, documents, photos, maps, old publications and archived web material.','https://archive.org','true','NOT_CONFIRMED','Mixed per item; do not assume public domain.','CONDITIONAL','Use documented APIs; do not mirror or scrape restricted items.','https://archive.org/developers/advancedsearch.html','digital archive','Global','Broad, item-dependent',true,true,true,'NO_KEY_REQUIRED','IMPLEMENTED','{"overall":83,"priority":"MEDIUM PRIORITY"}'::jsonb,'2026-08-24'),
  ('nara','National Archives Catalog','NATIONAL_ARCHIVES','https://catalog.archives.gov','https://catalog.archives.gov/api/v2/records/search',true,true,false,false,'Excluded from core no-key mode because current Catalog API use is documented with API key access.','https://www.archives.gov/developer',true,'High-value federal records; optional future provider only.','https://catalog.archives.gov','true','NOT_CONFIRMED','Mixed federal/public-domain and rights-specific records.','CONDITIONAL','Use documented developer program.','https://www.archives.gov/developer','federal archive','United States','Federal records',true,true,true,'KEY_REQUIRED','FOUND_NOT_IMPLEMENTED','{"overall":82,"priority":"EXCLUDED"}'::jsonb,'2026-08-24')
on conflict (id) do update set
  api_endpoint = excluded.api_endpoint,
  requires_api_key = excluded.requires_api_key,
  api_key_required = excluded.api_key_required,
  authentication_required = excluded.authentication_required,
  enabled = excluded.enabled,
  rate_limit = excluded.rate_limit,
  terms_url = excluded.terms_url,
  attribution_required = excluded.attribution_required,
  description = excluded.description,
  website = excluded.website,
  automated_access_allowed = excluded.automated_access_allowed,
  bulk_download_available = excluded.bulk_download_available,
  license = excluded.license,
  commercial_use = excluded.commercial_use,
  robots_policy = excluded.robots_policy,
  documentation_url = excluded.documentation_url,
  source_type = excluded.source_type,
  geographic_coverage = excluded.geographic_coverage,
  historical_coverage = excluded.historical_coverage,
  media_available = excluded.media_available,
  text_available = excluded.text_available,
  maps_available = excluded.maps_available,
  access_classification = excluded.access_classification,
  status = excluded.status,
  quality_score = excluded.quality_score,
  last_tested = excluded.last_tested;
