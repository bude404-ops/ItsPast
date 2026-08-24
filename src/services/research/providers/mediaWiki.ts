import type { SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { mediaWikiProviderConfig as config } from './providerConfigs';
import { apiJson, jsonProvider } from './providerHelpers';

interface SearchItem { pageid: number; title: string; snippet?: string; timestamp?: string; }
interface SearchPayload { query?: { search?: SearchItem[] }; }
const strip = (value?: string) => value?.replace(/<[^>]+>/g, '').trim();
export function normalizeMediaWikiSearch(item: SearchItem): SourceRecord { return normalizeGenericSource(config, { id: String(item.pageid), title: item.title, description: strip(item.snippet) ?? 'Wikipedia context/discovery result', date: item.timestamp?.slice(0, 10), url: `${config.baseUrl}/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`, rights: 'CC BY-SA; discovery/context only, not definitive evidence', type: 'encyclopedia', raw: item }); }
async function search(search: SourceSearch): Promise<SourceRecord[]> { const params = new URLSearchParams({ action: 'query', list: 'search', srsearch: search.query, srlimit: String(search.limit), format: 'json', origin: '*' }); const payload = await apiJson<SearchPayload>(config, `${config.apiEndpoint}?${params.toString()}`); return (payload.query?.search ?? []).map(normalizeMediaWikiSearch); }
export const mediaWikiProvider = jsonProvider(config, search);
