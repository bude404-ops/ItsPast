import type { ProviderHealthStatus, SourceProviderConfig } from '../../../types/research';
import { historicalSourceProviders } from '../registry/sourceRegistry';

export interface SourceHealthSnapshot {
  providerId: string;
  name: string;
  status: ProviderHealthStatus | 'SOURCE_REQUIRES_MAINTENANCE';
  noKeyCore: boolean;
  apiKeyRequired: boolean;
  lastTested?: string;
  notes: string[];
}

export const liveSourceHealthChecksEnabled = (): boolean => {
  const maybeProcess = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
  return maybeProcess.process?.env?.RESEARCH_LIVE_TESTS === 'true';
};

export function sourceHealthFromRegistry(config: SourceProviderConfig): SourceHealthSnapshot {
  const notes: string[] = [config.rateLimit];
  if (config.accessClassification !== 'NO_KEY_REQUIRED') notes.push('Not used by automatic free research mode.');
  if (config.status === 'SOURCE_REQUIRES_MAINTENANCE') notes.push('SOURCE REQUIRES MAINTENANCE');
  if (config.commercialUse === 'NEEDS LEGAL/TERMS REVIEW') notes.push('NEEDS LEGAL/TERMS REVIEW before commercial media/content reuse.');
  return {
    providerId: config.id,
    name: config.name,
    status: config.enabled ? 'ONLINE' : config.status === 'SOURCE_REQUIRES_MAINTENANCE' ? 'SOURCE_REQUIRES_MAINTENANCE' : 'DISABLED',
    noKeyCore: config.enabled && config.accessClassification === 'NO_KEY_REQUIRED' && !config.requiresApiKey,
    apiKeyRequired: config.requiresApiKey || Boolean(config.apiKeyRequired),
    lastTested: config.lastTested,
    notes
  };
}

export function currentSourceHealthRegistry(): SourceHealthSnapshot[] {
  return historicalSourceProviders.map(sourceHealthFromRegistry);
}
