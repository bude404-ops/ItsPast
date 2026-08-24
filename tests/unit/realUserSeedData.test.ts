import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { demoEntities, demoReconstructions, demoSources, demoTimeline } from '../../src/data/demoEntities';

const seedSql = readFileSync(join(process.cwd(), 'supabase/seed/real_user_data.sql'), 'utf8');

describe('real user-facing historical seed data', () => {
  it('uses real no-key source-backed records in fallback data', () => {
    expect(demoEntities).toHaveLength(12);
    expect(demoSources).toHaveLength(12);
    expect(demoTimeline).toHaveLength(12);
    expect(demoReconstructions).toHaveLength(12);
    expect(demoEntities.every((entity) => entity.demoData === false)).toBe(true);
    expect(demoSources.every((source) => source.demoData === false)).toBe(true);
    expect(demoEntities.map((entity) => entity.name)).toEqual(expect.arrayContaining([
      'Pennsylvania Station (1910–1963)',
      'Brooklyn Bridge',
      'Eads Bridge',
      'Pullman National Historical Park',
      'Fox Theatre (Detroit)',
      'Los Angeles Union Station',
      'Detroit Public Library Main Branch',
      'Old Post Office (Washington, D.C.)',
      'SoHo Cast Iron Historic District',
      'Market Street Railway',
      'Flatiron Building',
      'Riverside Church'
    ]));
  });

  it('keeps generated reconstruction requests blocked until stronger evidence exists', () => {
    expect(demoReconstructions.every((request) => request.status === 'INSUFFICIENT_EVIDENCE')).toBe(true);
    expect(demoReconstructions.every((request) => request.prompt?.includes('AI HISTORICAL RECONSTRUCTION'))).toBe(true);
  });

  it('ships an idempotent SQL seed with provenance and licensing caution', () => {
    expect((seedSql.match(/insert into physical_entities/g) ?? [])).toHaveLength(12);
    expect((seedSql.match(/insert into source_records/g) ?? [])).toHaveLength(12);
    expect((seedSql.match(/insert into historical_claims/g) ?? [])).toHaveLength(12);
    expect(seedSql).toContain('CC0_METADATA');
    expect(seedSql).toContain('PER_FILE_LICENSE_REVIEW_REQUIRED');
    expect(seedSql).toContain('can_use_for_ai_processing');
    expect(seedSql).not.toMatch(/DEMO DATA|Example civic parcel|Example harbor district/);
  });
});
