-- Shared entity type seed used by real public records.
insert into entity_types (slug, label, description) values
('building','Building','Physical buildings and structures'),('business','Business','Businesses tied to a place'),('bridge','Bridge','Bridge infrastructure'),('infrastructure','Infrastructure','Rail, road, utility, or civil works')
on conflict (slug) do nothing;
