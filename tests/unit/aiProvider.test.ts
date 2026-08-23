import { describe, expect, it } from 'vitest';
import { mockAiProvider } from '../../src/services/ai/mockAiProvider';

describe('AI provider abstraction', () => {
  it('separates facts, inferences, and unknowns', async () => {
    const answer = await mockAiProvider.answerQuestion({ question: 'What changed here?', entityId: 'riverside-theater' });
    expect(answer.facts.length).toBeGreaterThan(0);
    expect(answer.inferences.join(' ')).toContain('Change detected');
    expect(answer.unknowns.join(' ')).toContain('Unknown');
  });

  it('labels reconstruction prompts as AI generated', async () => {
    const prompt = await mockAiProvider.buildPrompt({ entityId: 'riverside-theater', targetYear: '1954' });
    expect('warning' in prompt && prompt.warning).toContain('AI GENERATED');
  });
});
