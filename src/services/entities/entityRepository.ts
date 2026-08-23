import { demoEntities, demoReconstructions, demoSources, demoTimeline } from '../../data/demoEntities';
import { isSupabaseConfigured, supabaseConfig } from '../../lib/supabase';
import type { ConfidenceLevel, CurrentStatus, DatePrecision, EntityType, HistoricalSource, PhysicalEntity, ReconstructionRequest, SourceType, TimelineEvent } from '../../types/entities';

export interface EntityRepository {
  listEntities(): Promise<PhysicalEntity[]>;
  getEntity(id: string): Promise<PhysicalEntity | undefined>;
  getTimeline(entityId: string): Promise<TimelineEvent[]>;
  getSources(entity: PhysicalEntity): Promise<HistoricalSource[]>;
  getReconstruction(entityId: string): Promise<ReconstructionRequest | undefined>;
  search(query: string): Promise<PhysicalEntity[]>;
}

type EntityTypeRow = { slug?: string | null } | null;
interface PhysicalEntityRow { id: string; name: string; description: string | null; entity_type?: string | null; entity_types?: EntityTypeRow; latitude: number | null; longitude: number | null; address: string | null; created_date: string | null; destroyed_date: string | null; current_status: CurrentStatus | null; confidence_level: ConfidenceLevel | null; created_at: string; updated_at: string; }
interface HistoricalEventRow { id: string; entity_id: string; date: string | null; date_precision: DatePrecision | null; title: string; description: string | null; event_type: string | null; confidence: ConfidenceLevel | null; }
interface HistoricalSourceRow { id: string; source_type: SourceType; title: string; publisher: string | null; author: string | null; publication_date: string | null; url: string | null; archive_reference: string | null; copyright_status: string | null; description: string | null; confidence: ConfidenceLevel | null; }
interface EntitySourceRow { source_id: string; }
interface ReconstructionRow { id: string; entity_id: string; target_year: string; status: ReconstructionRequest['status']; prompt: string | null; confidence: ConfidenceLevel | null; }
interface ReconstructionEvidenceRow { id: string; source_id: string | null; label: ReconstructionRequest['evidence'][number]['label']; description: string; }

const entityTypes = new Set<EntityType>(['building','business','bridge','road','landmark','property','object','vehicle','infrastructure','landscape','neighborhood']);
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const withFallback = async <T>(operation: () => Promise<T>, fallback: () => Promise<T>) => {
  if (!isSupabaseConfigured) return fallback();
  try { return await operation(); } catch { return fallback(); }
};

function asEntityType(value: string | null | undefined): EntityType { return value && entityTypes.has(value as EntityType) ? value as EntityType : 'landmark'; }
function qualityFromConfidence(confidence: ConfidenceLevel): number { return { CONFIRMED: 98, HIGH: 86, MEDIUM: 68, LOW: 42, SPECULATIVE: 18 }[confidence]; }
export function mapPhysicalEntityRow(row: PhysicalEntityRow): PhysicalEntity {
  const confidence = row.confidence_level ?? 'LOW';
  const typeSlug = row.entity_types?.slug ?? row.entity_type;
  return {
    id: row.id,
    name: row.name,
    entityType: asEntityType(typeSlug),
    description: row.description ?? 'Verified public record with limited description.',
    location: { latitude: row.latitude ?? 0, longitude: row.longitude ?? 0, address: row.address ?? 'Unknown location' },
    createdDate: row.created_date ?? undefined,
    destroyedDate: row.destroyed_date ?? undefined,
    currentStatus: row.current_status ?? 'unknown',
    confidenceLevel: confidence,
    dataQuality: qualityFromConfidence(confidence),
    knownChanges: [],
    sourceIds: [],
    relatedEntityIds: [],
    demoData: false,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function mapHistoricalEventRow(row: HistoricalEventRow): TimelineEvent { return { id: row.id, entityId: row.entity_id, date: row.date ?? 'Unknown', datePrecision: row.date_precision ?? 'UNKNOWN', title: row.title, description: row.description ?? '', eventType: row.event_type ?? 'record', confidence: row.confidence ?? 'LOW', sourceIds: [] }; }
function mapHistoricalSourceRow(row: HistoricalSourceRow): HistoricalSource { return { id: row.id, sourceType: row.source_type, title: row.title, publisher: row.publisher ?? undefined, author: row.author ?? undefined, publicationDate: row.publication_date ?? undefined, url: row.url ?? undefined, archiveReference: row.archive_reference ?? undefined, copyrightStatus: row.copyright_status ?? undefined, description: row.description ?? '', confidence: row.confidence ?? 'LOW', demoData: false }; }

async function restFetch<T>(path: string): Promise<T> {
  const url = `${supabaseConfig.url}/rest/v1/${path}`;
  const response = await fetch(url, { headers: { apikey: supabaseConfig.anonKey ?? '', Authorization: `Bearer ${supabaseConfig.anonKey ?? ''}` } });
  if (!response.ok) throw new Error(`Supabase request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const demoEntityRepository: EntityRepository = {
  async listEntities() { return demoEntities; },
  async getEntity(id) { return demoEntities.find((entity) => entity.id === id); },
  async getTimeline(entityId) { return demoTimeline.filter((event) => event.entityId === entityId); },
  async getSources(entity) { return demoSources.filter((source) => entity.sourceIds.includes(source.id)); },
  async getReconstruction(entityId) { return demoReconstructions.find((request) => request.entityId === entityId); },
  async search(query) {
    const q = normalize(query);
    if (!q) return demoEntities;
    return demoEntities.filter((entity) => normalize([entity.name, entity.entityType, entity.description, entity.location.address, ...entity.knownChanges].join(' ')).includes(q));
  }
};

export const supabaseEntityRepository: EntityRepository = {
  async listEntities() {
    const rows = await restFetch<PhysicalEntityRow[]>('physical_entities?select=id,name,description,entity_type,entity_types(slug),latitude,longitude,address,created_date,destroyed_date,current_status,confidence_level,created_at,updated_at&is_public=eq.true&order=updated_at.desc');
    return rows.map(mapPhysicalEntityRow);
  },
  async getEntity(id) {
    const rows = await restFetch<PhysicalEntityRow[]>(`physical_entities?select=id,name,description,entity_type,entity_types(slug),latitude,longitude,address,created_date,destroyed_date,current_status,confidence_level,created_at,updated_at&id=eq.${encodeURIComponent(id)}&is_public=eq.true&limit=1`);
    return rows[0] ? mapPhysicalEntityRow(rows[0]) : undefined;
  },
  async getTimeline(entityId) {
    const rows = await restFetch<HistoricalEventRow[]>(`historical_events?select=id,entity_id,date,date_precision,title,description,event_type,confidence&entity_id=eq.${encodeURIComponent(entityId)}&order=date.asc`);
    return rows.map(mapHistoricalEventRow);
  },
  async getSources(entity) {
    const links = await restFetch<EntitySourceRow[]>(`entity_sources?select=source_id&entity_id=eq.${encodeURIComponent(entity.id)}`);
    const ids = links.map((link) => link.source_id);
    if (!ids.length) return [];
    const rows = await restFetch<HistoricalSourceRow[]>(`historical_sources?select=id,source_type,title,publisher,author,publication_date,url,archive_reference,copyright_status,description,confidence&id=in.(${ids.map(encodeURIComponent).join(',')})&is_public=eq.true`);
    return rows.map(mapHistoricalSourceRow);
  },
  async getReconstruction(entityId) {
    const rows = await restFetch<ReconstructionRow[]>(`reconstructions?select=id,entity_id,target_year,status,prompt,confidence&entity_id=eq.${encodeURIComponent(entityId)}&order=created_at.desc&limit=1`);
    const row = rows[0];
    if (!row) return undefined;
    const evidenceRows = await restFetch<ReconstructionEvidenceRow[]>(`reconstruction_evidence?select=id,source_id,label,description&reconstruction_id=eq.${encodeURIComponent(row.id)}`);
    return { id: row.id, entityId: row.entity_id, targetYear: row.target_year, status: row.status, prompt: row.prompt ?? undefined, confidence: row.confidence ?? 'SPECULATIVE', evidence: evidenceRows.map((evidence) => ({ id: evidence.id, label: evidence.label, description: evidence.description, sourceIds: evidence.source_id ? [evidence.source_id] : [] })) };
  },
  async search(query) {
    const q = normalize(query);
    if (!q) return this.listEntities();
    const rows = await restFetch<PhysicalEntityRow[]>(`physical_entities?select=id,name,description,entity_type,entity_types(slug),latitude,longitude,address,created_date,destroyed_date,current_status,confidence_level,created_at,updated_at&or=(name.ilike.*${encodeURIComponent(q)}*,description.ilike.*${encodeURIComponent(q)}*,address.ilike.*${encodeURIComponent(q)}*)&is_public=eq.true&limit=50`);
    return rows.map(mapPhysicalEntityRow);
  }
};

export const entityRepository: EntityRepository = {
  listEntities: () => withFallback(() => supabaseEntityRepository.listEntities(), () => demoEntityRepository.listEntities()),
  getEntity: (id) => withFallback(() => supabaseEntityRepository.getEntity(id), () => demoEntityRepository.getEntity(id)),
  getTimeline: (entityId) => withFallback(() => supabaseEntityRepository.getTimeline(entityId), () => demoEntityRepository.getTimeline(entityId)),
  getSources: (entity) => withFallback(() => supabaseEntityRepository.getSources(entity), () => demoEntityRepository.getSources(entity)),
  getReconstruction: (entityId) => withFallback(() => supabaseEntityRepository.getReconstruction(entityId), () => demoEntityRepository.getReconstruction(entityId)),
  search: (query) => withFallback(() => supabaseEntityRepository.search(query), () => demoEntityRepository.search(query))
};
