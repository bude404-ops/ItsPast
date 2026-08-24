import { describe, expect, it } from 'vitest';
import { draftToSeedSql, validateEntityDraft } from '../../internal/reaper-admin/services/entityIngestion';

describe('entity ingestion', () => {
  it('validates complete entity drafts', () => {
    const result = validateEntityDraft({ name: 'Signal Tower', entityType: 'infrastructure', description: 'A source-backed site.', latitude: 42.1, longitude: -71.2, address: 'Rail yard', currentStatus: 'changed', confidenceLevel: 'HIGH' });
    expect(result.valid).toBe(true);
    expect(result.draft?.entityType).toBe('infrastructure');
  });

  it('rejects unsafe or incomplete coordinates', () => {
    const result = validateEntityDraft({ name: '', entityType: 'castle', description: '', latitude: 122, longitude: -200, address: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(3);
  });

  it('escapes generated seed SQL', () => {
    const result = validateEntityDraft({ name: "Keeper's House", entityType: 'building', description: 'Documented caretaker site.', latitude: 1, longitude: 2, address: "Harbor's edge", currentStatus: 'existing', confidenceLevel: 'MEDIUM' });
    expect(result.draft).toBeDefined();
    expect(draftToSeedSql(result.draft!)).toContain("Keeper''s House");
  });
});
