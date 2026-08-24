import type { ResearchQueryInput, SourceFetchRequest, SourceProvider, SourceRecord, SourceSearch } from '../../../types/research';
import { buildProviderSearches } from '../SourceSearch';
import { normalizeGenericSource } from '../SourceNormalizer';
import { naraProviderConfig } from './providerConfigs';

const apiKey = () => import.meta.env.VITE_NARA_API_KEY ?? '';
export const nationalArchivesProvider: SourceProvider = {
  config: naraProviderConfig,
  isConfigured: () => Boolean(apiKey()),
  buildSearches: (input: ResearchQueryInput) => buildProviderSearches(naraProviderConfig.id, input),
  async search(search: SourceSearch): Promise<SourceRecord[]> {
    if (!nationalArchivesProvider.isConfigured()) return [];
    const url = `${naraProviderConfig.apiEndpoint}?q=${encodeURIComponent(search.query)}&limit=${search.limit}`;
    const response = await fetch(url, { headers: { 'x-api-key': apiKey() } });
    if (!response.ok) throw new Error(`National Archives search failed: ${response.status}`);
    const payload = await response.json() as { body?: { hits?: { hits?: { _id?: string; _source?: Record<string, unknown> }[] } } };
    return (payload.body?.hits?.hits ?? []).map((hit) => normalizeGenericSource(naraProviderConfig, { id: hit._id, ...(hit._source ?? {}), copyright_status: 'UNKNOWN' }));
  },
  async fetch(request: SourceFetchRequest): Promise<SourceRecord | undefined> {
    if (!nationalArchivesProvider.isConfigured()) return undefined;
    const response = await fetch(`${naraProviderConfig.apiEndpoint}?naIds=${encodeURIComponent(request.externalId)}&limit=1`, { headers: { 'x-api-key': apiKey() } });
    if (!response.ok) throw new Error(`National Archives fetch failed: ${response.status}`);
    const payload = await response.json() as { body?: { hits?: { hits?: { _id?: string; _source?: Record<string, unknown> }[] } } };
    const hit = payload.body?.hits?.hits?.[0];
    return hit ? normalizeGenericSource(naraProviderConfig, { id: hit._id, ...(hit._source ?? {}) }) : undefined;
  },
  normalize: (raw: unknown) => normalizeGenericSource(naraProviderConfig, raw as Record<string, unknown>)
};
