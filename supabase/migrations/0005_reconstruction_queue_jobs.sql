create table if not exists reconstruction_jobs (
  id uuid primary key default gen_random_uuid(),
  reconstruction_id uuid not null references reconstructions(id) on delete cascade,
  entity_id uuid not null references physical_entities(id) on delete cascade,
  status text not null default 'QUEUED' check (status in ('QUEUED','RUNNING','COMPLETED','FAILED','BLOCKED')),
  evidence_score integer not null default 0 check (evidence_score between 0 and 100),
  prompt_snapshot text not null,
  output_url text,
  warning text not null default 'AI GENERATED — historically informed visualization, not an authentic photograph.',
  blocked_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table reconstruction_jobs enable row level security;
create policy "public can read completed or blocked reconstruction jobs" on reconstruction_jobs for select using (
  status in ('COMPLETED','BLOCKED') and exists (select 1 from physical_entities pe where pe.id = entity_id and pe.is_public)
);
create policy "admins read all reconstruction jobs" on reconstruction_jobs for select using (public.current_user_is_admin());
create policy "admins insert reconstruction jobs" on reconstruction_jobs for insert with check (public.current_user_is_admin());
create policy "admins update reconstruction jobs" on reconstruction_jobs for update using (public.current_user_is_admin()) with check (public.current_user_is_admin());
create index reconstruction_jobs_entity_idx on reconstruction_jobs(entity_id);
create index reconstruction_jobs_status_idx on reconstruction_jobs(status);
