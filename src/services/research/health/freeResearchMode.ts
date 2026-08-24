import { freeResearchModeStatus, noKeySourceProviders } from '../providers';
export const FREE_RESEARCH_MODE = freeResearchModeStatus(noKeySourceProviders);
export function assertNoApiKeysRequired(): void { const requiringKeys = noKeySourceProviders.filter((provider) => provider.config.requiresApiKey || provider.config.apiKeyRequired); if (requiringKeys.length) throw new Error(`Core provider unexpectedly requires API key: ${requiringKeys.map((provider) => provider.config.id).join(', ')}`); }
