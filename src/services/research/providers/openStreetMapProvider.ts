import type { ResearchQueryInput, SourceFetchRequest, SourceProvider, SourceRecord, SourceSearch } from '../../../types/research';
import { buildProviderSearches } from '../SourceSearch';
import { normalizeGenericSource } from '../SourceNormalizer';
import { openStreetMapProviderConfig } from './providerConfigs';

export const openStreetMapProvider: SourceProvider = {
  config: openStreetMapProviderConfig,
  isConfigured: () => true,
  buildSearches: (input: ResearchQueryInput) => buildProviderSearches(openStreetMapProviderConfig.id, input, 5),
  async search(search: SourceSearch): Promise<SourceRecord[]> {
    const response = await fetch(`${openStreetMapProviderConfig.apiEndpoint}?format=jsonv2&limit=${search.limit}&q=${encodeURIComponent(search.query)}`);
    if (!response.ok) throw new Error(`OpenStreetMap search failed: ${response.status}`);
    const payload = await response.json() as Record<string, unknown>[];
    return payload.map((item) => {
      const latitude = Number(item.lat);
      const longitude = Number(item.lon);
      return normalizeGenericSource(openStreetMapProviderConfig, { id: item.osm_id, title: item.display_name, description: item.type, latitude: Number.isFinite(latitude) ? latitude : undefined, longitude: Number.isFinite(longitude) ? longitude : undefined, url: item.licence ? openStreetMapProviderConfig.baseUrl : undefined, rights: item.licence, type: 'place' });
    });
  },
  async fetch(request: SourceFetchRequest): Promise<SourceRecord | undefined> {
    return normalizeGenericSource(openStreetMapProviderConfig, { id: request.externalId, title: request.externalId, url: request.sourceUrl, rights: 'OpenStreetMap contributors' });
  },
  normalize: (raw: unknown) => normalizeGenericSource(openStreetMapProviderConfig, raw as Record<string, unknown>)
};
