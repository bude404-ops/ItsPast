import { describe, expect, it } from 'vitest';
import { buildQueueItem, evaluateReconstructionGate, buildReconstructionPrompt } from '../../src/services/reconstruction/reconstructionQueue';
import type { HistoricalSource, PhysicalEntity, ReconstructionRequest, TimelineEvent } from '../../src/types/entities';

const entity: PhysicalEntity = { id: 'entity-1', name: 'Riverside Theater', entityType: 'building', description: 'Theater', location: { latitude: 1, longitude: 2, address: 'River St' }, currentStatus: 'demolished', confidenceLevel: 'HIGH', dataQuality: 88, knownChanges: [], sourceIds: ['s1','s2'], relatedEntityIds: [], demoData: false, createdAt: 'now', updatedAt: 'now' };
const sources: HistoricalSource[] = [
  { id: 's1', sourceType: 'PHOTOGRAPH', title: 'Facade photo', description: 'Front facade', confidence: 'CONFIRMED', demoData: false },
  { id: 's2', sourceType: 'NEWSPAPER', title: 'Opening article', description: 'Opening', confidence: 'HIGH', demoData: false }
];
const timeline: TimelineEvent[] = [{ id: 'e1', entityId: entity.id, date: '1921', datePrecision: 'YEAR', title: 'Opened', description: 'Opened to public', eventType: 'opened', confidence: 'HIGH', sourceIds: ['s2'] }];
const reconstruction: ReconstructionRequest = { id: 'r1', entityId: entity.id, targetYear: '1921', status: 'READY', confidence: 'CONFIRMED', evidence: [{ id: 'ev1', label: 'DOCUMENTED', description: 'Facade shape documented by photo.', sourceIds: ['s1'] }, { id: 'ev2', label: 'STRONGLY_INFERRED', description: 'Opening context from article.', sourceIds: ['s2'] }] };

describe('reconstruction queue gate', () => {
  it('passes when documented evidence and direct high-confidence sources exist', () => {
    const gate = evaluateReconstructionGate({ reconstruction, timeline, sources });
    expect(gate.status).toBe('READY');
    expect(gate.score).toBeGreaterThanOrEqual(70);
  });

  it('blocks missing reconstruction evidence', () => {
    const item = buildQueueItem({ entity, timeline: [], sources: [], reconstruction: undefined });
    expect(item.gate.status).toBe('BLOCKED');
    expect(item.warning).toContain('locked');
  });

  it('builds prompts with source names and anti-invention guardrails', () => {
    const prompt = buildReconstructionPrompt({ entity, reconstruction, sources });
    expect(prompt).toContain('Facade photo');
    expect(prompt).toContain('do not invent');
  });
});
