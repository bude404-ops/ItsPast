import type { ConfidenceLevel, DatePrecision, EntityType, SourceType } from '../entities';

export type ResearchProviderType = 'LIBRARY_OF_CONGRESS' | 'CHRONICLING_AMERICA' | 'WIKIDATA' | 'WIKIMEDIA_COMMONS' | 'MEDIAWIKI' | 'OPENSTREETMAP' | 'INTERNET_ARCHIVE' | 'NATIONAL_ARCHIVES' | 'OTHER_ARCHIVE';
export type ResearchDepth = 'BASIC' | 'STANDARD' | 'DEEP';
export type MatchConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type ResearchJobType = 'research_entity' | 'research_location' | 'search_historical_images' | 'search_historical_maps' | 'search_newspapers' | 'extract_claims' | 'cross_check_claims' | 'build_timeline' | 'prepare_reconstruction';
export type ResearchJobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETE' | 'FAILED' | 'RATE_LIMITED' | 'NEEDS_REVIEW';
export type ClaimType = 'CONSTRUCTION' | 'DEMOLITION' | 'RENOVATION' | 'BUSINESS_OPENED' | 'BUSINESS_CLOSED' | 'OWNERSHIP_CHANGE' | 'NAME_CHANGE' | 'USE_CHANGE' | 'ARCHITECTURAL_CHANGE' | 'EVENT' | 'RELOCATION' | 'REPLACEMENT' | 'OTHER';
export type ClaimStatus = 'CANDIDATE' | 'CROSS_CHECKING' | 'SUPPORTED' | 'SOURCE_CONFLICT' | 'REJECTED' | 'UNKNOWN';
export type EvidenceType = 'DIRECT' | 'CORROBORATING' | 'INDIRECT' | 'CONFLICTING';
export type EvidenceStrength = 'VERY_STRONG' | 'STRONG' | 'MODERATE' | 'WEAK';
export type ReconstructionType = 'PHOTOGRAPHIC_RESTORATION' | 'HISTORICAL_RECONSTRUCTION' | 'ARCHITECTURAL_RECONSTRUCTION' | 'ENVIRONMENTAL_RECONSTRUCTION';
export type ReconstructionEligibilityStatus = 'ELIGIBLE' | 'INSUFFICIENT_EVIDENCE' | 'NEEDS_REVIEW';
export type SourceAccessClassification = 'NO_KEY_REQUIRED' | 'OPTIONAL_KEY' | 'KEY_REQUIRED' | 'LOGIN_REQUIRED' | 'RESTRICTED' | 'UNKNOWN';
export type SourceImplementationStatus = 'IMPLEMENTED' | 'FOUND_NOT_IMPLEMENTED' | 'NEEDS_LEGAL_TERMS_REVIEW' | 'DISABLED' | 'SOURCE_REQUIRES_MAINTENANCE';
export type ProviderHealthStatus = 'ONLINE' | 'DEGRADED' | 'RATE_LIMITED' | 'OFFLINE' | 'CHANGED' | 'DISABLED';
export type MediaLicenseClass = 'PUBLIC_DOMAIN' | 'CC0' | 'CC_BY' | 'CC_BY_SA' | 'OTHER_OPEN_LICENSE' | 'RESTRICTED' | 'UNKNOWN';
export type SourcePriority = 'HIGH PRIORITY' | 'MEDIUM PRIORITY' | 'LOW PRIORITY' | 'EXCLUDED';

export interface SourceQualityScore {
  authority: number;
  historicalDepth: number;
  metadataQuality: number;
  geographicCoverage: number;
  mediaAvailability: number;
  structuredData: number;
  searchability: number;
  licensingClarity: number;
  automatedAccess: number;
  reliability: number;
  overall: number;
  priority: SourcePriority;
}

export interface SourceProviderConfig {
  id: string;
  name: string;
  providerType: ResearchProviderType;
  baseUrl: string;
  apiEndpoint: string;
  requiresApiKey: boolean;
  enabled: boolean;
  rateLimit: string;
  termsUrl: string;
  attributionRequired: boolean;
  description?: string;
  website?: string;
  apiKeyRequired?: boolean;
  authenticationRequired?: boolean;
  automatedAccessAllowed?: boolean | 'NOT_CONFIRMED';
  bulkDownloadAvailable?: boolean | 'NOT_CONFIRMED';
  license?: string;
  commercialUse?: 'YES' | 'NO' | 'CONDITIONAL' | 'NEEDS LEGAL/TERMS REVIEW';
  robotsPolicy?: string;
  documentationUrl?: string;
  sourceType?: string;
  geographicCoverage?: string;
  historicalCoverage?: string;
  mediaAvailable?: boolean;
  textAvailable?: boolean;
  mapsAvailable?: boolean;
  status?: SourceImplementationStatus;
  accessClassification?: SourceAccessClassification;
  qualityScore?: SourceQualityScore;
  lastTested?: string;
}

export interface ResearchQueryInput {
  entityName?: string;
  location?: string;
  dateRange?: { start?: string; end?: string };
  entityType?: EntityType;
  keywords?: string[];
  coordinates?: { latitude: number; longitude: number };
  historicNames?: string[];
  nearbyLandmarks?: string[];
  parcelId?: string;
}

export interface SourceSearch { providerId: string; query: string; searchType: 'TEXT' | 'IMAGE' | 'MAP' | 'COORDINATE' | 'NEWSPAPER' | 'ENTITY'; limit: number; }
export interface SourceFetchRequest { providerId: string; externalId: string; sourceUrl?: string; }
export interface SourceMediaRequest { providerId: string; query?: string; externalId?: string; limit?: number; }

export interface SourceProvenance {
  sourceProvider: string;
  sourceId: string;
  sourceUrl?: string;
  retrievedAt: string;
  license?: string;
  creator?: string;
  publicationDate?: string;
  evidenceType: EvidenceType | 'SOURCE_RECORD' | 'MEDIA' | 'MAP' | 'METADATA';
  confidence: ConfidenceLevel | 'UNKNOWN';
}

export interface SourceRecord {
  id: string;
  providerId: string;
  externalId: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  author?: string;
  publisher?: string;
  sourceUrl?: string;
  mediaUrl?: string;
  license?: string;
  licenseClass?: MediaLicenseClass;
  attribution?: string;
  copyrightStatus?: string;
  sourceType: SourceType;
  rawMetadata: Record<string, unknown>;
  provenance?: SourceProvenance;
  canStoreMetadata?: boolean;
  canStoreMedia?: boolean | 'UNKNOWN';
  canUseForAiProcessing?: boolean | 'UNKNOWN';
  createdAt: string;
  updatedAt: string;
}

export interface AddressHistory {
  currentAddress?: string;
  historicAddress?: string;
  alternateAddresses: string[];
  parcelIdentifier?: string;
  coordinates?: { latitude: number; longitude: number };
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface EntityAlias { alias: string; sourceRecordId?: string; dateRange?: { start?: string; end?: string }; confidence: ConfidenceLevel; }
export interface EntityMatchCandidate { entityId?: string; name: string; address?: AddressHistory; aliases: EntityAlias[]; sourceRecordIds: string[]; matchConfidence: MatchConfidence; signals: string[]; }

export interface HistoricalClaim {
  id: string;
  entityId: string;
  claimType: ClaimType;
  claimText: string;
  eventDate?: string;
  datePrecision: DatePrecision;
  confidence: ConfidenceLevel | 'UNKNOWN';
  status: ClaimStatus;
  provenance: { sourceRecordIds: string[]; extractor: string; createdFrom: string };
  createdAt: string;
}
export interface ClaimEvidence { id: string; claimId: string; sourceRecordId: string; evidenceText: string; evidenceType: EvidenceType; strength: EvidenceStrength; createdAt: string; }
export interface ConfidenceExplanation { confidence: ConfidenceLevel | 'UNKNOWN'; score: number; reasons: string[]; conflicts: string[]; sourceCount: number; independentSourceCount: number; }
export interface TimelineEventDraft { id: string; entityId: string; date: string; datePrecision: DatePrecision; title: string; description: string; claimIds: string[]; evidenceIds: string[]; confidence: ConfidenceLevel | 'UNKNOWN'; }
export interface ChangeDetection { changeType: string; beforeState: string; afterState: string; dateRange?: { start?: string; end?: string }; evidenceIds: string[]; confidence: ConfidenceLevel | 'UNKNOWN'; }
export interface ReconstructionEligibility { status: ReconstructionEligibilityStatus; confidence: ConfidenceLevel | 'UNKNOWN'; reasons: string[]; evidenceIds: string[]; knownElements: string[]; estimatedElements: string[]; unknownElements: string[]; }
export interface ReconstructionPromptInput { location: string; year: string; reconstructionType: ReconstructionType; evidence: ClaimEvidence[]; claims: HistoricalClaim[]; sources: SourceRecord[]; knownElements: string[]; estimatedElements: string[]; unknownElements: string[]; confidence: ConfidenceLevel | 'UNKNOWN'; }
export interface BuiltReconstructionPrompt { prompt: string; metadata: { label: 'AI RECONSTRUCTION'; yearDepicted: string; evidenceUsed: string[]; confidence: ConfidenceLevel | 'UNKNOWN'; knownElements: string[]; estimatedElements: string[]; unknownElements: string[]; }; }

export interface ProviderMetadata { provider: SourceProviderConfig; health?: ProviderHealthStatus; lastChecked?: string; notes: string[]; }
export interface SourceProvider {
  config: SourceProviderConfig;
  isConfigured(): boolean;
  buildSearches(input: ResearchQueryInput): SourceSearch[];
  search(search: SourceSearch): Promise<SourceRecord[]>;
  fetch(request: SourceFetchRequest): Promise<SourceRecord | undefined>;
  normalize(raw: unknown): SourceRecord;
  getRecord?(request: SourceFetchRequest): Promise<SourceRecord | undefined>;
  getMedia?(request: SourceMediaRequest): Promise<SourceRecord[]>;
  getMetadata?(): ProviderMetadata;
  findNearby?(input: ResearchQueryInput): Promise<SourceRecord[]>;
  findByDate?(input: ResearchQueryInput): Promise<SourceRecord[]>;
  findByLocation?(input: ResearchQueryInput): Promise<SourceRecord[]>;
  findByName?(input: ResearchQueryInput): Promise<SourceRecord[]>;
  getLicense?(record?: SourceRecord): string;
  getAttribution?(record?: SourceRecord): string;
}

export interface ResearchBudget { depth: ResearchDepth; maxSourceSearches: number; maxFetches: number; maxAiCalls: number; retryLimit: number; cacheTtlSeconds: number; }
export interface ResearchJob { id: string; jobType: ResearchJobType; status: ResearchJobStatus; entityId?: string; location?: string; budget: ResearchBudget; searchesPerformed: SourceSearch[]; sourcesFound: string[]; claimsExtracted: string[]; conflicts: string[]; createdAt: string; updatedAt: string; }
export interface AiResearchOutput { facts: HistoricalClaim[]; inferences: HistoricalClaim[]; conflicts: string[]; unknown: string[]; recommendedResearch: SourceSearch[]; }
export interface HistoricalResearchResult { sources: SourceRecord[]; entities: EntityMatchCandidate[]; claims: HistoricalClaim[]; images: SourceRecord[]; maps: SourceRecord[]; events: TimelineEventDraft[]; confidence: ConfidenceExplanation[]; conflicts: string[]; providerStatuses: Array<{ id: string; status: ProviderHealthStatus | 'NOT_RUN'; errors: string[] }>; }
