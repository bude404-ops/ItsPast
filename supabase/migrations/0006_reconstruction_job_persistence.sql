alter table reconstruction_jobs alter column reconstruction_id drop not null;

create unique index if not exists reconstruction_jobs_reconstruction_unique_idx
  on reconstruction_jobs(reconstruction_id)
  where reconstruction_id is not null;

create index if not exists reconstruction_jobs_updated_idx on reconstruction_jobs(updated_at desc);

comment on table reconstruction_jobs is 'Persistent AI reconstruction lifecycle queue. Client dashboard reads these rows first, then falls back to derived evidence-gate state when no job has been persisted yet.';
comment on column reconstruction_jobs.prompt_snapshot is 'Frozen generation prompt used for the queued job; preserves the evidence trail at queue time.';
comment on column reconstruction_jobs.output_url is 'Completed output artifact URL. Must remain null until the job reaches COMPLETED.';
