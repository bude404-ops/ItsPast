import type { ClaimEvidence, EvidenceStrength, EvidenceType, HistoricalClaim, SourceRecord } from '../../../types/research';

const nowIso = () => new Date('2026-01-01T00:00:00.000Z').toISOString();
export function extractEvidenceForClaim(claim: HistoricalClaim, source: SourceRecord): ClaimEvidence {
  const text = `${source.title}. ${source.description}`.trim();
  const direct = claim.claimText.toLowerCase().split(/\s+/).filter((word) => word.length > 4).some((word) => text.toLowerCase().includes(word));
  const evidenceType: EvidenceType = direct ? 'DIRECT' : 'INDIRECT';
  const strength: EvidenceStrength = direct && source.sourceType !== 'USER_SUBMISSION' ? 'STRONG' : direct ? 'MODERATE' : 'WEAK';
  return { id: `evidence-${claim.id}-${source.id}`.replace(/[^a-zA-Z0-9-]/g, '-'), claimId: claim.id, sourceRecordId: source.id, evidenceText: text || 'UNKNOWN', evidenceType, strength, createdAt: nowIso() };
}
