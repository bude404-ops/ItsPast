import type { SourceProvider } from '../../../types/research';
import { libraryOfCongressProvider } from './libraryOfCongressProvider';
import { nationalArchivesProvider } from './nationalArchivesProvider';
import { wikidataProvider } from './wikidataProvider';
import { openStreetMapProvider } from './openStreetMapProvider';
export { sourceProviderConfigs } from './providerConfigs';
export const sourceProviders: SourceProvider[] = [libraryOfCongressProvider, nationalArchivesProvider, wikidataProvider, openStreetMapProvider];
export function configuredProviders(providers = sourceProviders): SourceProvider[] { return providers.filter((provider) => provider.config.enabled && provider.isConfigured()); }
export function providerStatus(providers = sourceProviders): Array<{ id: string; name: string; configured: boolean; requiresApiKey: boolean; attributionRequired: boolean }> { return providers.map((provider) => ({ id: provider.config.id, name: provider.config.name, configured: provider.isConfigured(), requiresApiKey: provider.config.requiresApiKey, attributionRequired: provider.config.attributionRequired })); }
