import type { SourceProviderConfig, SourceRecord } from '../../types/research';
import type { SourceType } from '../../types/entities';

const nowIso = () => new Date('2026-01-01T00:00:00.000Z').toISOString();
const sourceTypeFromFormat = (value: string): SourceType => {
  const lower = value.toLowerCase();
  if (lower.includes('photo') || lower.includes('image')) return 'PHOTOGRAPH';
  if (lower.includes('map')) return 'MAP';
  if (lower.includes('newspaper')) return 'NEWSPAPER';
  if (lower.includes('book')) return 'BOOK';
  return 'ARCHIVE';
};

export function normalizeGenericSource(provider: SourceProviderConfig, raw: Record<string, unknown>): SourceRecord {
  const title = String(raw.title ?? raw.name ?? 'UNKNOWN');
  const externalId = String(raw.id ?? raw.identifier ?? raw.url ?? title);
  const format = Array.isArray(raw.format) ? String(raw.format[0] ?? '') : String(raw.format ?? raw.type ?? '');
  return {
    id: `${provider.id}:${externalId}`.replace(/[^a-zA-Z0-9:_-]/g, '-'),
    providerId: provider.id,
    externalId,
    title,
    description: String(raw.description ?? raw.notes ?? 'UNKNOWN'),
    date: raw.date ? String(raw.date) : undefined,
    location: raw.location ? String(raw.location) : undefined,
    latitude: typeof raw.latitude === 'number' ? raw.latitude : undefined,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : undefined,
    author: raw.author ? String(raw.author) : undefined,
    publisher: raw.publisher ? String(raw.publisher) : undefined,
    sourceUrl: raw.url ? String(raw.url) : undefined,
    mediaUrl: raw.image_url ? String(raw.image_url) : raw.media_url ? String(raw.media_url) : undefined,
    license: raw.license ? String(raw.license) : undefined,
    copyrightStatus: raw.rights ? String(raw.rights) : raw.copyright_status ? String(raw.copyright_status) : 'UNKNOWN',
    sourceType: sourceTypeFromFormat(format),
    rawMetadata: raw,
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
}
