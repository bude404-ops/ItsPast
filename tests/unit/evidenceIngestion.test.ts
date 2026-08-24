import { describe, expect, it } from 'vitest';
import { evidencePackageToSeedSql, validateEvidencePackage } from '../../internal/reaper-admin/services/evidenceIngestion';

const validPackage = {
  entityId: '00000000-0000-0000-0000-000000000000',
  sources: [{ sourceType: 'MAP', title: '1902 Sanborn Sheet', description: 'Mapped parcel footprint.', confidence: 'CONFIRMED' }],
  timeline: [{ date: '1902', datePrecision: 'YEAR', title: 'Mapped footprint', description: 'The parcel appears on the fire insurance map.', eventType: 'mapped', confidence: 'HIGH', sourceTitles: ['1902 Sanborn Sheet'] }],
  reconstruction: { targetYear: '1902', status: 'READY', confidence: 'HIGH', evidence: [{ label: 'DOCUMENTED', description: 'Footprint documented by map.', sourceTitles: ['1902 Sanborn Sheet'] }] }
};

describe('evidence ingestion', () => {
  it('validates source-linked evidence packages', () => {
    const result = validateEvidencePackage(validPackage);
    expect(result.valid).toBe(true);
    expect(result.draft?.timeline[0].sourceTitles).toContain('1902 Sanborn Sheet');
  });

  it('rejects timeline events referencing missing sources', () => {
    const result = validateEvidencePackage({ ...validPackage, timeline: [{ ...validPackage.timeline[0], sourceTitles: ['Missing Archive'] }] });
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toContain('unknown source');
  });

  it('generates reviewed SQL for source, event, and reconstruction evidence rows', () => {
    const result = validateEvidencePackage(validPackage);
    expect(result.draft).toBeDefined();
    const sql = evidencePackageToSeedSql(result.draft!);
    expect(sql).toContain('historical_sources');
    expect(sql).toContain('historical_events');
    expect(sql).toContain('reconstruction_evidence');
  });
});
