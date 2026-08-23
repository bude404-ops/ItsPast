create table if not exists event_sources (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references historical_events(id) on delete cascade,
  source_id uuid not null references historical_sources(id) on delete cascade,
  relationship_type text not null default 'supports',
  created_at timestamptz not null default now(),
  unique(event_id, source_id, relationship_type)
);

alter table event_sources enable row level security;
create policy "event source links readable for public entities" on event_sources for select using (
  exists (
    select 1 from historical_events he
    join physical_entities pe on pe.id = he.entity_id
    where he.id = event_id and pe.is_public
  )
);
create policy "admins insert event source links" on event_sources for insert with check (public.current_user_is_admin());
create policy "admins update event source links" on event_sources for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create index event_sources_event_idx on event_sources(event_id);
create index event_sources_source_idx on event_sources(source_id);

create policy "admins insert reconstructions" on reconstructions for insert with check (public.current_user_is_admin());
create policy "admins update reconstructions" on reconstructions for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create policy "admins insert reconstruction evidence" on reconstruction_evidence for insert with check (public.current_user_is_admin());
create policy "admins update reconstruction evidence" on reconstruction_evidence for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
