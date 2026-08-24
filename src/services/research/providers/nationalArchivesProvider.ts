import type { SourceProvider, SourceRecord, SourceSearch } from '../../../types/research';
import { naraProviderConfig } from './providerConfigs';

export const nationalArchivesProvider: SourceProvider = {
  config: naraProviderConfig,
  isConfigured: () => false,
  buildSearches: (): SourceSearch[] => [],
  async search(): Promise<SourceRecord[]> { return []; },
  async fetch(): Promise<SourceRecord | undefined> { return undefined; },
  normalize(raw: unknown): SourceRecord { throw new Error(`National Archives is excluded from no-key mode until optional key support is explicitly enabled: ${JSON.stringify(raw).slice(0, 80)}`); }
};
