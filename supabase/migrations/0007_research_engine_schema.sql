create table if not exists historical_source_providers (
  id text primary key,
  name text not null,
  provider_type text not null,
  base_url text not null,
  api_endpoint text not null,
  requires_api_key boolean not null default false,
  enabled boolean not null default true,
  rate_limit text not null,
  terms_url text not null,
  attribution_required boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists source_records (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references historical_source_providers(id),
  external_id text not null,
  title text not null,
  description text,
  date text,
  location text,
  latitude numeric,
  longitude numeric,
  author text,
  publisher text,
  source_url text,
  media_url text,
  license text,
  copyright_status text not null default 'UNKNOWN',
  raw_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider_id, external_id)
);

create table if not exists entity_addresses (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references physical_entities(id) on delete cascade,
  current_address text,
  historic_address text,
  alternate_address text,
  parcel_identifier text,
  latitude numeric,
  longitude numeric,
  neighborhood text,
  city text,
  state text,
  country text,
  source_record_id uuid references source_records(id),
  confidence text not null default 'LOW',
  created_at timestamptz not null default now()
);

create table if not exists entity_aliases (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references physical_entities(id) on delete cascade,
  alias text not null,
  source_record_id uuid references source_records(id),
  start_date text,
  end_date text,
  confidence text not null default 'LOW',
  created_at timestamptz not null default now()
);

create table if not exists historical_claims (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references physical_entities(id) on delete cascade,
  claim_type text not null check (claim_type in ('CONSTRUCTION','DEMOLITION','RENOVATION','BUSINESS_OPENED','BUSINESS_CLOSED','OWNERSHIP_CHANGE','NAME_CHANGE','USE_CHANGE','ARCHITECTURAL_CHANGE','EVENT','RELOCATION','REPLACEMENT','OTHER')),
  claim_text text not null,
  event_date text,
  date_precision text not null default 'UNKNOWN',
  confidence text not null default 'UNKNOWN',
  status text not null default 'CANDIDATE' check (status in ('CANDIDATE','CROSS_CHECKING','SUPPORTED','SOURCE_CONFLICT','REJECTED','UNKNOWN')),
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists claim_evidence (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references historical_claims(id) on delete cascade,
  source_record_id uuid not null references source_records(id) on delete cascade,
  evidence_text text not null,
  evidence_type text not null check (evidence_type in ('DIRECT','CORROBORATING','INDIRECT','CONFLICTING')),
  strength text not null check (strength in ('VERY_STRONG','STRONG','MODERATE','WEAK')),
  created_at timestamptz not null default now()
);

create table if not exists historical_media_records (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references physical_entities(id) on delete cascade,
  source_record_id uuid not null references source_records(id) on delete cascade,
  media_type text not null check (media_type in ('PHOTOGRAPH','MAP','DRAWING','DOCUMENT','OCR_TEXT')),
  thumbnail_url text,
  image_url text,
  caption text,
  creator text,
  license text,
  copyright_status text not null default 'UNKNOWN',
  attribution text,
  date text,
  location text,
  created_at timestamptz not null default now()
);

create table if not exists historical_changes (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references physical_entities(id) on delete cascade,
  change_type text not null,
  before_state text not null default 'UNKNOWN',
  after_state text not null default 'UNKNOWN',
  start_date text,
  end_date text,
  confidence text not null default 'UNKNOWN',
  evidence_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists research_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null,
  status text not null default 'QUEUED',
  entity_id uuid references physical_entities(id) on delete set null,
  location text,
  depth text not null default 'BASIC',
  budget jsonb not null default '{}'::jsonb,
  searches_performed jsonb not null default '[]'::jsonb,
  sources_found uuid[] not null default '{}',
  claims_extracted uuid[] not null default '{}',
  conflicts jsonb not null default '[]'::jsonb,
  api_usage jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists research_review_queue (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid references physical_entities(id) on delete cascade,
  research_job_id uuid references research_jobs(id) on delete set null,
  review_type text not null default 'CLAIM_REVIEW',
  status text not null default 'NEEDS_REVIEW' check (status in ('NEEDS_REVIEW','APPROVED','REJECTED','REQUEST_MORE_RESEARCH','MARK_UNCERTAIN')),
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table historical_source_providers enable row level security;
alter table source_records enable row level security;
alter table entity_addresses enable row level security;
alter table entity_aliases enable row level security;
alter table historical_claims enable row level security;
alter table claim_evidence enable row level security;
alter table historical_media_records enable row level security;
alter table historical_changes enable row level security;
alter table research_jobs enable row level security;
alter table research_review_queue enable row level security;

create policy "public read source providers" on historical_source_providers for select using (enabled);
create policy "public read source records" on source_records for select using (true);
create policy "public read entity addresses" on entity_addresses for select using (true);
create policy "public read entity aliases" on entity_aliases for select using (true);
create policy "public read supported claims" on historical_claims for select using (status in ('SUPPORTED','SOURCE_CONFLICT','UNKNOWN'));
create policy "public read claim evidence" on claim_evidence for select using (true);
create policy "public read media records" on historical_media_records for select using (true);
create policy "public read historical changes" on historical_changes for select using (true);

create policy "admins manage source providers" on historical_source_providers for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage source records" on source_records for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage entity addresses" on entity_addresses for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage entity aliases" on entity_aliases for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage historical claims" on historical_claims for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage claim evidence" on claim_evidence for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage media records" on historical_media_records for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage changes" on historical_changes for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage research jobs" on research_jobs for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins manage review queue" on research_review_queue for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

create index if not exists source_records_provider_idx on source_records(provider_id);
create index if not exists source_records_title_idx on source_records using gin(to_tsvector('english', title || ' ' || coalesce(description,'')));
create index if not exists historical_claims_entity_idx on historical_claims(entity_id);
create index if not exists claim_evidence_claim_idx on claim_evidence(claim_id);
create index if not exists research_jobs_status_idx on research_jobs(status);
create index if not exists research_review_status_idx on research_review_queue(status);

insert into historical_source_providers (id, name, provider_type, base_url, api_endpoint, requires_api_key, enabled, rate_limit, terms_url, attribution_required) values
  ('loc','Library of Congress','LIBRARY_OF_CONGRESS','https://www.loc.gov','https://www.loc.gov/search/',false,true,'Respect public API guidance; cache repeated searches.','https://www.loc.gov/legal/',true),
  ('nara','National Archives Catalog','NATIONAL_ARCHIVES','https://catalog.archives.gov','https://catalog.archives.gov/api/v2/records/search',true,true,'Requires NARA_API_KEY. Respect National Archives API limits and attribution.','https://www.archives.gov/developer',true),
  ('wikidata','Wikidata','WIKIDATA','https://www.wikidata.org','https://query.wikidata.org/sparql',false,true,'Throttle SPARQL usage and cache results.','https://www.wikidata.org/wiki/Wikidata:Data_access',true),
  ('osm','OpenStreetMap','OPENSTREETMAP','https://www.openstreetmap.org','https://nominatim.openstreetmap.org/search',false,true,'Respect OSM/Nominatim usage policy.','https://operations.osmfoundation.org/policies/nominatim/',true)
on conflict (id) do update set name = excluded.name, api_endpoint = excluded.api_endpoint, requires_api_key = excluded.requires_api_key, rate_limit = excluded.rate_limit, terms_url = excluded.terms_url, attribution_required = excluded.attribution_required;
