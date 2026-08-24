import type { SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { openStreetMapProviderConfig as config } from './providerConfigs';
import { fetchJson } from '../runtime/HttpClient';
import { osmNominatimPolicy } from '../runtime/RateLimiter';
import { jsonProvider } from './providerHelpers';

interface NominatimItem { osm_id?: number; osm_type?: string; display_name?: string; type?: string; category?: string; lat?: string; lon?: string; licence?: string; }
export function normalizeOpenStreetMapItem(item: NominatimItem): SourceRecord { return normalizeGenericSource(config, { id: `${item.osm_type ?? 'osm'}-${item.osm_id ?? item.display_name}`, title: item.display_name, description: `${item.category ?? 'place'} ${item.type ?? ''}`.trim(), latitude: item.lat, longitude: item.lon, url: item.osm_id ? `${config.baseUrl}/${item.osm_type}/${item.osm_id}` : config.baseUrl, rights: item.licence ?? '© OpenStreetMap contributors, ODbL 1.0', license: 'ODbL 1.0', type: 'map/current geography', raw: item }); }
async function search(search: SourceSearch): Promise<SourceRecord[]> { const params = new URLSearchParams({ format: 'jsonv2', limit: String(Math.min(search.limit, 5)), q: search.query }); const payload = await fetchJson<NominatimItem[]>({ providerId: config.id, url: `${config.apiEndpoint}?${params.toString()}`, policy: osmNominatimPolicy, cacheTtlMs: 7 * 24 * 60 * 60 * 1000 }); return payload.map(normalizeOpenStreetMapItem); }
export const openStreetMapProvider = jsonProvider(config, search);
