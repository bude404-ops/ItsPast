import { describe, expect, it } from 'vitest';
import { buildProviderSearches, generateResearchQueries } from '../../src/services/research/SourceSearch';
import { normalizeGenericSource } from '../../src/services/research/SourceNormalizer';
import { libraryOfCongressProviderConfig } from '../../src/services/research/providers/providerConfigs';
import { buildAddressHistory, matchSourceToEntity, normalizeAddress, shouldAutoMerge } from '../../src/services/research/matching/SourceMatcher';
import { buildClaimFromSource, extractDatePrecision } from '../../src/services/research/evidence/ClaimBuilder';
import { extractEvidenceForClaim } from '../../src/services/research/evidence/EvidenceExtractor';
import { calculateConfidence, applyConfidence } from '../../src/services/research/evidence/ConfidenceEngine';
import { buildTimeline } from '../../src/services/research/timeline/TimelineBuilder';
import { detectChanges } from '../../src/services/research/timeline/ChangeDetector';
import { evaluateReconstructionEligibility } from '../../src/services/research/reconstruction/ReconstructionEvidenceBuilder';
import { buildReconstructionPrompt } from '../../src/services/research/reconstruction/reconstructionPromptBuilder';
import { createResearchJob, recordSearch } from '../../src/services/research/jobs/ResearchJobQueue';

describe('research engine pipeline', () => {
  const source = normalizeGenericSource(libraryOfCongressProviderConfig, { id: 'loc-1', title: 'Riverside Theater opened in 1921', description: 'The Riverside Theater was constructed with a brick facade and opened in 1921.', date: '1921', url: 'https://www.loc.gov/item/example/', format: ['photograph'], rights: 'Check source rights' });
  const corroboratingSource = normalizeGenericSource({ ...libraryOfCongressProviderConfig, id: 'archive' }, { id: 'archive-1', title: 'City permit confirms Riverside Theater opening', description: 'Permit record says Riverside Theater opened in 1921.', date: '1921', format: ['government'], rights: 'UNKNOWN' });

  it('generates address, history, photo, newspaper, map, date, and coordinate searches', () => {
    const queries = generateResearchQueries({ entityName: '123 Main Street', location: 'Springfield', dateRange: { start: '1950' }, coordinates: { latitude: 39.78, longitude: -89.64 }, nearbyLandmarks: ['Old Courthouse'] });
    expect(queries).toContain('123 Main Street history');
    expect(queries).toContain('123 Main Street old photo');
    expect(queries).toContain('123 Main Street 1950');
    expect(queries.some((query) => query.includes('historic map'))).toBe(true);
    expect(buildProviderSearches('loc', { entityName: '123 Main Street' })[0].providerId).toBe('loc');
  });

  it('normalizes sources without assuming copyright status', () => {
    expect(source.providerId).toBe('loc');
    expect(source.sourceType).toBe('PHOTOGRAPH');
    expect(source.copyrightStatus).toBe('Check source rights');
  });

  it('normalizes addresses and blocks low-confidence auto merges', () => {
    expect(normalizeAddress('123 Main Street')).toBe('123 main st');
    const address = buildAddressHistory({ currentAddress: '123 Main Street' });
    const match = matchSourceToEntity({ entityName: 'Riverside Theater', address, source });
    expect(match.matchConfidence).toBe('MEDIUM');
    expect(shouldAutoMerge(match)).toBe(false);
  });

  it('extracts dates and builds traceable claims', () => {
    expect(extractDatePrecision('opened in 1921').precision).toBe('YEAR');
    const claim = buildClaimFromSource({ entityId: 'entity-1', source, text: 'Riverside Theater opened in 1921.' });
    expect(claim.claimType).toBe('BUSINESS_OPENED');
    expect(claim.provenance.sourceRecordIds).toContain(source.id);
  });

  it('calculates explainable confidence and timeline events from supported claims', () => {
    const claim = buildClaimFromSource({ entityId: 'entity-1', source, text: 'Riverside Theater opened in 1921.' });
    const evidence = extractEvidenceForClaim(claim, source);
    const corroboratingEvidence = extractEvidenceForClaim(claim, corroboratingSource);
    const explanation = calculateConfidence({ claim, evidence: [evidence, corroboratingEvidence], sources: [source, corroboratingSource] });
    const supported = applyConfidence(claim, explanation);
    const timeline = buildTimeline([supported], [evidence, corroboratingEvidence]);
    expect(explanation.reasons.join(' ')).toContain('source');
    expect(timeline.length).toBe(1);
    expect(detectChanges(timeline).length).toBe(1);
  });

  it('gates reconstruction and builds anti-invention prompts', () => {
    const claim = applyConfidence(buildClaimFromSource({ entityId: 'entity-1', source, text: 'Riverside Theater opened in 1921.' }), { confidence: 'HIGH', score: 80, reasons: [], conflicts: [], sourceCount: 1, independentSourceCount: 1 });
    const evidence = extractEvidenceForClaim(claim, source);
    const eligibility = evaluateReconstructionEligibility({ claims: [claim], evidence: [evidence], sources: [source] });
    expect(eligibility.status).toBe('ELIGIBLE');
    const built = buildReconstructionPrompt({ location: '123 Main Street', year: '1921', reconstructionType: 'HISTORICAL_RECONSTRUCTION', evidence: [evidence], claims: [claim], sources: [source], knownElements: eligibility.knownElements, estimatedElements: eligibility.estimatedElements, unknownElements: eligibility.unknownElements, confidence: eligibility.confidence });
    expect(built.prompt).toContain('Do not invent unsupported architectural details');
    expect(built.metadata.label).toBe('AI RECONSTRUCTION');
  });

  it('deduplicates research job searches and respects budget counters', () => {
    const job = createResearchJob({ jobType: 'research_entity', entityId: 'entity-1', depth: 'BASIC' });
    const search = { providerId: 'loc', query: 'Riverside Theater history', searchType: 'TEXT' as const, limit: 10 };
    const once = recordSearch(job, search);
    const twice = recordSearch(once, search);
    expect(twice.searchesPerformed.length).toBe(1);
    expect(twice.budget.maxAiCalls).toBe(0);
  });
});
