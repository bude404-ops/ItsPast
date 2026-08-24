import type { ResearchQueryInput, SourceFetchRequest, SourceProvider, SourceRecord, SourceSearch } from '../../../types/research';
import { naraProviderConfig } from './providerConfigs';

export const nationalArchivesProvider: SourceProvider = {
  config: naraProviderConfig,
  isConfigured: () => false,
  buildSearches: (_input: ResearchQueryInput): SourceSearch[] => [],
  async search(_search: SourceSearch): Promise<SourceRecord[]> { return []; },
  async fetch(_request: SourceFetchRequest): Promise<SourceRecord | undefined> { return undefined; },
  normalize(raw: unknown): SourceRecord { throw new Error(`National Archives is excluded from no-key mode until optional key support is explicitly enabled: ${JSON.stringify(raw).slice(0, 80)}`); }
};
