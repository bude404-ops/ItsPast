import type { SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { internetArchiveProviderConfig as config } from './providerConfigs';
import { apiJson, arrayText, jsonProvider } from './providerHelpers';

interface IaDoc { identifier?: string; title?: string; description?: string | string[]; date?: string; creator?: string | string[]; mediatype?: string; licenseurl?: string; rights?: string; publicdate?: string; }
interface IaPayload { response?: { docs?: IaDoc[] }; }
const iaQuery = (query: string) => `(${query}) AND mediatype:(texts OR image OR collection)`;
export function normalizeInternetArchiveDoc(doc: IaDoc): SourceRecord { const id = doc.identifier ?? doc.title ?? 'unknown'; return normalizeGenericSource(config, { id, title: doc.title ?? id, description: arrayText(doc.description) ?? doc.title, date: doc.date ?? doc.publicdate, creator: arrayText(doc.creator), publisher: 'Internet Archive', url: `${config.baseUrl}/details/${id}`, rights: doc.licenseurl ?? doc.rights ?? 'Mixed item rights; review item before copying media', license: doc.licenseurl ?? doc.rights, format: doc.mediatype ?? 'archive', raw: doc }); }
async function search(search: SourceSearch): Promise<SourceRecord[]> { const params = new URLSearchParams({ q: iaQuery(search.query), 'fl[]': 'identifier,title,description,date,creator,mediatype,licenseurl,rights,publicdate', rows: String(search.limit), page: '1', output: 'json' }); const payload = await apiJson<IaPayload>(config, `${config.apiEndpoint}?${params.toString()}`); return (payload.response?.docs ?? []).map(normalizeInternetArchiveDoc); }
export const internetArchiveProvider = jsonProvider(config, search);
