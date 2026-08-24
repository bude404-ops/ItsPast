import { isSupabaseConfigured, supabaseConfig } from '../../lib/supabase';
import { demoEntities, demoReconstructions } from '../../data/demoEntities';
import { createReconstructionJob, summarizeJobs, type ReconstructionJob, type ReconstructionJobStatus } from './reconstructionJobs';
import { buildQueueItem, buildReconstructionPrompt } from './reconstructionQueue';
import { demoEntityRepository, entityRepository } from '../entities/entityRepository';

interface ReconstructionJobRow {
  id: string;
  entity_id: string;
  physical_entities?: { name?: string | null } | null;
  reconstruction_id: string | null;
  reconstructions?: { target_year?: string | null } | null;
  status: ReconstructionJobStatus;
  evidence_score: number | null;
  prompt_snapshot: string | null;
  output_url: string | null;
  warning: string | null;
  blocked_reason: string | null;
  created_at: string;
  updated_at: string;
}

async function restFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${supabaseConfig.url}/rest/v1/${path}`, { headers: { apikey: supabaseConfig.anonKey ?? '', Authorization: `Bearer ${supabaseConfig.anonKey ?? ''}` } });
  if (!response.ok) throw new Error(`Supabase reconstruction job request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export function mapReconstructionJobRow(row: ReconstructionJobRow): ReconstructionJob {
  return {
    id: row.id,
    entityId: row.entity_id,
    entityName: row.physical_entities?.name ?? 'Unknown entity',
    reconstructionId: row.reconstruction_id ?? undefined,
    targetYear: row.reconstructions?.target_year ?? 'Unknown',
    status: row.status,
    evidenceScore: row.evidence_score ?? 0,
    promptSnapshot: row.prompt_snapshot ?? '',
    outputUrl: row.output_url ?? undefined,
    warning: row.warning ?? 'AI GENERATED — historically informed visualization, not an authentic photograph.',
    blockedReason: row.blocked_reason ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function deriveReconstructionJobsFromEntities(): Promise<ReconstructionJob[]> {
  const entities = await entityRepository.listEntities();
  return Promise.all(entities.map(async (entity) => {
    const [timeline, sources, reconstruction] = await Promise.all([
      entityRepository.getTimeline(entity.id),
      entityRepository.getSources(entity),
      entityRepository.getReconstruction(entity.id)
    ]);
    const item = buildQueueItem({ entity, timeline, sources, reconstruction });
    const prompt = reconstruction ? (reconstruction.prompt || buildReconstructionPrompt({ entity, reconstruction, sources })) : '';
    return createReconstructionJob({ item, reconstruction, prompt });
  }));
}

export async function deriveDemoReconstructionJobs(): Promise<ReconstructionJob[]> {
  return Promise.all(demoEntities.map(async (entity) => {
    const timeline = await demoEntityRepository.getTimeline(entity.id);
    const sources = await demoEntityRepository.getSources(entity);
    const reconstruction = demoReconstructions.find((request) => request.entityId === entity.id);
    const item = buildQueueItem({ entity, timeline, sources, reconstruction });
    const prompt = reconstruction ? (reconstruction.prompt || buildReconstructionPrompt({ entity, reconstruction, sources })) : '';
    return createReconstructionJob({ item, reconstruction, prompt });
  }));
}

export interface ReconstructionJobRepository {
  listJobs(): Promise<ReconstructionJob[]>;
}

export const supabaseReconstructionJobRepository: ReconstructionJobRepository = {
  async listJobs() {
    const rows = await restFetch<ReconstructionJobRow[]>('reconstruction_jobs?select=id,entity_id,physical_entities(name),reconstruction_id,reconstructions(target_year),status,evidence_score,prompt_snapshot,output_url,warning,blocked_reason,created_at,updated_at&order=updated_at.desc');
    return rows.map(mapReconstructionJobRow);
  }
};

export const reconstructionJobRepository: ReconstructionJobRepository = {
  async listJobs() {
    if (!isSupabaseConfigured) return deriveDemoReconstructionJobs();
    try {
      const persisted = await supabaseReconstructionJobRepository.listJobs();
      return persisted.length ? persisted : deriveReconstructionJobsFromEntities();
    } catch {
      return deriveReconstructionJobsFromEntities();
    }
  }
};

export const reconstructionJobSummary = summarizeJobs;
