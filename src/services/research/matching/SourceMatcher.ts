import type { AddressHistory, EntityMatchCandidate, MatchConfidence, SourceRecord } from '../../../types/research';

export function normalizeAddress(address: string): string {
  return address.toLowerCase().replace(/\bstreet\b/g, 'st').replace(/\bavenue\b/g, 'ave').replace(/\broad\b/g, 'rd').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function buildAddressHistory(input: { currentAddress?: string; historicAddress?: string; alternateAddresses?: string[]; parcelIdentifier?: string; coordinates?: { latitude: number; longitude: number }; city?: string; state?: string; country?: string }): AddressHistory {
  return { currentAddress: input.currentAddress, historicAddress: input.historicAddress, alternateAddresses: input.alternateAddresses ?? [], parcelIdentifier: input.parcelIdentifier, coordinates: input.coordinates, city: input.city, state: input.state, country: input.country };
}

function scoreCandidate(name: string, source: SourceRecord, address?: AddressHistory): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 0;
  const n = name.toLowerCase();
  const title = source.title.toLowerCase();
  if (title.includes(n) || n.includes(title)) { score += 40; signals.push('name overlap'); }
  const addresses = [address?.currentAddress, address?.historicAddress, ...(address?.alternateAddresses ?? [])].filter(Boolean).map((item) => normalizeAddress(item as string));
  const haystack = normalizeAddress(`${source.title} ${source.description} ${source.location ?? ''}`);
  if (addresses.some((candidate) => candidate && haystack.includes(candidate))) { score += 35; signals.push('address overlap'); }
  if (address?.coordinates && source.latitude && source.longitude) {
    const distance = Math.abs(address.coordinates.latitude - source.latitude) + Math.abs(address.coordinates.longitude - source.longitude);
    if (distance < 0.01) { score += 25; signals.push('coordinate proximity'); }
  }
  if (source.date) { score += 5; signals.push('dated source'); }
  return { score, signals };
}

export function matchSourceToEntity(input: { entityName: string; address?: AddressHistory; source: SourceRecord }): EntityMatchCandidate {
  const scored = scoreCandidate(input.entityName, input.source, input.address);
  const matchConfidence: MatchConfidence = scored.score >= 70 ? 'HIGH' : scored.score >= 40 ? 'MEDIUM' : 'LOW';
  return { name: input.entityName, address: input.address, aliases: [], sourceRecordIds: [input.source.id], matchConfidence, signals: scored.signals };
}

export function shouldAutoMerge(candidate: EntityMatchCandidate): boolean {
  return candidate.matchConfidence === 'HIGH' && candidate.signals.includes('address overlap');
}
