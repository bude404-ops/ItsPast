import { describe, expect, it } from 'vitest';
import { advanceReconstructionJob, createReconstructionJob, summarizeJobs } from '../../src/services/reconstruction/reconstructionJobs';
import type { ReconstructionQueueItem } from '../../src/services/reconstruction/reconstructionQueue';

const readyItem: ReconstructionQueueItem = { entityId: 'entity-1', entityName: 'Riverside Theater', targetYear: '1954', status: 'READY', confidence: 'CONFIRMED', gate: { status: 'READY', score: 82, blockers: [], strengths: ['Evidence ready'], documentedCount: 1, directSourceCount: 2, highConfidenceSourceCount: 2 }, warning: 'AI GENERATED — historically informed visualization, not an authentic photograph.' };
const blockedItem: ReconstructionQueueItem = { ...readyItem, entityId: 'entity-2', entityName: 'Maple Market', gate: { ...readyItem.gate, status: 'BLOCKED', score: 44, blockers: ['At least two direct source links are required.'] }, warning: 'Viewer locked until evidence gate passes.' };

describe('reconstruction job lifecycle', () => {
  it('creates queued jobs only when the evidence gate is ready', () => {
    const job = createReconstructionJob({ item: readyItem, prompt: 'Prompt' });
    expect(job.status).toBe('QUEUED');
    expect(job.evidenceScore).toBe(82);
  });

  it('keeps blocked jobs from advancing before evidence is fixed', () => {
    const job = createReconstructionJob({ item: blockedItem, prompt: '' });
    const advanced = advanceReconstructionJob(job, 'RUNNING');
    expect(advanced.status).toBe('BLOCKED');
    expect(advanced.blockedReason).toContain('direct source');
  });

  it('requires completed jobs to carry an output artifact', () => {
    const job = createReconstructionJob({ item: readyItem, prompt: 'Prompt' });
    const completed = advanceReconstructionJob(job, 'COMPLETED');
    expect(completed.status).toBe('FAILED');
  });

  it('summarizes dashboard counts', () => {
    const queued = createReconstructionJob({ item: readyItem, prompt: 'Prompt' });
    const blocked = createReconstructionJob({ item: blockedItem, prompt: '' });
    const summary = summarizeJobs([queued, blocked]);
    expect(summary.total).toBe(2);
    expect(summary.queued).toBe(1);
    expect(summary.blocked).toBe(1);
  });
});
