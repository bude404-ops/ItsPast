import type { ConfidenceLevel, DatePrecision, EntityType, SourceType } from '../entities';

export type ResearchProviderType = 'LIBRARY_OF_CONGRESS' | 'NATIONAL_ARCHIVES' | 'WIKIDATA' | 'WIKIMEDIA' | 'OPENSTREETMAP' | 'OTHER_ARCHIVE';
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
  copyrightStatus?: string;
  sourceType: SourceType;
  rawMetadata: Record<string, unknown>;
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

export interface SourceProvider {
  config: SourceProviderConfig;
  isConfigured(): boolean;
  buildSearches(input: ResearchQueryInput): SourceSearch[];
  search(search: SourceSearch): Promise<SourceRecord[]>;
  fetch(request: SourceFetchRequest): Promise<SourceRecord | undefined>;
  normalize(raw: unknown): SourceRecord;
}

export interface ResearchBudget { depth: ResearchDepth; maxSourceSearches: number; maxFetches: number; maxAiCalls: number; retryLimit: number; cacheTtlSeconds: number; }
export interface ResearchJob { id: string; jobType: ResearchJobType; status: ResearchJobStatus; entityId?: string; location?: string; budget: ResearchBudget; searchesPerformed: SourceSearch[]; sourcesFound: string[]; claimsExtracted: string[]; conflicts: string[]; createdAt: string; updatedAt: string; }
export interface AiResearchOutput { facts: HistoricalClaim[]; inferences: HistoricalClaim[]; conflicts: string[]; unknown: string[]; recommendedResearch: SourceSearch[]; }
