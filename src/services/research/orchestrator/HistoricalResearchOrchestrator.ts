import type { HistoricalClaim, HistoricalResearchResult, ResearchQueryInput, SourceProvider, SourceRecord, TimelineEventDraft } from '../../../types/research';
import { buildClaimFromSource } from '../evidence/ClaimBuilder';
import { calculateConfidence } from '../evidence/ConfidenceEngine';
import { extractEvidenceForClaim } from '../evidence/EvidenceExtractor';
import { matchSourceToEntity } from '../matching/SourceMatcher';
import { buildTimeline } from '../timeline/TimelineBuilder';
import { configuredProviders, noKeySourceProviders } from '../providers';

export class HistoricalResearchOrchestrator {
  constructor(private readonly providers: SourceProvider[] = configuredProviders(noKeySourceProviders)) {}
  async research(input: ResearchQueryInput): Promise<HistoricalResearchResult> {
    const sources: SourceRecord[] = [];
    const providerStatuses: HistoricalResearchResult['providerStatuses'] = [];
    for (const provider of this.providers) {
      try {
        const searches = provider.buildSearches(input).slice(0, 3);
        for (const search of searches) sources.push(...await provider.search(search));
        providerStatuses.push({ id: provider.config.id, status: 'ONLINE', errors: [] });
      } catch (error) {
        providerStatuses.push({ id: provider.config.id, status: String(error).includes('429') ? 'RATE_LIMITED' : 'DEGRADED', errors: [error instanceof Error ? error.message : String(error)] });
      }
    }
    const claims: HistoricalClaim[] = sources.slice(0, 12).map((source) => buildClaimFromSource({ entityId: input.entityName ?? input.location ?? 'unknown-entity', source, text: `${source.title}. ${source.description}` }));
    const evidence = claims.map((claim, index) => extractEvidenceForClaim(claim, sources[index]));
    const confidence = claims.map((claim) => calculateConfidence({ claim, evidence: evidence.filter((item) => item.claimId === claim.id), sources }));
    const events: TimelineEventDraft[] = buildTimeline(claims, evidence);
    const entities = sources.slice(0, 10).map((source) => matchSourceToEntity({ entityName: input.entityName ?? source.title, source }));
    return { sources, entities, claims, images: sources.filter((source) => source.sourceType === 'PHOTOGRAPH'), maps: sources.filter((source) => source.sourceType === 'MAP'), events, confidence, conflicts: confidence.flatMap((item) => item.conflicts), providerStatuses };
  }
}

export const freeSourceResearchOrchestrator = new HistoricalResearchOrchestrator();
