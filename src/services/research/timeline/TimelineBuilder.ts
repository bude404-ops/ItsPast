import type { ClaimEvidence, HistoricalClaim, TimelineEventDraft } from '../../../types/research';

const titles: Record<string, string> = { CONSTRUCTION: 'Construction', DEMOLITION: 'Demolition', RENOVATION: 'Renovation', BUSINESS_OPENED: 'Business opened', BUSINESS_CLOSED: 'Business closed', OWNERSHIP_CHANGE: 'Ownership changed', NAME_CHANGE: 'Name changed', USE_CHANGE: 'Use changed', ARCHITECTURAL_CHANGE: 'Architectural change', EVENT: 'Event', RELOCATION: 'Relocation', REPLACEMENT: 'Replacement', OTHER: 'Historical record' };
export function buildTimeline(claims: HistoricalClaim[], evidence: ClaimEvidence[]): TimelineEventDraft[] {
  return claims.filter((claim) => claim.status === 'SUPPORTED' || claim.status === 'SOURCE_CONFLICT').map((claim) => ({ id: `timeline-${claim.id}`, entityId: claim.entityId, date: claim.eventDate ?? 'UNKNOWN', datePrecision: claim.datePrecision, title: titles[claim.claimType], description: claim.claimText, claimIds: [claim.id], evidenceIds: evidence.filter((item) => item.claimId === claim.id).map((item) => item.id), confidence: claim.confidence })).sort((a, b) => a.date.localeCompare(b.date));
}
