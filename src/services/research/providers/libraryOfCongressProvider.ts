import type { ResearchQueryInput, SourceFetchRequest, SourceProvider, SourceRecord, SourceSearch } from '../../../types/research';
import { buildProviderSearches } from '../SourceSearch';
import { normalizeGenericSource } from '../SourceNormalizer';
import { libraryOfCongressProviderConfig } from './providerConfigs';

export const libraryOfCongressProvider: SourceProvider = {
  config: libraryOfCongressProviderConfig,
  isConfigured: () => true,
  buildSearches: (input: ResearchQueryInput) => buildProviderSearches(libraryOfCongressProviderConfig.id, input),
  async search(search: SourceSearch): Promise<SourceRecord[]> {
    const url = `${libraryOfCongressProviderConfig.apiEndpoint}?fo=json&c=${search.limit}&q=${encodeURIComponent(search.query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Library of Congress search failed: ${response.status}`);
    const payload = await response.json() as { results?: Record<string, unknown>[] };
    return (payload.results ?? []).map((item) => {
      const itemUrl = typeof item.url === 'string' ? item.url : typeof item.item === 'string' ? item.item : undefined;
      return normalizeGenericSource(libraryOfCongressProviderConfig, { ...item, url: itemUrl });
    });
  },
  async fetch(request: SourceFetchRequest): Promise<SourceRecord | undefined> {
    if (!request.sourceUrl) return undefined;
    const response = await fetch(`${request.sourceUrl}${request.sourceUrl.includes('?') ? '&' : '?'}fo=json`);
    if (!response.ok) throw new Error(`Library of Congress fetch failed: ${response.status}`);
    return normalizeGenericSource(libraryOfCongressProviderConfig, await response.json() as Record<string, unknown>);
  },
  normalize: (raw: unknown) => normalizeGenericSource(libraryOfCongressProviderConfig, raw as Record<string, unknown>)
};
