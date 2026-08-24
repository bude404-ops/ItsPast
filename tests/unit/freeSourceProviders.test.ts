import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chroniclingAmericaProvider } from '../../src/services/research/providers/chroniclingAmerica';
import { internetArchiveProvider } from '../../src/services/research/providers/internetArchive';
import { libraryOfCongressProvider } from '../../src/services/research/providers/libraryOfCongress';
import { mediaWikiProvider } from '../../src/services/research/providers/mediaWiki';
import { openStreetMapProvider } from '../../src/services/research/providers/openStreetMap';
import { wikidataProvider } from '../../src/services/research/providers/wikidata';
import { wikimediaCommonsProvider } from '../../src/services/research/providers/wikimediaCommons';
import { freeResearchModeStatus, noKeySourceProviders, optionalOrExcludedProviders } from '../../src/services/research/providers';
import { assertNoApiKeysRequired } from '../../src/services/research/health/freeResearchMode';
import { HistoricalResearchOrchestrator } from '../../src/services/research/orchestrator/HistoricalResearchOrchestrator';
import { SourceTestLab } from '../../src/services/research/health/SourceTestLab';
import { evaluatePilotFixtures } from '../../src/services/research/orchestrator/pilotLocations';

const fixture = (name: string) => JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/research', name), 'utf8'));
const fixtures: Record<string, unknown> = {
  loc: fixture('loc-search.json'), chronam: fixture('chronam-search.json'), wikidata: fixture('wikidata-search.json'), commons: fixture('commons-search.json'), mediawiki: fixture('mediawiki-search.json'), osm: fixture('osm-search.json'), internet_archive: fixture('internet-archive-search.json')
};

beforeEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal('fetch', vi.fn(async (url: string) => {
    const key = url.includes('chronicling-america') ? 'chronam' : url.includes('query.wikidata') ? 'wikidata' : url.includes('commons.wikimedia') ? 'commons' : url.includes('wikipedia.org') ? 'mediawiki' : url.includes('nominatim') ? 'osm' : url.includes('archive.org') ? 'internet_archive' : 'loc';
    return { ok: true, status: 200, json: async () => fixtures[key] } as Response;
  }));
});

describe('free no-key historical source providers', () => {
  it('keeps core research mode free of required API keys', () => {
    assertNoApiKeysRequired();
    const status = freeResearchModeStatus(noKeySourceProviders);
    expect(status.mode).toBe('FREE RESEARCH MODE');
    expect(status.apiKeysRequired).toBe('NONE');
    expect(status.sourcesConnected.length).toBeGreaterThanOrEqual(7);
    expect(optionalOrExcludedProviders.some((provider) => provider.id === 'nara' && provider.accessClassification === 'KEY_REQUIRED')).toBe(true);
  });

  it.each([
    ['loc', libraryOfCongressProvider], ['chronam', chroniclingAmericaProvider], ['wikidata', wikidataProvider], ['commons', wikimediaCommonsProvider], ['mediawiki', mediaWikiProvider], ['osm', openStreetMapProvider], ['internet_archive', internetArchiveProvider]
  ])('normalizes %s results with provenance and no required key', async (_id, provider) => {
    expect(provider.isConfigured()).toBe(true);
    const records = await provider.search({ providerId: provider.config.id, query: 'Riverside Theater', searchType: 'TEXT', limit: 1 });
    expect(records.length).toBe(1);
    expect(records[0].provenance?.sourceProvider).toBe(provider.config.id);
    expect(records[0].canStoreMetadata).toBe(true);
    expect(provider.config.requiresApiKey).toBe(false);
  });

  it('orchestrates multiple providers while preserving provenance', async () => {
    const orchestrator = new HistoricalResearchOrchestrator([libraryOfCongressProvider, wikidataProvider, wikimediaCommonsProvider]);
    const result = await orchestrator.research({ entityName: 'Riverside Theater', location: 'Milwaukee', dateRange: { start: '1921' } });
    expect(result.sources.length).toBeGreaterThanOrEqual(3);
    expect(result.claims.length).toBeGreaterThan(0);
    expect(result.providerStatuses.every((status) => status.status === 'ONLINE')).toBe(true);
  });

  it('source test lab reports status without credentials', async () => {
    const lab = new SourceTestLab([libraryOfCongressProvider]);
    const [result] = await lab.testNoKeyCore();
    expect(result.apiKeyRequired).toBe(false);
    expect(result.testStatus).toBe('PASS');
  });

  it('evaluates 10+ pilot locations for reconstruction eligibility using fixture evidence', () => {
    const pilots = evaluatePilotFixtures();
    expect(pilots.length).toBeGreaterThanOrEqual(10);
    expect(pilots.some((pilot) => pilot.eligibility.status === 'ELIGIBLE')).toBe(true);
  });
});
