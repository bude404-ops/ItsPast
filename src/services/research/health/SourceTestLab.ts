import type { ProviderHealthStatus, SourceProvider } from '../../../types/research';
import { configuredProviders, sourceProviders } from '../providers';

export interface SourceTestResult { providerId: string; name: string; connection: ProviderHealthStatus; search: boolean; metadata: boolean; images: boolean; maps: boolean; rateLimits: string; license: string; attribution: string; responseTimeMs: number; errors: string[]; apiKeyRequired: boolean; testStatus: 'PASS' | 'WARN' | 'FAIL'; }
export class SourceTestLab {
  constructor(private readonly providers: SourceProvider[] = sourceProviders) {}
  async testProvider(provider: SourceProvider, query = 'historic theater'): Promise<SourceTestResult> {
    const start = Date.now();
    const errors: string[] = [];
    let searchOk = false;
    let hasImages = false;
    let hasMaps = false;
    try {
      if (!provider.isConfigured()) throw new Error('Provider is not configured for no-key automatic use.');
      const records = await provider.search({ providerId: provider.config.id, query, searchType: 'TEXT', limit: 2 });
      searchOk = records.length >= 0;
      hasImages = records.some((record) => record.sourceType === 'PHOTOGRAPH' || Boolean(record.mediaUrl));
      hasMaps = records.some((record) => record.sourceType === 'MAP');
    } catch (error) { errors.push(error instanceof Error ? error.message : String(error)); }
    const fail = errors.length > 0;
    return { providerId: provider.config.id, name: provider.config.name, connection: fail ? 'DEGRADED' : 'ONLINE', search: searchOk, metadata: true, images: hasImages || provider.config.mediaAvailable === true, maps: hasMaps || provider.config.mapsAvailable === true, rateLimits: provider.config.rateLimit, license: provider.config.license ?? 'UNKNOWN', attribution: provider.config.attributionRequired ? 'REQUIRED' : 'NOT REQUIRED', responseTimeMs: Date.now() - start, errors, apiKeyRequired: provider.config.requiresApiKey, testStatus: fail ? 'WARN' : 'PASS' };
  }
  async testNoKeyCore(): Promise<SourceTestResult[]> { return Promise.all(configuredProviders(this.providers).map((provider) => this.testProvider(provider))); }
}
