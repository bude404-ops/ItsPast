import type { ClaimEvidence, HistoricalClaim, ReconstructionEligibility, SourceRecord } from '../../../types/research';

export function evaluateReconstructionEligibility(input: { claims: HistoricalClaim[]; evidence: ClaimEvidence[]; sources: SourceRecord[] }): ReconstructionEligibility {
  const photoEvidence = input.sources.filter((source) => source.sourceType === 'PHOTOGRAPH').map((source) => source.id);
  const mapEvidence = input.sources.filter((source) => source.sourceType === 'MAP').map((source) => source.id);
  const strongEvidence = input.evidence.filter((item) => item.strength === 'VERY_STRONG' || item.strength === 'STRONG');
  const knownElements = strongEvidence.map((item) => item.evidenceText).slice(0, 8);
  const estimatedElements = input.evidence.filter((item) => item.strength === 'MODERATE').map((item) => item.evidenceText).slice(0, 6);
  const unknownElements = ['Unsupported architectural details', 'Unverified signage', 'Unverified materials'].filter(Boolean);
  const enough = photoEvidence.length >= 1 || strongEvidence.length >= 3 || (mapEvidence.length >= 1 && strongEvidence.length >= 2);
  const reasons = [photoEvidence.length ? `${photoEvidence.length} historical photograph source(s)` : 'No historical photograph source confirmed', `${strongEvidence.length} strong evidence item(s)`, mapEvidence.length ? `${mapEvidence.length} map source(s)` : 'No map source confirmed'];
  return { status: enough ? 'ELIGIBLE' : 'INSUFFICIENT_EVIDENCE', confidence: enough ? (photoEvidence.length ? 'HIGH' : 'MEDIUM') : 'UNKNOWN', reasons, evidenceIds: strongEvidence.map((item) => item.id), knownElements, estimatedElements, unknownElements };
}
