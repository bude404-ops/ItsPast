import type { SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { chroniclingAmericaProviderConfig as config } from './providerConfigs';
import { apiJson, arrayText, first, jsonProvider, text } from './providerHelpers';

interface LocCollectionPayload { results?: Record<string, unknown>[]; }
export function normalizeChroniclingAmericaItem(item: Record<string, unknown>): SourceRecord {
  return normalizeGenericSource(config, {
    id: text(item.id) ?? text(item.url), title: arrayText(item.title), description: arrayText(item.description) ?? arrayText(item.subject), date: arrayText(item.date), url: text(item.url), image_url: first(item.image_url), creator: arrayText(item.contributor), publisher: 'Library of Congress / Chronicling America', rights: arrayText(item.rights) ?? 'Mixed newspaper rights; metadata/snippets only until reviewed', format: 'newspaper', raw: item
  });
}
async function search(search: SourceSearch): Promise<SourceRecord[]> {
  const url = `${config.apiEndpoint}?fo=json&c=${search.limit}&q=${encodeURIComponent(search.query)}`;
  const payload = await apiJson<LocCollectionPayload>(config, url);
  return (payload.results ?? []).map(normalizeChroniclingAmericaItem);
}
export const chroniclingAmericaProvider = jsonProvider(config, search);
