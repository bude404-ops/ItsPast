import { describe, expect, it } from 'vitest';
import { demoEntities } from '../../src/data/demoEntities';
import { mapLibreAdapter } from '../../src/services/map/mapProvider';

describe('map provider', () => {
  it('creates map-ready markers from entity records', () => {
    const markers = mapLibreAdapter.markersForEntities(demoEntities);
    expect(markers.length).toBe(demoEntities.length);
    expect(markers[0]).toHaveProperty('confidence');
  });
});
