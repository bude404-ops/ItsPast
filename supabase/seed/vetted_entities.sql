insert into physical_entities (name, description, latitude, longitude, address, created_date, current_status, confidence_level, is_public)
values
('Old City Waterworks', 'Seed example for a verified municipal infrastructure record awaiting source-linked events.', 40.7128, -74.0060, 'Example civic parcel', '1898', 'changed', 'MEDIUM', true),
('Harbor Freight Depot', 'Seed example for a public industrial site record prepared for archival source linking.', 40.7041, -74.0122, 'Example harbor district', '1911', 'renovated', 'HIGH', true)
on conflict do nothing;
