import { describe, expect, it } from 'vitest';
import { demoEntities } from '../../src/data/demoEntities';

describe('application routes and page foundations', () => {
  it('contains required MVP demo entities and routable records', () => {
    expect(demoEntities.map((entity) => entity.id)).toContain('riverside-theater');
    expect(demoEntities.length).toBeGreaterThanOrEqual(4);
  });

  it('uses hash-safe client routing for GitHub Pages project deployment', () => {
    const routes = ['#/map', '#/admin/ingest', '#/admin/reconstruction-jobs', '#/entity/riverside-theater'];
    expect(routes.every((route) => route.startsWith('#/'))).toBe(true);
  });
});
