import type { MediaLicenseClass, SourceProviderConfig, SourceProvenance, SourceRecord } from '../../types/research';
import type { ConfidenceLevel, SourceType } from '../../types/entities';

const nowIso = () => new Date('2026-01-01T00:00:00.000Z').toISOString();

const read = (raw: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) return value;
    if (Array.isArray(value) && value.length > 0) return String(value[0]);
  }
  return undefined;
};

export function classifyLicense(value?: string): MediaLicenseClass {
  const lower = (value ?? '').toLowerCase();
  if (!lower) return 'UNKNOWN';
  if (lower.includes('public domain') || lower.includes('no known restrictions')) return 'PUBLIC_DOMAIN';
  if (lower.includes('cc0')) return 'CC0';
  if (lower.includes('cc by-sa') || lower.includes('cc-by-sa')) return 'CC_BY_SA';
  if (lower.includes('cc by') || lower.includes('cc-by')) return 'CC_BY';
  if (lower.includes('odbl') || lower.includes('open data') || lower.includes('open license')) return 'OTHER_OPEN_LICENSE';
  if (lower.includes('rights reserved') || lower.includes('copyright') || lower.includes('restricted')) return 'RESTRICTED';
  return 'UNKNOWN';
}

const canStoreMedia = (licenseClass: MediaLicenseClass): boolean | 'UNKNOWN' => {
  if (['PUBLIC_DOMAIN', 'CC0', 'CC_BY', 'CC_BY_SA', 'OTHER_OPEN_LICENSE'].includes(licenseClass)) return true;
  if (licenseClass === 'RESTRICTED') return false;
  return 'UNKNOWN';
};

export const canUseForAiProcessing = (licenseClass: MediaLicenseClass): boolean | 'UNKNOWN' => {
  if (licenseClass === 'PUBLIC_DOMAIN' || licenseClass === 'CC0') return true;
  if (licenseClass === 'RESTRICTED') return false;
  return 'UNKNOWN';
};

const sourceTypeFromFormat = (value: string): SourceType => {
  const lower = value.toLowerCase();
  if (lower.includes('photo') || lower.includes('image') || lower.includes('file')) return 'PHOTOGRAPH';
  if (lower.includes('map') || lower.includes('cartographic')) return 'MAP';
  if (lower.includes('newspaper') || lower.includes('periodical')) return 'NEWSPAPER';
  if (lower.includes('book') || lower.includes('text')) return 'BOOK';
  if (lower.includes('government')) return 'GOVERNMENT';
  if (lower.includes('library')) return 'LIBRARY';
  return 'ARCHIVE';
};

export function normalizeGenericSource(provider: SourceProviderConfig, raw: Record<string, unknown>): SourceRecord {
  const title = read(raw, ['title', 'label', 'name', 'display_name']) ?? 'UNKNOWN';
  const externalId = read(raw, ['id', 'identifier', 'pageid', 'item', 'url']) ?? title;
  const format = Array.isArray(raw.format) ? String(raw.format[0] ?? '') : String(raw.format ?? raw.type ?? raw.mediatype ?? provider.sourceType ?? '');
  const sourceUrl = read(raw, ['url', 'sourceUrl', 'item_url', 'canonicalurl']);
  const mediaUrl = read(raw, ['image_url', 'media_url', 'thumburl', 'url_original']);
  const license = read(raw, ['license', 'rights', 'copyright_status', 'copyrightStatus']) ?? provider.license;
  const licenseClass = classifyLicense(license);
  const retrievedAt = nowIso();
  const confidence = (raw.confidence === 'HIGH' || raw.confidence === 'MEDIUM' || raw.confidence === 'LOW' || raw.confidence === 'CONFIRMED' || raw.confidence === 'SPECULATIVE') ? raw.confidence as ConfidenceLevel : 'UNKNOWN';
  const provenance: SourceProvenance = { sourceProvider: provider.id, sourceId: externalId, sourceUrl, retrievedAt, license, creator: read(raw, ['creator', 'author', 'artist']), publicationDate: read(raw, ['date', 'publication_date', 'year']), evidenceType: mediaUrl ? 'MEDIA' : 'SOURCE_RECORD', confidence };
  return {
    id: `${provider.id}:${externalId}`.replace(/[^a-zA-Z0-9:_-]/g, '-'),
    providerId: provider.id,
    externalId,
    title,
    description: read(raw, ['description', 'snippet', 'extract', 'notes', 'display_name']) ?? 'UNKNOWN',
    date: read(raw, ['date', 'publication_date', 'year']),
    location: read(raw, ['location', 'place', 'display_name']),
    latitude: typeof raw.latitude === 'number' ? raw.latitude : typeof raw.lat === 'string' ? Number(raw.lat) : undefined,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : typeof raw.lon === 'string' ? Number(raw.lon) : undefined,
    author: read(raw, ['author', 'creator', 'artist']),
    publisher: read(raw, ['publisher', 'repository', 'institution']),
    sourceUrl,
    mediaUrl,
    license,
    licenseClass,
    attribution: read(raw, ['attribution', 'creditline', 'artist']) ?? (provider.attributionRequired ? provider.name : undefined),
    copyrightStatus: read(raw, ['rights', 'copyright_status', 'copyrightStatus']) ?? 'UNKNOWN',
    sourceType: sourceTypeFromFormat(format),
    rawMetadata: raw,
    provenance,
    canStoreMetadata: true,
    canStoreMedia: canStoreMedia(licenseClass),
    canUseForAiProcessing: canUseForAiProcessing(licenseClass),
    createdAt: retrievedAt,
    updatedAt: retrievedAt
  };
}
