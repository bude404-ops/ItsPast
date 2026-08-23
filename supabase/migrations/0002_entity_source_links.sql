create table if not exists entity_sources (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references physical_entities(id) on delete cascade,
  source_id uuid not null references historical_sources(id) on delete cascade,
  relationship_type text not null default 'evidence',
  created_at timestamptz not null default now(),
  unique(entity_id, source_id, relationship_type)
);

alter table entity_sources enable row level security;
create policy "entity source links are readable for public entities" on entity_sources for select using (
  exists (select 1 from physical_entities pe where pe.id = entity_id and pe.is_public)
);
create index entity_sources_entity_idx on entity_sources(entity_id);
create index entity_sources_source_idx on entity_sources(source_id);
