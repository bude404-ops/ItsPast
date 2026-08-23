export type EntityType = 'building' | 'business' | 'bridge' | 'road' | 'landmark' | 'property' | 'object' | 'vehicle' | 'infrastructure' | 'landscape' | 'neighborhood';
export type CurrentStatus = 'existing' | 'demolished' | 'renovated' | 'replaced' | 'changed' | 'unknown';
export type ConfidenceLevel = 'CONFIRMED' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SPECULATIVE';
export type DatePrecision = 'EXACT' | 'YEAR' | 'DECADE' | 'APPROXIMATE' | 'UNKNOWN';
export type SourceType = 'ARCHIVE' | 'GOVERNMENT' | 'NEWSPAPER' | 'MUSEUM' | 'LIBRARY' | 'HISTORICAL_SOCIETY' | 'BOOK' | 'ACADEMIC' | 'PHOTOGRAPH' | 'MAP' | 'USER_SUBMISSION' | 'EXPERT_SUBMISSION';

export interface LocationPoint { latitude: number; longitude: number; address: string; }
export interface HistoricalSource { id: string; sourceType: SourceType; title: string; publisher?: string; author?: string; publicationDate?: string; url?: string; archiveReference?: string; copyrightStatus?: string; description: string; confidence: ConfidenceLevel; demoData: boolean; }
export interface TimelineEvent { id: string; entityId: string; date: string; datePrecision: DatePrecision; title: string; description: string; eventType: string; confidence: ConfidenceLevel; sourceIds: string[]; }
export interface ReconstructionEvidence { id: string; label: 'DOCUMENTED' | 'STRONGLY_INFERRED' | 'ESTIMATED' | 'AI_INTERPRETATION'; description: string; sourceIds: string[]; }
export interface ReconstructionRequest { id: string; entityId: string; targetYear: string; status: 'PENDING' | 'RESEARCHING' | 'READY' | 'FAILED' | 'INSUFFICIENT_EVIDENCE'; confidence: ConfidenceLevel; prompt?: string; evidence: ReconstructionEvidence[]; }
export interface PhysicalEntity { id: string; name: string; entityType: EntityType; description: string; location: LocationPoint; createdDate?: string; destroyedDate?: string; currentStatus: CurrentStatus; confidenceLevel: ConfidenceLevel; dataQuality: number; knownChanges: string[]; sourceIds: string[]; relatedEntityIds: string[]; demoData: boolean; createdAt: string; updatedAt: string; }
export interface SavedDiscovery { id: string; entityId: string; userId: string; createdAt: string; private: boolean; }
