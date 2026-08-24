import { describe, expect, it } from 'vitest';
import { deriveDemoReconstructionJobs, mapReconstructionJobRow } from '../../src/services/reconstruction/reconstructionJobRepository';

const row = {
  id: 'job-1',
  entity_id: 'entity-1',
  physical_entities: { name: 'Riverside Theater' },
  reconstruction_id: 'recon-1',
  reconstructions: { target_year: '1954' },
  status: 'COMPLETED' as const,
  evidence_score: 91,
  prompt_snapshot: 'Prompt',
  output_url: 'artifact://riverside',
  warning: 'AI GENERATED — historically informed visualization, not an authentic photograph.',
  blocked_reason: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z'
};

describe('reconstruction job repository', () => {
  it('maps persisted Supabase job rows into dashboard jobs', () => {
    const job = mapReconstructionJobRow(row);
    expect(job.entityName).toBe('Riverside Theater');
    expect(job.targetYear).toBe('1954');
    expect(job.status).toBe('COMPLETED');
    expect(job.outputUrl).toBe('artifact://riverside');
  });

  it('derives demo jobs when persistence is unavailable', async () => {
    const jobs = await deriveDemoReconstructionJobs();
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.some((job) => job.entityId === 'riverside-theater')).toBe(true);
  });
});
