import { describe, expect, it } from 'vitest';
import { demoEntities } from '../../src/data/demoEntities';

describe('application routes and page foundations', () => {
  it('contains required MVP demo entities and routable records', () => {
    expect(demoEntities.map((entity) => entity.id)).toContain('riverside-theater');
    expect(demoEntities.length).toBeGreaterThanOrEqual(4);
  });
});
