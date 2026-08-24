import type { SourceAccessClassification, SourceImplementationStatus, SourceProviderConfig, SourceQualityScore } from '../../../types/research';

export interface HistoricalSourceProviderRow {
  id: string;
  name: string;
  description: string;
  website: string;
  api_url: string;
  api_key_required: boolean;
  authentication_required: boolean;
  automated_access_allowed: boolean | 'NOT_CONFIRMED';
  bulk_download_available: boolean | 'NOT_CONFIRMED';
  license: string;
  commercial_use: 'YES' | 'NO' | 'CONDITIONAL' | 'NEEDS LEGAL/TERMS REVIEW';
  attribution_required: boolean;
  rate_limit: string;
  robots_policy: string;
  terms_url: string;
  documentation_url: string;
  source_type: string;
  geographic_coverage: string;
  historical_coverage: string;
  media_available: boolean;
  text_available: boolean;
  maps_available: boolean;
  enabled: boolean;
  status: SourceImplementationStatus;
  access_classification: SourceAccessClassification;
  quality_score: SourceQualityScore;
  last_tested: string;
}

const requiredStringFields: Array<keyof HistoricalSourceProviderRow> = [
  'id', 'name', 'description', 'website', 'api_url', 'license', 'commercial_use',
  'rate_limit', 'robots_policy', 'terms_url', 'documentation_url', 'source_type',
  'geographic_coverage', 'historical_coverage', 'status', 'access_classification', 'last_tested'
];

export function toHistoricalSourceProviderRow(config: SourceProviderConfig): HistoricalSourceProviderRow {
  if (!config.description || !config.website || !config.license || !config.commercialUse || !config.robotsPolicy || !config.documentationUrl || !config.sourceType || !config.geographicCoverage || !config.historicalCoverage || !config.status || !config.accessClassification || !config.qualityScore || !config.lastTested) {
    throw new Error(`Historical source provider ${config.id} is missing registry metadata.`);
  }
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    website: config.website,
    api_url: config.apiEndpoint,
    api_key_required: config.apiKeyRequired ?? config.requiresApiKey,
    authentication_required: config.authenticationRequired ?? config.requiresApiKey,
    automated_access_allowed: config.automatedAccessAllowed ?? 'NOT_CONFIRMED',
    bulk_download_available: config.bulkDownloadAvailable ?? 'NOT_CONFIRMED',
    license: config.license,
    commercial_use: config.commercialUse,
    attribution_required: config.attributionRequired,
    rate_limit: config.rateLimit,
    robots_policy: config.robotsPolicy,
    terms_url: config.termsUrl,
    documentation_url: config.documentationUrl,
    source_type: config.sourceType,
    geographic_coverage: config.geographicCoverage,
    historical_coverage: config.historicalCoverage,
    media_available: config.mediaAvailable ?? false,
    text_available: config.textAvailable ?? false,
    maps_available: config.mapsAvailable ?? false,
    enabled: config.enabled,
    status: config.status,
    access_classification: config.accessClassification,
    quality_score: config.qualityScore,
    last_tested: config.lastTested
  };
}

export function validateHistoricalSourceProviderRows(rows: HistoricalSourceProviderRow[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const row of rows) {
    if (ids.has(row.id)) errors.push(`Duplicate source id: ${row.id}`);
    ids.add(row.id);
    for (const field of requiredStringFields) {
      const value = row[field];
      if (typeof value !== 'string' || value.trim().length === 0) errors.push(`${row.id} missing ${field}`);
    }
    if (row.enabled && row.access_classification !== 'NO_KEY_REQUIRED') errors.push(`${row.id} is enabled but not no-key.`);
    if (row.access_classification === 'NO_KEY_REQUIRED' && row.api_key_required) errors.push(`${row.id} says no-key but requires API key.`);
    if (row.quality_score.overall < 0 || row.quality_score.overall > 100) errors.push(`${row.id} quality score out of range.`);
    if (row.commercial_use === 'YES' && /mixed|varies|unknown|review/i.test(row.license)) errors.push(`${row.id} commercial use cannot be unconditional with mixed/unclear licensing.`);
  }
  return errors;
}

export function rowsForHistoricalSourceProviders(configs: SourceProviderConfig[]): HistoricalSourceProviderRow[] {
  return configs.map(toHistoricalSourceProviderRow);
}
