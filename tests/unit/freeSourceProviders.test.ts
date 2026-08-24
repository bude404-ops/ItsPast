import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { SourceProvider, SourceRecord } from '../../src/types/research';
import { normalizeChroniclingAmericaItem } from '../../src/services/research/providers/chroniclingAmerica';
import { normalizeInternetArchiveDoc } from '../../src/services/research/providers/internetArchive';
import { normalizeLibraryOfCongressItem } from '../../src/services/research/providers/libraryOfCongress';
import { normalizeMediaWikiSearch } from '../../src/services/research/providers/mediaWiki';
import { normalizeOpenStreetMapItem } from '../../src/services/research/providers/openStreetMap';
import { normalizeWikidataBinding } from '../../src/services/research/providers/wikidata';
import { normalizeCommonsPage } from '../../src/services/research/providers/wikimediaCommons';
import { libraryOfCongressProviderConfig, wikidataProviderConfig } from '../../src/services/research/providers/providerConfigs';
import { freeResearchModeStatus, noKeySourceProviders, optionalOrExcludedProviders } from '../../src/services/research/providers';
import { assertNoApiKeysRequired } from '../../src/services/research/health/freeResearchMode';
import { HistoricalResearchOrchestrator } from '../../src/services/research/orchestrator/HistoricalResearchOrchestrator';
import { SourceTestLab } from '../../src/services/research/health/SourceTestLab';
import { evaluatePilotFixtures } from '../../src/services/research/orchestrator/pilotLocations';

const fixture = <T>(name: string): T => JSON.parse(readFileSync(join(process.cwd(), 'tests/fixtures/research', name), 'utf8')) as T;
const firstValue = <T>(record: Record<string, T> | undefined): T => Object.values(record ?? {})[0];

const fixtureRecords = (): SourceRecord[] => {
  const loc = fixture<{ results: Record<string, unknown>[] }>('loc-search.json');
  const chronam = fixture<{ results: Record<string, unknown>[] }>('chronam-search.json');
  const wikidata = fixture<{ results: { bindings: Parameters<typeof normalizeWikidataBinding>[0][] } }>('wikidata-search.json');
  const commons = fixture<{ query: { pages: Record<string, Parameters<typeof normalizeCommonsPage>[0]> } }>('commons-search.json');
  const mediawiki = fixture<{ query: { search: Parameters<typeof normalizeMediaWikiSearch>[0][] } }>('mediawiki-search.json');
  const osm = fixture<Parameters<typeof normalizeOpenStreetMapItem>[0][]>('osm-search.json');
  const internetArchive = fixture<{ response: { docs: Parameters<typeof normalizeInternetArchiveDoc>[0][] } }>('internet-archive-search.json');

  return [
    normalizeLibraryOfCongressItem(loc.results[0]),
    normalizeChroniclingAmericaItem(chronam.results[0]),
    normalizeWikidataBinding(wikidata.results.bindings[0]),
    normalizeCommonsPage(firstValue(commons.query.pages)),
    normalizeMediaWikiSearch(mediawiki.query.search[0]),
    normalizeOpenStreetMapItem(osm[0]),
    normalizeInternetArchiveDoc(internetArchive.response.docs[0])
  ];
};

const fakeProvider = (id: string, records: SourceRecord[]): SourceProvider => ({
  config: id === 'wikidata' ? wikidataProviderConfig : { ...libraryOfCongressProviderConfig, id, name: `Fixture ${id}` },
  isConfigured: () => true,
  buildSearches: () => [{ providerId: id, query: 'Riverside Theater', searchType: 'TEXT', limit: 2 }],
  search: async () => records,
  fetch: async () => records[0],
  normalize: () => records[0]
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

  it('normalizes every implemented no-key provider fixture with provenance and storage rules', () => {
    const records = fixtureRecords();
    expect(records).toHaveLength(7);
    expect(records.map((record) => record.provenance?.sourceProvider).sort()).toEqual(['chronam', 'commons', 'internet_archive', 'loc', 'mediawiki', 'osm', 'wikidata']);
    expect(records.every((record) => record.canStoreMetadata)).toBe(true);
    expect(records.some((record) => record.licenseClass === 'CC_BY_SA')).toBe(true);
    expect(records.some((record) => record.licenseClass === 'PUBLIC_DOMAIN')).toBe(true);
  });

  it('orchestrates multiple no-key providers while preserving provenance', async () => {
    const records = fixtureRecords();
    const orchestrator = new HistoricalResearchOrchestrator([
      fakeProvider('loc', records.slice(0, 1)),
      fakeProvider('wikidata', records.slice(2, 3)),
      fakeProvider('commons', records.slice(3, 4))
    ]);
    const result = await orchestrator.research({ entityName: 'Riverside Theater', location: 'Milwaukee', dateRange: { start: '1921' } });
    expect(result.sources.length).toBe(3);
    expect(result.claims.length).toBeGreaterThan(0);
    expect(result.providerStatuses.every((status) => status.status === 'ONLINE')).toBe(true);
  });

  it('source test lab reports status without credentials', async () => {
    const [record] = fixtureRecords();
    const lab = new SourceTestLab([fakeProvider('loc', [record])]);
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
