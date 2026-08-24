import type { SourceProvider } from '../../../types/research';
import { chroniclingAmericaProvider } from './chroniclingAmerica';
import { internetArchiveProvider } from './internetArchive';
import { libraryOfCongressProvider } from './libraryOfCongress';
import { mediaWikiProvider } from './mediaWiki';
import { openStreetMapProvider } from './openStreetMap';
import { wikidataProvider } from './wikidata';
import { wikimediaCommonsProvider } from './wikimediaCommons';
import { nationalArchivesProvider } from './nationalArchivesProvider';
export { sourceProviderConfigs } from './providerConfigs';
export { currentSourceHealthRegistry, liveSourceHealthChecksEnabled, sourceHealthFromRegistry } from '../health/sourceHealth';
export { historicalSourceProviders, noKeyCoreProviders, optionalOrExcludedProviders } from '../registry/sourceRegistry';

export const sourceProviders: SourceProvider[] = [libraryOfCongressProvider, chroniclingAmericaProvider, wikidataProvider, wikimediaCommonsProvider, mediaWikiProvider, openStreetMapProvider, internetArchiveProvider, nationalArchivesProvider];
export const noKeySourceProviders: SourceProvider[] = sourceProviders.filter((provider) => provider.config.accessClassification === 'NO_KEY_REQUIRED' && provider.config.enabled && !provider.config.requiresApiKey);
export function configuredProviders(providers = noKeySourceProviders): SourceProvider[] { return providers.filter((provider) => provider.config.enabled && provider.isConfigured()); }
export function providerStatus(providers = sourceProviders): Array<{ id: string; name: string; configured: boolean; requiresApiKey: boolean; attributionRequired: boolean; classification?: string }> { return providers.map((provider) => ({ id: provider.config.id, name: provider.config.name, configured: provider.isConfigured(), requiresApiKey: provider.config.requiresApiKey, attributionRequired: provider.config.attributionRequired, classification: provider.config.accessClassification })); }
export function freeResearchModeStatus(providers = noKeySourceProviders): { mode: 'FREE RESEARCH MODE'; apiKeysRequired: 'NONE'; sourcesConnected: string[] } { return { mode: 'FREE RESEARCH MODE', apiKeysRequired: 'NONE', sourcesConnected: configuredProviders(providers).map((provider) => `${provider.config.name} ✓`) }; }
