export interface ProviderRateLimitPolicy { minDelayMs: number; maxRequestsPerMinute: number; timeoutMs: number; retryLimit: number; circuitBreakerFailures: number; }
const waits = new Map<string, number>();
const failures = new Map<string, number>();

export const conservativeNoKeyPolicy: ProviderRateLimitPolicy = { minDelayMs: 1100, maxRequestsPerMinute: 30, timeoutMs: 15000, retryLimit: 2, circuitBreakerFailures: 3 };
export const osmNominatimPolicy: ProviderRateLimitPolicy = { minDelayMs: 1200, maxRequestsPerMinute: 1, timeoutMs: 15000, retryLimit: 1, circuitBreakerFailures: 2 };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export function resetProviderCircuit(providerId: string): void { failures.delete(providerId); }
export function markProviderFailure(providerId: string): number { const count = (failures.get(providerId) ?? 0) + 1; failures.set(providerId, count); return count; }
export function isCircuitOpen(providerId: string, policy: ProviderRateLimitPolicy): boolean { return (failures.get(providerId) ?? 0) >= policy.circuitBreakerFailures; }

export async function waitForProviderTurn(providerId: string, policy: ProviderRateLimitPolicy): Promise<void> {
  const now = Date.now();
  const next = waits.get(providerId) ?? 0;
  if (next > now) await sleep(next - now);
  waits.set(providerId, Date.now() + policy.minDelayMs);
}

export async function withBackoff<T>(providerId: string, policy: ProviderRateLimitPolicy, run: () => Promise<T>): Promise<T> {
  if (isCircuitOpen(providerId, policy)) throw new Error(`${providerId} circuit breaker open`);
  let lastError: unknown;
  for (let attempt = 0; attempt <= policy.retryLimit; attempt += 1) {
    try { await waitForProviderTurn(providerId, policy); const result = await run(); resetProviderCircuit(providerId); return result; }
    catch (error) { lastError = error; const count = markProviderFailure(providerId); if (attempt >= policy.retryLimit || count >= policy.circuitBreakerFailures) break; await sleep(250 * 2 ** attempt); }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
