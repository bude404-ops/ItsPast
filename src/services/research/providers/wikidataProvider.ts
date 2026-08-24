import type { ResearchQueryInput, SourceFetchRequest, SourceProvider, SourceRecord, SourceSearch } from '../../../types/research';
import { buildProviderSearches } from '../SourceSearch';
import { normalizeGenericSource } from '../SourceNormalizer';
import { wikidataProviderConfig } from './providerConfigs';

export const wikidataProvider: SourceProvider = {
  config: wikidataProviderConfig,
  isConfigured: () => true,
  buildSearches: (input: ResearchQueryInput) => buildProviderSearches(wikidataProviderConfig.id, input, 5),
  async search(search: SourceSearch): Promise<SourceRecord[]> {
    const sparql = `SELECT ?item ?itemLabel WHERE { ?item rdfs:label "${search.query.replace(/"/g, '')}"@en. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT ${search.limit}`;
    const response = await fetch(`${import.meta.env.VITE_WIKIDATA_ENDPOINT ?? wikidataProviderConfig.apiEndpoint}?query=${encodeURIComponent(sparql)}&format=json`);
    if (!response.ok) throw new Error(`Wikidata search failed: ${response.status}`);
    const payload = await response.json() as { results?: { bindings?: { item?: { value?: string }; itemLabel?: { value?: string } }[] } };
    return (payload.results?.bindings ?? []).map((binding) => normalizeGenericSource(wikidataProviderConfig, { id: binding.item?.value, title: binding.itemLabel?.value, url: binding.item?.value, type: 'structured data', rights: 'CC0 / see Wikidata terms' }));
  },
  async fetch(request: SourceFetchRequest): Promise<SourceRecord | undefined> {
    return normalizeGenericSource(wikidataProviderConfig, { id: request.externalId, title: request.externalId, url: request.sourceUrl, type: 'structured data', rights: 'CC0 / see Wikidata terms' });
  },
  normalize: (raw: unknown) => normalizeGenericSource(wikidataProviderConfig, raw as Record<string, unknown>)
};
