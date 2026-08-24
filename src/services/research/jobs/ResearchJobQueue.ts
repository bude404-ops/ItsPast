import type { ResearchBudget, ResearchDepth, ResearchJob, ResearchJobType, SourceSearch } from '../../../types/research';

const nowIso = () => new Date('2026-01-01T00:00:00.000Z').toISOString();
export const budgets: Record<ResearchDepth, ResearchBudget> = {
  BASIC: { depth: 'BASIC', maxSourceSearches: 8, maxFetches: 20, maxAiCalls: 0, retryLimit: 1, cacheTtlSeconds: 86400 },
  STANDARD: { depth: 'STANDARD', maxSourceSearches: 20, maxFetches: 60, maxAiCalls: 2, retryLimit: 2, cacheTtlSeconds: 86400 },
  DEEP: { depth: 'DEEP', maxSourceSearches: 50, maxFetches: 150, maxAiCalls: 5, retryLimit: 3, cacheTtlSeconds: 604800 }
};
export function createResearchJob(input: { jobType: ResearchJobType; entityId?: string; location?: string; depth?: ResearchDepth }): ResearchJob {
  return { id: `research-${input.jobType}-${input.entityId ?? input.location ?? 'unknown'}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'), jobType: input.jobType, status: 'QUEUED', entityId: input.entityId, location: input.location, budget: budgets[input.depth ?? 'BASIC'], searchesPerformed: [], sourcesFound: [], claimsExtracted: [], conflicts: [], createdAt: nowIso(), updatedAt: nowIso() };
}
export function canRunSearch(job: ResearchJob): boolean { return job.searchesPerformed.length < job.budget.maxSourceSearches; }
export function recordSearch(job: ResearchJob, search: SourceSearch): ResearchJob {
  if (!canRunSearch(job)) return { ...job, status: 'RATE_LIMITED', updatedAt: nowIso() };
  const key = `${search.providerId}:${search.query}:${search.searchType}`;
  if (job.searchesPerformed.some((item) => `${item.providerId}:${item.query}:${item.searchType}` === key)) return job;
  return { ...job, searchesPerformed: [...job.searchesPerformed, search], updatedAt: nowIso() };
}
