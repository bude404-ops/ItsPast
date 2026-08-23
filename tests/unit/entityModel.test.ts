import { describe, expect, it } from 'vitest';
import { demoEntities, demoReconstructions, demoSources, demoTimeline } from '../../src/data/demoEntities';
import { demoEntityRepository } from '../../src/services/entities/entityRepository';

describe('entity model', () => {
  it('marks all fictional development records as demo data', () => {
    expect(demoEntities.length).toBeGreaterThanOrEqual(4);
    expect(demoEntities.every((entity) => entity.demoData === true && entity.description.includes('DEMO DATA'))).toBe(true);
    expect(demoSources.every((source) => source.demoData === true && source.title.includes('DEMO DATA'))).toBe(true);
  });

  it('links timelines and reconstructions to entities', () => {
    const ids = new Set(demoEntities.map((entity) => entity.id));
    expect(demoTimeline.every((event) => ids.has(event.entityId))).toBe(true);
    expect(demoReconstructions.every((request) => ids.has(request.entityId))).toBe(true);
  });

  it('searches known historical concepts', async () => {
    const results = await demoEntityRepository.search('bridge');
    expect(results.some((entity) => entity.id === 'north-valley-bridge')).toBe(true);
  });
});
