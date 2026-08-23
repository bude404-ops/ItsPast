import { isSupabaseConfigured, supabaseConfig } from '../../lib/supabase';
import type { ConfidenceLevel, DatePrecision, ReconstructionRequest, SourceType } from '../../types/entities';

export interface SourceDraft { sourceType: SourceType; title: string; publisher?: string; author?: string; publicationDate?: string; url?: string; archiveReference?: string; copyrightStatus?: string; description: string; confidence: ConfidenceLevel; }
export interface TimelineEventDraft { date: string; datePrecision: DatePrecision; title: string; description: string; eventType: string; confidence: ConfidenceLevel; sourceTitles: string[]; }
export interface ReconstructionEvidenceDraft { label: ReconstructionRequest['evidence'][number]['label']; description: string; sourceTitles: string[]; }
export interface EvidencePackageDraft { entityId: string; sources: SourceDraft[]; timeline: TimelineEventDraft[]; reconstruction?: { targetYear: string; status: ReconstructionRequest['status']; confidence: ConfidenceLevel; prompt?: string; evidence: ReconstructionEvidenceDraft[]; }; }
export interface EvidenceValidationResult { valid: boolean; errors: string[]; draft?: EvidencePackageDraft; }

const sourceTypes: SourceType[] = ['ARCHIVE','GOVERNMENT','NEWSPAPER','MUSEUM','LIBRARY','HISTORICAL_SOCIETY','BOOK','ACADEMIC','PHOTOGRAPH','MAP','USER_SUBMISSION','EXPERT_SUBMISSION'];
const confidences: ConfidenceLevel[] = ['CONFIRMED','HIGH','MEDIUM','LOW','SPECULATIVE'];
const datePrecisions: DatePrecision[] = ['EXACT','YEAR','DECADE','APPROXIMATE','UNKNOWN'];
const evidenceLabels: ReconstructionEvidenceDraft['label'][] = ['DOCUMENTED','STRONGLY_INFERRED','ESTIMATED','AI_INTERPRETATION'];
const statuses: ReconstructionRequest['status'][] = ['PENDING','RESEARCHING','READY','FAILED','INSUFFICIENT_EVIDENCE'];
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const asArray = (value: unknown): unknown[] => Array.isArray(value) ? value : [];
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const texts = (value: unknown) => asArray(value).map(text).filter(Boolean);
const esc = (value: string) => value.replaceAll("'", "''");
const nullable = (value?: string) => value ? `'${esc(value)}'` : 'null';

export function validateEvidencePackage(input: unknown): EvidenceValidationResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { valid: false, errors: ['Evidence package must be a JSON object.'] };
  const draft: EvidencePackageDraft = {
    entityId: text(input.entityId),
    sources: asArray(input.sources).filter(isRecord).map((source) => ({
      sourceType: text(source.sourceType) as SourceType,
      title: text(source.title),
      publisher: text(source.publisher) || undefined,
      author: text(source.author) || undefined,
      publicationDate: text(source.publicationDate) || undefined,
      url: text(source.url) || undefined,
      archiveReference: text(source.archiveReference) || undefined,
      copyrightStatus: text(source.copyrightStatus) || undefined,
      description: text(source.description),
      confidence: (text(source.confidence) || 'LOW') as ConfidenceLevel
    })),
    timeline: asArray(input.timeline).filter(isRecord).map((event) => ({
      date: text(event.date),
      datePrecision: (text(event.datePrecision) || 'UNKNOWN') as DatePrecision,
      title: text(event.title),
      description: text(event.description),
      eventType: text(event.eventType) || 'record',
      confidence: (text(event.confidence) || 'LOW') as ConfidenceLevel,
      sourceTitles: texts(event.sourceTitles)
    }))
  };
  if (isRecord(input.reconstruction)) {
    draft.reconstruction = {
      targetYear: text(input.reconstruction.targetYear),
      status: (text(input.reconstruction.status) || 'PENDING') as ReconstructionRequest['status'],
      confidence: (text(input.reconstruction.confidence) || 'SPECULATIVE') as ConfidenceLevel,
      prompt: text(input.reconstruction.prompt) || undefined,
      evidence: asArray(input.reconstruction.evidence).filter(isRecord).map((evidence) => ({ label: text(evidence.label) as ReconstructionEvidenceDraft['label'], description: text(evidence.description), sourceTitles: texts(evidence.sourceTitles) }))
    };
  }
  if (!draft.entityId) errors.push('entityId is required.');
  if (!draft.sources.length) errors.push('At least one source is required.');
  const sourceTitleSet = new Set(draft.sources.map((source) => source.title).filter(Boolean));
  draft.sources.forEach((source, index) => {
    if (!source.title) errors.push(`sources[${index}].title is required.`);
    if (!source.description) errors.push(`sources[${index}].description is required.`);
    if (!sourceTypes.includes(source.sourceType)) errors.push(`sources[${index}].sourceType is invalid.`);
    if (!confidences.includes(source.confidence)) errors.push(`sources[${index}].confidence is invalid.`);
    if (source.url && !/^https?:\/\//.test(source.url)) errors.push(`sources[${index}].url must start with http:// or https://.`);
  });
  draft.timeline.forEach((event, index) => {
    if (!event.title) errors.push(`timeline[${index}].title is required.`);
    if (!event.description) errors.push(`timeline[${index}].description is required.`);
    if (!datePrecisions.includes(event.datePrecision)) errors.push(`timeline[${index}].datePrecision is invalid.`);
    if (!confidences.includes(event.confidence)) errors.push(`timeline[${index}].confidence is invalid.`);
    event.sourceTitles.forEach((title) => { if (!sourceTitleSet.has(title)) errors.push(`timeline[${index}] references unknown source: ${title}.`); });
  });
  if (draft.reconstruction) {
    if (!draft.reconstruction.targetYear) errors.push('reconstruction.targetYear is required.');
    if (!statuses.includes(draft.reconstruction.status)) errors.push('reconstruction.status is invalid.');
    if (!confidences.includes(draft.reconstruction.confidence)) errors.push('reconstruction.confidence is invalid.');
    draft.reconstruction.evidence.forEach((evidence, index) => {
      if (!evidenceLabels.includes(evidence.label)) errors.push(`reconstruction.evidence[${index}].label is invalid.`);
      if (!evidence.description) errors.push(`reconstruction.evidence[${index}].description is required.`);
      evidence.sourceTitles.forEach((title) => { if (!sourceTitleSet.has(title)) errors.push(`reconstruction.evidence[${index}] references unknown source: ${title}.`); });
    });
  }
  return { valid: errors.length === 0, errors, draft: errors.length ? undefined : draft };
}

export function evidencePackageToSeedSql(draft: EvidencePackageDraft): string {
  const titleToSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'source';
  const lines = ['do $$', 'declare'];
  draft.sources.forEach((source) => lines.push(`  src_${titleToSlug(source.title)} uuid;`));
  draft.timeline.forEach((_, index) => lines.push(`  ev_${index + 1} uuid;`));
  if (draft.reconstruction) lines.push('  recon_id uuid;');
  lines.push('begin');
  draft.sources.forEach((source) => {
    const slug = titleToSlug(source.title);
    lines.push(`  insert into historical_sources (source_type, title, publisher, author, publication_date, url, archive_reference, copyright_status, description, confidence, is_public) values ('${source.sourceType}', '${esc(source.title)}', ${nullable(source.publisher)}, ${nullable(source.author)}, ${nullable(source.publicationDate)}, ${nullable(source.url)}, ${nullable(source.archiveReference)}, ${nullable(source.copyrightStatus)}, '${esc(source.description)}', '${source.confidence}', true) returning id into src_${slug};`);
    lines.push(`  insert into entity_sources (entity_id, source_id, relationship_type) values ('${esc(draft.entityId)}', src_${slug}, 'evidence') on conflict do nothing;`);
  });
  draft.timeline.forEach((event, index) => {
    lines.push(`  insert into historical_events (entity_id, date, date_precision, title, description, event_type, confidence) values ('${esc(draft.entityId)}', '${esc(event.date)}', '${event.datePrecision}', '${esc(event.title)}', '${esc(event.description)}', '${esc(event.eventType)}', '${event.confidence}') returning id into ev_${index + 1};`);
  });
  if (draft.reconstruction) {
    lines.push(`  insert into reconstructions (entity_id, target_year, status, prompt, confidence) values ('${esc(draft.entityId)}', '${esc(draft.reconstruction.targetYear)}', '${draft.reconstruction.status}', ${nullable(draft.reconstruction.prompt)}, '${draft.reconstruction.confidence}') returning id into recon_id;`);
    draft.reconstruction.evidence.forEach((evidence) => {
      const sourceRef = evidence.sourceTitles[0] ? `src_${titleToSlug(evidence.sourceTitles[0])}` : 'null';
      lines.push(`  insert into reconstruction_evidence (reconstruction_id, source_id, label, description) values (recon_id, ${sourceRef}, '${evidence.label}', '${esc(evidence.description)}');`);
    });
  }
  lines.push('end $$;');
  return lines.join('
');
}

export async function submitEvidencePackage(draft: EvidencePackageDraft): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Supabase is not configured. Copy the SQL preview into an admin migration or seed file.' };
  return { ok: false, message: 'Evidence package submission is intentionally staged through reviewed SQL until source/event transaction RPC is deployed.' };
}
