import type { SourceFetchRequest, SourceProvider, SourceRecord } from '../../types/research';

export async function fetchSourceRecord(providers: SourceProvider[], request: SourceFetchRequest): Promise<SourceRecord | undefined> {
  const provider = providers.find((candidate) => candidate.config.id === request.providerId);
  if (!provider || !provider.isConfigured()) return undefined;
  return provider.fetch(request);
}
