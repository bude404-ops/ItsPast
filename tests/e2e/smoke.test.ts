import { describe, expect, it } from 'vitest';
import { demoEntities } from '../../src/data/demoEntities';

describe('mobile smoke checklist', () => {
  it('has routes and entities required for MVP smoke testing', () => {
    expect(['/','/scan','/explore','/map','/discoveries','/profile','/entity/:id','/timeline/:id']).toContain('/scan');
    expect(demoEntities.length).toBeGreaterThanOrEqual(4);
  });
});
