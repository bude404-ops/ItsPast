import type { ClaimEvidence, HistoricalClaim } from '../../../types/research';
import { applyConfidence, calculateConfidence } from './ConfidenceEngine';
import type { ConfidenceExplanation, SourceRecord } from '../../../types/research';

export function crossCheckClaim(input: { claim: HistoricalClaim; evidence: ClaimEvidence[]; sources: SourceRecord[] }): { claim: HistoricalClaim; explanation: ConfidenceExplanation } {
  const explanation = calculateConfidence(input);
  return { claim: applyConfidence(input.claim, explanation), explanation };
}
