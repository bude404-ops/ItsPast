import type { SourceFetchRequest, SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { libraryOfCongressProviderConfig as config } from './providerConfigs';
import { apiJson, arrayText, first, jsonProvider, text } from './providerHelpers';

interface LocSearchPayload { results?: Record<string, unknown>[]; item?: Record<string, unknown>; }
const endpointFor = (search: SourceSearch): string => search.searchType === 'MAP' ? 'maps' : search.searchType === 'IMAGE' ? 'photos' : 'search';
export function normalizeLibraryOfCongressItem(item: Record<string, unknown>): SourceRecord {
  const image = first(item.image_url) ?? first(item.imageUrl) ?? first(item.image);
  return normalizeGenericSource(config, {
    id: text(item.id) ?? text(item.item) ?? text(item.url),
    title: arrayText(item.title),
    description: arrayText(item.description) ?? arrayText(item.subject),
    date: arrayText(item.date),
    location: arrayText(item.location),
    url: text(item.url) ?? text(item.item),
    image_url: image,
    creator: arrayText(item.contributor) ?? arrayText(item.creator),
    publisher: arrayText(item.partof) ?? 'Library of Congress',
    rights: arrayText(item.rights) ?? arrayText(item.access_restricted) ?? 'Check item rights statement',
    format: item.original_format ?? item.type ?? item.format,
    raw: item
  });
}
async function search(search: SourceSearch): Promise<SourceRecord[]> {
  const endpoint = endpointFor(search);
  const url = `${config.baseUrl}/${endpoint}/?fo=json&c=${search.limit}&q=${encodeURIComponent(search.query)}`;
  const payload = await apiJson<LocSearchPayload>(config, url);
  return (payload.results ?? []).map(normalizeLibraryOfCongressItem);
}
async function fetchRecord(request: SourceFetchRequest): Promise<SourceRecord | undefined> {
  if (!request.sourceUrl) return undefined;
  const payload = await apiJson<LocSearchPayload>(config, `${request.sourceUrl}${request.sourceUrl.includes('?') ? '&' : '?'}fo=json`);
  return normalizeLibraryOfCongressItem(payload.item ?? payload as unknown as Record<string, unknown>);
}
export const libraryOfCongressProvider = jsonProvider(config, search, fetchRecord);
