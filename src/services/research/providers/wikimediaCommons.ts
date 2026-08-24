import type { SourceRecord, SourceSearch } from '../../../types/research';
import { normalizeGenericSource } from '../SourceNormalizer';
import { wikimediaCommonsProviderConfig as config } from './providerConfigs';
import { apiJson, jsonProvider } from './providerHelpers';

type Ext = Record<string, { value?: string }>;
interface ImageInfo { url?: string; thumburl?: string; extmetadata?: Ext; }
interface Page { pageid?: number; title?: string; imageinfo?: ImageInfo[]; }
interface CommonsPayload { query?: { pages?: Record<string, Page> }; }
const clean = (html?: string) => html?.replace(/<[^>]+>/g, '').trim();
export function normalizeCommonsPage(page: Page): SourceRecord {
  const info = page.imageinfo?.[0] ?? {};
  const meta = info.extmetadata ?? {};
  const license = clean(meta.LicenseShortName?.value) ?? clean(meta.UsageTerms?.value) ?? 'UNKNOWN';
  return normalizeGenericSource(config, { id: String(page.pageid ?? page.title), title: page.title, description: clean(meta.ImageDescription?.value) ?? page.title, date: clean(meta.DateTimeOriginal?.value) ?? clean(meta.DateTime?.value), creator: clean(meta.Artist?.value), attribution: clean(meta.Credit?.value) ?? clean(meta.Attribution?.value), license, rights: license, url: info.url, image_url: info.thumburl ?? info.url, format: 'photograph', raw: page });
}
async function search(search: SourceSearch): Promise<SourceRecord[]> {
  const params = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: search.query, gsrlimit: String(search.limit), prop: 'imageinfo', iiprop: 'url|extmetadata', iiurlwidth: '1200', format: 'json', origin: '*' });
  const payload = await apiJson<CommonsPayload>(config, `${config.apiEndpoint}?${params.toString()}`);
  return Object.values(payload.query?.pages ?? {}).map(normalizeCommonsPage);
}
export const wikimediaCommonsProvider = jsonProvider(config, search);
