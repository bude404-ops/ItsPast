import { demoEntities, demoReconstructions, demoTimeline } from '../../data/demoEntities';
import type { AIProvider } from './types';

export const mockAiProvider: AIProvider = {
  async answerQuestion({ question, entityId }) {
    const entity = demoEntities.find((item) => item.id === entityId) ?? demoEntities[0];
    const events = demoTimeline.filter((event) => event.entityId === entity.id);
    const lower = question.toLowerCase();
    return {
      facts: events.slice(0, 2).map((event) => `${event.date}: ${event.title}. ${event.description}`),
      inferences: lower.includes('changed') ? entity.knownChanges.map((change) => `Change detected: ${change}.`) : ['Only relationships backed by stored evidence should be surfaced.'],
      unknowns: ['Unknown details remain unknown until a source is added. No AI output becomes fact automatically.'],
      sourceIds: entity.sourceIds
    };
  },
  async buildPrompt({ entityId }) {
    const reconstruction = demoReconstructions.find((item) => item.entityId === entityId);
    if (!reconstruction || reconstruction.status === 'INSUFFICIENT_EVIDENCE') {
      return { status: 'INSUFFICIENT_EVIDENCE', reason: 'Insufficient evidence for a reliable reconstruction.' };
    }
    return {
      prompt: reconstruction.prompt ?? '',
      confidence: reconstruction.confidence,
      evidence: reconstruction.evidence,
      warning: 'AI GENERATED — historically informed visualization, not an authentic photograph.'
    };
  }
};
