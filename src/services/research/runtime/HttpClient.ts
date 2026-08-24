import { defaultResearchCache } from './ResearchCache';
import { conservativeNoKeyPolicy, withBackoff, type ProviderRateLimitPolicy } from './RateLimiter';

export interface JsonRequestOptions { providerId: string; url: string; policy?: ProviderRateLimitPolicy; cacheTtlMs?: number; headers?: Record<string, string>; }

export async function fetchJson<T>({ providerId, url, policy = conservativeNoKeyPolicy, cacheTtlMs = 24 * 60 * 60 * 1000, headers = {} }: JsonRequestOptions): Promise<T> {
  return defaultResearchCache.remember(`${providerId}:${url}`, async () => withBackoff(providerId, policy, async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), policy.timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json', 'User-Agent': 'ItsPastResearchEngine/0.1 (+https://github.com/bude404-ops/ItsPast)', ...headers } });
      if (!response.ok) throw new Error(`${providerId} HTTP ${response.status}`);
      return await response.json() as T;
    } finally { clearTimeout(timer); }
  }), cacheTtlMs);
}
