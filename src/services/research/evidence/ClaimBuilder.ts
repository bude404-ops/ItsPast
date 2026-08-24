import type { ClaimType, HistoricalClaim, SourceRecord } from '../../../types/research';
import type { DatePrecision } from '../../../types/entities';

const nowIso = () => new Date('2026-01-01T00:00:00.000Z').toISOString();
export function detectClaimType(text: string): ClaimType {
  const lower = text.toLowerCase();
  if (lower.includes('built') || lower.includes('constructed')) return 'CONSTRUCTION';
  if (lower.includes('demolished') || lower.includes('razed')) return 'DEMOLITION';
  if (lower.includes('renovated') || lower.includes('altered')) return 'RENOVATION';
  if (lower.includes('opened')) return 'BUSINESS_OPENED';
  if (lower.includes('closed')) return 'BUSINESS_CLOSED';
  if (lower.includes('renamed') || lower.includes('formerly')) return 'NAME_CHANGE';
  return 'OTHER';
}
export function extractDatePrecision(text: string): { date?: string; precision: DatePrecision } {
  const exact = text.match(/\b(18|19|20)\d{2}-\d{2}-\d{2}\b/);
  if (exact) return { date: exact[0], precision: 'EXACT' };
  const year = text.match(/\b(18|19|20)\d{2}\b/);
  if (year) return { date: year[0], precision: 'YEAR' };
  const decade = text.match(/\b(18|19|20)\d0s\b/);
  if (decade) return { date: decade[0], precision: 'DECADE' };
  return { precision: 'UNKNOWN' };
}
export function buildClaimFromSource(input: { entityId: string; source: SourceRecord; text: string; extractor?: string }): HistoricalClaim {
  const date = extractDatePrecision(input.text || input.source.description || input.source.title);
  const claimType = detectClaimType(input.text);
  return { id: `claim-${input.entityId}-${input.source.id}-${claimType}`.replace(/[^a-zA-Z0-9-]/g, '-'), entityId: input.entityId, claimType, claimText: input.text || 'UNKNOWN', eventDate: date.date, datePrecision: date.precision, confidence: 'LOW', status: input.text ? 'CANDIDATE' : 'UNKNOWN', provenance: { sourceRecordIds: [input.source.id], extractor: input.extractor ?? 'rule-based-v1', createdFrom: input.source.id }, createdAt: nowIso() };
}
