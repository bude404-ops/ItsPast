import type { ResearchQueryInput, SourceSearch } from '../../types/research';

const unique = (values: string[]) => [...new Set(values.map((value) => value.trim()).filter(Boolean))];

export function generateResearchQueries(input: ResearchQueryInput): string[] {
  const names = unique([input.entityName ?? '', ...(input.historicNames ?? []), ...(input.keywords ?? [])]);
  const location = input.location?.trim();
  const years = unique([input.dateRange?.start ?? '', input.dateRange?.end ?? '']);
  const base = names.flatMap((name) => [name, `${name} history`, `${name} old photo`, `${name} newspaper`, `${name} building`, `${name} historic map`]);
  const dated = names.flatMap((name) => years.map((year) => `${name} ${year}`));
  const located = location ? names.flatMap((name) => [`${name} ${location}`, `${location} ${name} history`, `${location} historic map`]) : [];
  const landmarks = (input.nearbyLandmarks ?? []).flatMap((landmark) => [`${landmark} ${location ?? ''} history`, `${landmark} old photo`]);
  const coordinates = input.coordinates ? [`${input.coordinates.latitude},${input.coordinates.longitude}`, `${input.coordinates.latitude} ${input.coordinates.longitude} historic map`] : [];
  const parcel = input.parcelId ? [`parcel ${input.parcelId}`, `${input.parcelId} historic property`] : [];
  return unique([...base, ...dated, ...located, ...landmarks, ...coordinates, ...parcel]);
}

export function buildProviderSearches(providerId: string, input: ResearchQueryInput, limit = 10): SourceSearch[] {
  return generateResearchQueries(input).map((query) => ({ providerId, query, searchType: query.includes('photo') ? 'IMAGE' : query.includes('map') ? 'MAP' : 'TEXT', limit }));
}
