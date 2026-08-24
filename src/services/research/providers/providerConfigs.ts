import { historicalSourceProviders } from '../registry/sourceRegistry';

const byId = (id: string) => {
  const provider = historicalSourceProviders.find((entry) => entry.id === id);
  if (!provider) throw new Error(`Missing historical source provider config: ${id}`);
  return provider;
};

export const libraryOfCongressProviderConfig = byId('loc');
export const chroniclingAmericaProviderConfig = byId('chronam');
export const wikidataProviderConfig = byId('wikidata');
export const wikimediaCommonsProviderConfig = byId('commons');
export const mediaWikiProviderConfig = byId('mediawiki');
export const openStreetMapProviderConfig = byId('osm');
export const internetArchiveProviderConfig = byId('internet_archive');
export const naraProviderConfig = byId('nara');
export const sourceProviderConfigs = historicalSourceProviders;
