import type { BuiltReconstructionPrompt, ReconstructionPromptInput } from '../../../types/research';

const section = (title: string, values: string[]) => `${title}\n${values.length ? values.map((value) => `- ${value}`).join('\n') : '- UNKNOWN'}`;
export function buildReconstructionPrompt(input: ReconstructionPromptInput): BuiltReconstructionPrompt {
  const evidenceUsed = input.evidence.map((evidence) => evidence.id);
  const prompt = [
    `LOCATION\n${input.location}`,
    `YEAR\n${input.year}`,
    `RECONSTRUCTION TYPE\n${input.reconstructionType}`,
    section('DOCUMENTED ARCHITECTURE', input.knownElements),
    section('DOCUMENTED MATERIALS', input.claims.filter((claim) => claim.claimType === 'ARCHITECTURAL_CHANGE').map((claim) => claim.claimText)),
    section('DOCUMENTED WINDOWS', input.knownElements.filter((item) => /window/i.test(item))),
    section('DOCUMENTED DOORS', input.knownElements.filter((item) => /door/i.test(item))),
    section('DOCUMENTED SIGNAGE', input.knownElements.filter((item) => /sign|marquee/i.test(item))),
    section('DOCUMENTED STREET CONFIGURATION', input.claims.filter((claim) => claim.claimType === 'USE_CHANGE' || claim.claimType === 'REPLACEMENT').map((claim) => claim.claimText)),
    section('HISTORICAL PHOTOGRAPH REFERENCES', input.sources.filter((source) => source.sourceType === 'PHOTOGRAPH').map((source) => `${source.title} — ${source.sourceUrl ?? source.id}`)),
    section('MAP REFERENCES', input.sources.filter((source) => source.sourceType === 'MAP').map((source) => `${source.title} — ${source.sourceUrl ?? source.id}`)),
    section('UNKNOWN ELEMENTS', input.unknownElements),
    'STRICT INSTRUCTION\nDo not invent unsupported architectural details. Label output as AI RECONSTRUCTION, not a historical photograph.'
  ].join('\n\n');
  return { prompt, metadata: { label: 'AI RECONSTRUCTION', yearDepicted: input.year, evidenceUsed, confidence: input.confidence, knownElements: input.knownElements, estimatedElements: input.estimatedElements, unknownElements: input.unknownElements } };
}
