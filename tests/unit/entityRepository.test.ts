import { describe, expect, it } from 'vitest';
import { mapPhysicalEntityRow, demoEntityRepository } from '../../src/services/entities/entityRepository';

describe('entity repository mapping', () => {
  it('maps public Supabase rows into app physical entities', () => {
    const entity = mapPhysicalEntityRow({
      id: 'record-1',
      name: 'Archive Warehouse',
      description: 'A verified industrial site.',
      entity_types: { slug: 'building' },
      latitude: 40.7,
      longitude: -73.9,
      address: '10 Archive Lane',
      created_date: '1912',
      destroyed_date: null,
      current_status: 'renovated',
      confidence_level: 'HIGH',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z'
    });
    expect(entity.demoData).toBe(false);
    expect(entity.entityType).toBe('building');
    expect(entity.location.address).toBe('10 Archive Lane');
    expect(entity.dataQuality).toBe(86);
  });

  it('keeps demo fallback searchable while Supabase is not configured', async () => {
    const results = await demoEntityRepository.search('theater');
    expect(results.some((entity) => entity.id === 'riverside-theater')).toBe(true);
  });
});
