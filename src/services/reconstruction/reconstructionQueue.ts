import type { ConfidenceLevel, HistoricalSource, PhysicalEntity, ReconstructionEvidence, ReconstructionRequest, TimelineEvent } from '../../types/entities';

export interface EvidenceGateReport {
  status: 'READY' | 'BLOCKED';
  score: number;
  blockers: string[];
  strengths: string[];
  documentedCount: number;
  directSourceCount: number;
  highConfidenceSourceCount: number;
}

export interface ReconstructionQueueItem {
  entityId: string;
  entityName: string;
  targetYear: string;
  status: ReconstructionRequest['status'];
  confidence: ConfidenceLevel;
  gate: EvidenceGateReport;
  promptPreview?: string;
  warning: string;
}

const confidenceScore: Record<ConfidenceLevel, number> = { CONFIRMED: 35, HIGH: 28, MEDIUM: 18, LOW: 8, SPECULATIVE: 0 };

export function evaluateReconstructionGate(input: { reconstruction?: ReconstructionRequest; timeline: TimelineEvent[]; sources: HistoricalSource[] }): EvidenceGateReport {
  const blockers: string[] = [];
  const strengths: string[] = [];
  const reconstruction = input.reconstruction;
  const evidence = reconstruction?.evidence ?? [];
  const directSourceIds = new Set([...input.timeline.flatMap((event) => event.sourceIds), ...evidence.flatMap((item) => item.sourceIds)]);
  const directSources = input.sources.filter((source) => directSourceIds.has(source.id));
  const documentedCount = evidence.filter((item) => item.label === 'DOCUMENTED').length;
  const highConfidenceSourceCount = directSources.filter((source) => source.confidence === 'CONFIRMED' || source.confidence === 'HIGH').length;
  let score = reconstruction ? confidenceScore[reconstruction.confidence] : 0;
  score += Math.min(25, directSources.length * 8);
  score += Math.min(20, documentedCount * 10);
  score += Math.min(20, highConfidenceSourceCount * 7);
  score = Math.min(100, score);
  if (!reconstruction) blockers.push('No reconstruction request exists for this entity.');
  if (reconstruction?.status === 'INSUFFICIENT_EVIDENCE') blockers.push('Reconstruction is explicitly marked insufficient evidence.');
  if (reconstruction?.status === 'FAILED') blockers.push('Previous reconstruction attempt failed and needs review.');
  if (directSources.length < 2) blockers.push('At least two direct source links are required.');
  if (documentedCount < 1) blockers.push('At least one DOCUMENTED evidence item is required.');
  if (highConfidenceSourceCount < 1) blockers.push('At least one CONFIRMED or HIGH source must support the reconstruction.');
  if (score < 70) blockers.push('Evidence score must reach 70 before viewer release.');
  if (directSources.length >= 2) strengths.push(`${directSources.length} direct source links are attached.`);
  if (documentedCount >= 1) strengths.push(`${documentedCount} documented evidence item${documentedCount === 1 ? '' : 's'} present.`);
  if (highConfidenceSourceCount >= 1) strengths.push(`${highConfidenceSourceCount} high-confidence source${highConfidenceSourceCount === 1 ? '' : 's'} support the prompt.`);
  return { status: blockers.length ? 'BLOCKED' : 'READY', score, blockers, strengths, documentedCount, directSourceCount: directSources.length, highConfidenceSourceCount };
}

export function buildQueueItem(input: { entity: PhysicalEntity; reconstruction?: ReconstructionRequest; timeline: TimelineEvent[]; sources: HistoricalSource[] }): ReconstructionQueueItem {
  const gate = evaluateReconstructionGate(input);
  return {
    entityId: input.entity.id,
    entityName: input.entity.name,
    targetYear: input.reconstruction?.targetYear ?? input.entity.createdDate ?? 'Unknown',
    status: input.reconstruction?.status ?? 'PENDING',
    confidence: input.reconstruction?.confidence ?? 'SPECULATIVE',
    gate,
    promptPreview: input.reconstruction?.prompt,
    warning: gate.status === 'READY' ? 'AI GENERATED — historically informed visualization, not an authentic photograph.' : 'Viewer locked until evidence gate passes.'
  };
}

export function buildReconstructionPrompt(input: { entity: PhysicalEntity; reconstruction: ReconstructionRequest; sources: HistoricalSource[] }): string {
  const sourceLines = input.reconstruction.evidence.map((evidence) => {
    const sourceNames = evidence.sourceIds.map((id) => input.sources.find((source) => source.id === id)?.title ?? id).join(', ') || 'No named source';
    return `- ${evidence.label}: ${evidence.description} [${sourceNames}]`;
  });
  return [`Reconstruct ${input.entity.name} in ${input.reconstruction.targetYear}.`, 'Use only source-backed visual claims.', ...sourceLines, 'Mark unknown visual details as unresolved; do not invent signage, materials, or surroundings.'].join('\n');
}
