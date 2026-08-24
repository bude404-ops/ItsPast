import type { ChangeDetection, TimelineEventDraft } from '../../../types/research';
export function detectChanges(events: TimelineEventDraft[]): ChangeDetection[] {
  return events.filter((event) => ['Construction','Demolition','Renovation','Business opened','Business closed','Use changed','Architectural change','Replacement'].includes(event.title)).map((event) => ({ changeType: event.title.toUpperCase().replace(/ /g, '_'), beforeState: 'UNKNOWN', afterState: event.description, dateRange: event.date === 'UNKNOWN' ? undefined : { start: event.date, end: event.date }, evidenceIds: event.evidenceIds, confidence: event.confidence }));
}
