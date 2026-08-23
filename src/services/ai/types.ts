import type { ConfidenceLevel, ReconstructionEvidence } from '../../types/entities';

export interface ResearchAnswer { facts: string[]; inferences: string[]; unknowns: string[]; sourceIds: string[]; }
export interface ResearchProvider { answerQuestion(input: { question: string; entityId?: string }): Promise<ResearchAnswer>; }
export interface ReconstructionPrompt { prompt: string; confidence: ConfidenceLevel; evidence: ReconstructionEvidence[]; warning: string; }
export interface ReconstructionProvider { buildPrompt(input: { entityId: string; targetYear: string }): Promise<ReconstructionPrompt | { status: 'INSUFFICIENT_EVIDENCE'; reason: string }>; }
export interface AIProvider extends ResearchProvider, ReconstructionProvider {}
