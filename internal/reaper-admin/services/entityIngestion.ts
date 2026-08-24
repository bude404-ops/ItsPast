import { isSupabaseConfigured, supabaseConfig } from '../../src/lib/supabase';
import type { ConfidenceLevel, CurrentStatus, EntityType } from '../../src/types/entities';

export interface EntityIngestionDraft {
  name: string;
  entityType: EntityType;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  createdDate?: string;
  destroyedDate?: string;
  currentStatus: CurrentStatus;
  confidenceLevel: ConfidenceLevel;
}

export interface ValidationResult { valid: boolean; errors: string[]; draft?: EntityIngestionDraft; }

const entityTypes: EntityType[] = ['building','business','bridge','road','landmark','property','object','vehicle','infrastructure','landscape','neighborhood'];
const statuses: CurrentStatus[] = ['existing','demolished','renovated','replaced','changed','unknown'];
const confidences: ConfidenceLevel[] = ['CONFIRMED','HIGH','MEDIUM','LOW','SPECULATIVE'];

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const numberValue = (value: unknown) => typeof value === 'number' ? value : Number(value);

export function validateEntityDraft(input: unknown): ValidationResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { valid: false, errors: ['Draft must be a JSON object.'] };
  const latitude = numberValue(input.latitude);
  const longitude = numberValue(input.longitude);
  const entityType = text(input.entityType) as EntityType;
  const currentStatus = (text(input.currentStatus) || 'unknown') as CurrentStatus;
  const confidenceLevel = (text(input.confidenceLevel) || 'LOW') as ConfidenceLevel;
  const draft: EntityIngestionDraft = {
    name: text(input.name),
    entityType,
    description: text(input.description),
    latitude,
    longitude,
    address: text(input.address),
    createdDate: text(input.createdDate) || undefined,
    destroyedDate: text(input.destroyedDate) || undefined,
    currentStatus,
    confidenceLevel
  };
  if (!draft.name) errors.push('Name is required.');
  if (!draft.description) errors.push('Description is required.');
  if (!draft.address) errors.push('Address is required.');
  if (!entityTypes.includes(draft.entityType)) errors.push(`Entity type must be one of: ${entityTypes.join(', ')}.`);
  if (!statuses.includes(draft.currentStatus)) errors.push(`Status must be one of: ${statuses.join(', ')}.`);
  if (!confidences.includes(draft.confidenceLevel)) errors.push(`Confidence must be one of: ${confidences.join(', ')}.`);
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) errors.push('Latitude must be between -90 and 90.');
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) errors.push('Longitude must be between -180 and 180.');
  return { valid: errors.length === 0, errors, draft: errors.length ? undefined : draft };
}

export function draftToInsertPayload(draft: EntityIngestionDraft) {
  return {
    name: draft.name,
    description: draft.description,
    latitude: draft.latitude,
    longitude: draft.longitude,
    address: draft.address,
    created_date: draft.createdDate ?? null,
    destroyed_date: draft.destroyedDate ?? null,
    current_status: draft.currentStatus,
    confidence_level: draft.confidenceLevel,
    is_public: true
  };
}

export function draftToSeedSql(draft: EntityIngestionDraft): string {
  const esc = (value: string) => value.replaceAll("'", "''");
  const payload = draftToInsertPayload(draft);
  return `insert into physical_entities (name, description, latitude, longitude, address, created_date, destroyed_date, current_status, confidence_level, is_public) values ('${esc(payload.name)}', '${esc(payload.description)}', ${payload.latitude}, ${payload.longitude}, '${esc(payload.address)}', ${payload.created_date ? `'${esc(payload.created_date)}'` : 'null'}, ${payload.destroyed_date ? `'${esc(payload.destroyed_date)}'` : 'null'}, '${payload.current_status}', '${payload.confidence_level}', true);`;
}

export async function submitEntityDraft(draft: EntityIngestionDraft): Promise<{ ok: boolean; message: string }> {
  if (!isSupabaseConfigured) return { ok: false, message: 'Supabase is not configured. Copy the SQL preview into an admin migration or seed file.' };
  const response = await fetch(`${supabaseConfig.url}/rest/v1/physical_entities`, {
    method: 'POST',
    headers: { apikey: supabaseConfig.anonKey ?? '', Authorization: `Bearer ${supabaseConfig.anonKey ?? ''}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(draftToInsertPayload(draft))
  });
  if (!response.ok) return { ok: false, message: `Supabase rejected the insert with status ${response.status}. Admin role policies may not be active for this session.` };
  return { ok: true, message: 'Entity submitted to Supabase.' };
}
