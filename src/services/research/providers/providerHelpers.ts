import type { ProviderMetadata, ResearchQueryInput, SourceFetchRequest, SourceMediaRequest, SourceProvider, SourceProviderConfig, SourceRecord, SourceSearch } from '../../../types/research';
import { buildProviderSearches } from '../SourceSearch';
import { normalizeGenericSource } from '../SourceNormalizer';
import { fetchJson } from '../runtime/HttpClient';

export const text = (value: unknown): string | undefined => typeof value === 'string' && value.trim() ? value : undefined;
export const arrayText = (value: unknown): string | undefined => Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean).join('; ') : text(value);
export const first = (value: unknown): unknown => Array.isArray(value) ? value[0] : value;

export function jsonProvider(config: SourceProviderConfig, searcher: (search: SourceSearch) => Promise<SourceRecord[]>, fetcher?: (request: SourceFetchRequest) => Promise<SourceRecord | undefined>): SourceProvider {
  return {
    config,
    isConfigured: () => config.accessClassification === 'NO_KEY_REQUIRED' && config.enabled && !config.requiresApiKey,
    buildSearches: (input: ResearchQueryInput) => buildProviderSearches(config.id, input, 8),
    search: searcher,
    fetch: fetcher ?? (async (request) => normalizeGenericSource(config, { id: request.externalId, title: request.externalId, url: request.sourceUrl, rights: config.license, type: config.sourceType })),
    normalize: (raw: unknown) => normalizeGenericSource(config, raw as Record<string, unknown>),
    getRecord(request: SourceFetchRequest) { return this.fetch(request); },
    getMedia(request: SourceMediaRequest) { return this.search({ providerId: config.id, query: request.query ?? request.externalId ?? '', searchType: 'IMAGE', limit: request.limit ?? 8 }); },
    getMetadata(): ProviderMetadata { return { provider: config, notes: [config.rateLimit, config.license ?? 'License varies by item.'] }; },
    findByName(input: ResearchQueryInput) { return this.search({ providerId: config.id, query: input.entityName ?? input.keywords?.[0] ?? '', searchType: 'TEXT', limit: 8 }); },
    findByDate(input: ResearchQueryInput) { return this.search({ providerId: config.id, query: [input.entityName, input.dateRange?.start, input.dateRange?.end].filter(Boolean).join(' '), searchType: 'TEXT', limit: 8 }); },
    findByLocation(input: ResearchQueryInput) { return this.search({ providerId: config.id, query: input.location ?? input.entityName ?? '', searchType: 'TEXT', limit: 8 }); },
    findNearby(input: ResearchQueryInput) { return this.findByLocation ? this.findByLocation(input) : Promise.resolve([]); },
    getLicense(record?: SourceRecord) { return record?.license ?? config.license ?? 'UNKNOWN'; },
    getAttribution(record?: SourceRecord) { return record?.attribution ?? config.name; }
  };
}

export async function apiJson<T>(config: SourceProviderConfig, url: string): Promise<T> { return fetchJson<T>({ providerId: config.id, url }); }
