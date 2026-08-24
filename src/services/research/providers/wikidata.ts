import type { ResearchQueryInput, SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { wikidataProviderConfig as config } from './providerConfigs';
import { apiJson, jsonProvider, text } from './providerHelpers';

interface Binding { item?: { value?: string }; itemLabel?: { value?: string }; coord?: { value?: string }; inception?: { value?: string }; typeLabel?: { value?: string }; }
interface SparqlPayload { results?: { bindings?: Binding[] }; }
const sanitize = (value: string) => value.replace(/["\\]/g, ' ').trim();
function sparqlFor(search: SourceSearch): string {
  const query = sanitize(search.query);
  if (search.searchType === 'COORDINATE' || /^-?\d+(\.\d+)?[, ]+-?\d+(\.\d+)?/.test(query)) return `SELECT ?item ?itemLabel ?coord WHERE { ?item wdt:P625 ?coord. SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT ${search.limit}`;
  return `SELECT ?item ?itemLabel ?coord ?inception ?typeLabel WHERE { ?item rdfs:label ?itemLabel. FILTER(LANG(?itemLabel) = "en" && CONTAINS(LCASE(STR(?itemLabel)), LCASE("${query}"))) OPTIONAL { ?item wdt:P625 ?coord. } OPTIONAL { ?item wdt:P571 ?inception. } OPTIONAL { ?item wdt:P31 ?type. ?type rdfs:label ?typeLabel FILTER(LANG(?typeLabel) = "en") } SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT ${search.limit}`;
}
const coordParts = (coord?: string): { latitude?: number; longitude?: number } => {
  const match = coord?.match(/Point\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)/);
  return match ? { longitude: Number(match[1]), latitude: Number(match[2]) } : {};
};
export function normalizeWikidataBinding(binding: Binding): SourceRecord {
  const url = text(binding.item?.value);
  const coords = coordParts(binding.coord?.value);
  return normalizeGenericSource(config, { id: url?.split('/').pop() ?? url, title: binding.itemLabel?.value, description: binding.typeLabel?.value ?? 'Wikidata entity', date: binding.inception?.value?.slice(0, 10), url, latitude: coords.latitude, longitude: coords.longitude, rights: 'CC0; attribution requested by Wikidata norms', type: 'structured data', raw: binding });
}
async function search(search: SourceSearch): Promise<SourceRecord[]> { const payload = await apiJson<SparqlPayload>(config, `${config.apiEndpoint}?format=json&query=${encodeURIComponent(sparqlFor(search))}`); return (payload.results?.bindings ?? []).map(normalizeWikidataBinding); }
export const wikidataProvider = { ...jsonProvider(config, search), buildSearches(input: ResearchQueryInput) { return [{ providerId: config.id, query: input.entityName ?? input.location ?? input.keywords?.[0] ?? '', searchType: 'ENTITY' as const, limit: 10 }]; } };
