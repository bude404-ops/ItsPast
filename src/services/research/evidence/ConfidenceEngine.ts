import type { ClaimEvidence, ConfidenceExplanation, HistoricalClaim, SourceRecord } from '../../../types/research';

const sourceWeight = (source?: SourceRecord) => {
  if (!source) return 0;
  if (['GOVERNMENT','ARCHIVE','PHOTOGRAPH','MAP'].includes(source.sourceType)) return 25;
  if (['LIBRARY','MUSEUM','HISTORICAL_SOCIETY','NEWSPAPER'].includes(source.sourceType)) return 18;
  return 8;
};
const strengthWeight = { VERY_STRONG: 25, STRONG: 18, MODERATE: 10, WEAK: 4 } as const;
export function calculateConfidence(input: { claim: HistoricalClaim; evidence: ClaimEvidence[]; sources: SourceRecord[] }): ConfidenceExplanation {
  const conflicts = input.evidence.filter((item) => item.evidenceType === 'CONFLICTING').map((item) => item.evidenceText);
  const sourceIds = [...new Set(input.evidence.map((item) => item.sourceRecordId))];
  const independentSourceCount = new Set(sourceIds.map((id) => input.sources.find((source) => source.id === id)?.providerId ?? id)).size;
  let score = 0;
  for (const evidence of input.evidence) score += strengthWeight[evidence.strength] + sourceWeight(input.sources.find((source) => source.id === evidence.sourceRecordId));
  if (independentSourceCount >= 2) score += 20;
  if (conflicts.length) score -= 30;
  score = Math.max(0, Math.min(100, score));
  const confidence = score >= 90 && independentSourceCount >= 2 ? 'CONFIRMED' : score >= 72 ? 'HIGH' : score >= 50 ? 'MEDIUM' : score >= 25 ? 'LOW' : input.evidence.length ? 'SPECULATIVE' : 'UNKNOWN';
  const reasons = [`${sourceIds.length} source record${sourceIds.length === 1 ? '' : 's'}`, `${independentSourceCount} independent provider${independentSourceCount === 1 ? '' : 's'}`, `${input.evidence.filter((item) => item.evidenceType === 'DIRECT').length} direct evidence item${input.evidence.filter((item) => item.evidenceType === 'DIRECT').length === 1 ? '' : 's'}`];
  return { confidence, score, reasons, conflicts, sourceCount: sourceIds.length, independentSourceCount };
}
export function applyConfidence(claim: HistoricalClaim, explanation: ConfidenceExplanation): HistoricalClaim {
  return { ...claim, confidence: explanation.confidence, status: explanation.conflicts.length ? 'SOURCE_CONFLICT' : explanation.confidence === 'UNKNOWN' ? 'UNKNOWN' : explanation.score >= 50 ? 'SUPPORTED' : 'CROSS_CHECKING' };
}
