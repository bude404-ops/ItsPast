import { describe, expect, it } from 'vitest';
import { historicalSourceProviders, historicalSourceProviderRows, historicalSourceProviderValidationErrors, noKeyCoreProviders, optionalOrExcludedProviders } from '../../src/services/research/registry/sourceRegistry';
import { currentSourceHealthRegistry, liveSourceHealthChecksEnabled } from '../../src/services/research/health/sourceHealth';

describe('historical source provider registry', () => {
  it('exports database-ready historical_source_providers rows', () => {
    expect(historicalSourceProviderValidationErrors).toEqual([]);
    expect(historicalSourceProviderRows.length).toBe(historicalSourceProviders.length);
    const loc = historicalSourceProviderRows.find((row) => row.id === 'loc');
    expect(loc).toMatchObject({
      api_key_required: false,
      authentication_required: false,
      access_classification: 'NO_KEY_REQUIRED',
      enabled: true
    });
    for (const row of historicalSourceProviderRows) {
      expect(row.id).toBeTruthy();
      expect(row.api_url).toMatch(/^https:\/\//);
      expect(row.terms_url).toMatch(/^https:\/\//);
      expect(row.documentation_url).toMatch(/^https:\/\//);
      expect(row.quality_score.overall).toBeGreaterThanOrEqual(0);
      expect(row.quality_score.overall).toBeLessThanOrEqual(100);
    }
  });

  it('keeps automatic core research limited to enabled no-key providers', () => {
    expect(noKeyCoreProviders.every((provider) => provider.enabled)).toBe(true);
    expect(noKeyCoreProviders.every((provider) => provider.accessClassification === 'NO_KEY_REQUIRED')).toBe(true);
    expect(noKeyCoreProviders.every((provider) => !provider.requiresApiKey && !provider.apiKeyRequired)).toBe(true);
    expect(optionalOrExcludedProviders.some((provider) => provider.accessClassification === 'KEY_REQUIRED')).toBe(true);
    expect(optionalOrExcludedProviders.some((provider) => provider.status === 'FOUND_NOT_IMPLEMENTED')).toBe(true);
  });

  it('documents additional candidates without enabling unimplemented providers', () => {
    const ids = historicalSourceProviders.map((provider) => provider.id);
    for (const id of ['smithsonian_open_access', 'usgs_historical_topo', 'geonames_dumps', 'hathitrust_bib', 'dpla', 'europeana', 'nypl_digital']) {
      expect(ids).toContain(id);
    }
    const unimplemented = historicalSourceProviders.filter((provider) => provider.status === 'FOUND_NOT_IMPLEMENTED');
    expect(unimplemented.every((provider) => provider.enabled === false)).toBe(true);
  });

  it('keeps live provider health checks opt-in', () => {
    expect(liveSourceHealthChecksEnabled()).toBe(false);
    const health = currentSourceHealthRegistry();
    expect(health.length).toBe(historicalSourceProviders.length);
    expect(health.filter((item) => item.noKeyCore).length).toBe(noKeyCoreProviders.length);
    expect(health.some((item) => item.apiKeyRequired)).toBe(true);
  });
});
