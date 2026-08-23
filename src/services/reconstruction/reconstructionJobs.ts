import type { ReconstructionRequest } from '../../types/entities';
import type { EvidenceGateReport, ReconstructionQueueItem } from './reconstructionQueue';

export type ReconstructionJobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED';

export interface ReconstructionJob {
  id: string;
  entityId: string;
  entityName: string;
  reconstructionId?: string;
  targetYear: string;
  status: ReconstructionJobStatus;
  evidenceScore: number;
  promptSnapshot: string;
  outputUrl?: string;
  warning: string;
  blockedReason?: string;
  createdAt: string;
  updatedAt: string;
}

const nowIso = () => new Date('2026-01-01T00:00:00.000Z').toISOString();

export function createReconstructionJob(input: { item: ReconstructionQueueItem; reconstruction?: ReconstructionRequest; prompt: string }): ReconstructionJob {
  const blockedReason = input.item.gate.status === 'BLOCKED' ? input.item.gate.blockers.join(' ') : undefined;
  return {
    id: `job-${input.item.entityId}-${input.item.targetYear}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    entityId: input.item.entityId,
    entityName: input.item.entityName,
    reconstructionId: input.reconstruction?.id,
    targetYear: input.item.targetYear,
    status: input.item.gate.status === 'READY' ? 'QUEUED' : 'BLOCKED',
    evidenceScore: input.item.gate.score,
    promptSnapshot: input.prompt,
    warning: input.item.warning,
    blockedReason,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}

export function advanceReconstructionJob(job: ReconstructionJob, next: ReconstructionJobStatus, options: { outputUrl?: string; failedReason?: string } = {}): ReconstructionJob {
  if (job.status === 'BLOCKED' && next !== 'BLOCKED') return { ...job, blockedReason: job.blockedReason ?? 'Evidence gate must pass before this job can advance.' };
  if (next === 'COMPLETED' && !options.outputUrl) return { ...job, status: 'FAILED', blockedReason: 'Completed jobs require an output artifact URL.', updatedAt: nowIso() };
  return {
    ...job,
    status: next,
    outputUrl: options.outputUrl ?? job.outputUrl,
    blockedReason: next === 'FAILED' ? options.failedReason ?? job.blockedReason ?? 'Generation failed.' : job.blockedReason,
    updatedAt: nowIso()
  };
}

export function summarizeJobs(jobs: ReconstructionJob[]) {
  return {
    total: jobs.length,
    queued: jobs.filter((job) => job.status === 'QUEUED').length,
    running: jobs.filter((job) => job.status === 'RUNNING').length,
    completed: jobs.filter((job) => job.status === 'COMPLETED').length,
    blocked: jobs.filter((job) => job.status === 'BLOCKED').length,
    failed: jobs.filter((job) => job.status === 'FAILED').length,
    averageEvidenceScore: jobs.length ? Math.round(jobs.reduce((sum, job) => sum + job.evidenceScore, 0) / jobs.length) : 0
  };
}

export function gateStatusLabel(gate: EvidenceGateReport): string {
  return gate.status === 'READY' ? `Ready at ${gate.score}/100 evidence` : `Blocked at ${gate.score}/100 evidence`;
}
