-- Replace entity_id with the physical_entities.id for the vetted record before applying.
do $$
declare
  entity_id uuid := '00000000-0000-0000-0000-000000000000';
  src_notice uuid;
  src_map uuid;
  event_opened uuid;
  recon_id uuid;
begin
  insert into historical_sources (source_type, title, publisher, publication_date, url, description, confidence, is_public)
  values ('NEWSPAPER', 'Waterworks Opening Notice', 'City Gazette', '1898-06-04', 'https://example.org/archive/waterworks', 'Public notice describing the opening of the waterworks facility.', 'HIGH', true)
  returning id into src_notice;

  insert into historical_sources (source_type, title, publisher, publication_date, archive_reference, description, confidence, is_public)
  values ('MAP', '1902 Sanborn Sheet', 'Sanborn Map Company', '1902', 'Sheet 14', 'Fire insurance map showing the parcel footprint.', 'CONFIRMED', true)
  returning id into src_map;

  insert into entity_sources (entity_id, source_id, relationship_type) values (entity_id, src_notice, 'evidence'), (entity_id, src_map, 'evidence') on conflict do nothing;

  insert into historical_events (entity_id, date, date_precision, title, description, event_type, confidence)
  values (entity_id, '1898', 'YEAR', 'Waterworks opened', 'The municipal facility began operation according to a public notice.', 'opened', 'HIGH')
  returning id into event_opened;
  insert into event_sources (event_id, source_id, relationship_type) values (event_opened, src_notice, 'supports') on conflict do nothing;

  insert into reconstructions (entity_id, target_year, status, prompt, confidence)
  values (entity_id, '1902', 'READY', 'Reconstruct the waterworks exterior using only source-backed details.', 'HIGH')
  returning id into recon_id;
  insert into reconstruction_evidence (reconstruction_id, source_id, label, description) values
    (recon_id, src_map, 'DOCUMENTED', 'Parcel footprint documented by the Sanborn sheet.'),
    (recon_id, src_notice, 'STRONGLY_INFERRED', 'Operational context inferred from opening notice and map placement.');
end $$;
