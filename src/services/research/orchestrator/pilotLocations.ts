import type { ResearchQueryInput } from '../../../types/research';
import { evaluateReconstructionEligibility } from '../reconstruction/ReconstructionEvidenceBuilder';
import { buildClaimFromSource } from '../evidence/ClaimBuilder';
import { extractEvidenceForClaim } from '../evidence/EvidenceExtractor';
import { normalizeGenericSource } from '../SourceNormalizer';
import { libraryOfCongressProviderConfig } from '../providers/providerConfigs';

export const pilotLocations: ResearchQueryInput[] = [
  { entityName: 'Riverside Theater', location: 'Milwaukee Wisconsin', entityType: 'building', dateRange: { start: '1921' }, keywords: ['theater', 'photograph'] },
  { entityName: 'Pennsylvania Station', location: 'New York City', entityType: 'landmark', dateRange: { start: '1910', end: '1963' }, keywords: ['railroad', 'demolished'] },
  { entityName: 'Eads Bridge', location: 'St. Louis Missouri', entityType: 'bridge', dateRange: { start: '1874' } },
  { entityName: 'Pullman Historic District', location: 'Chicago Illinois', entityType: 'neighborhood', dateRange: { start: '1880' } },
  { entityName: 'Fox Theatre', location: 'Atlanta Georgia', entityType: 'building', dateRange: { start: '1929' } },
  { entityName: 'Route 66 gas station', location: 'Tucumcari New Mexico', entityType: 'business', dateRange: { start: '1940' } },
  { entityName: 'Brooklyn Bridge', location: 'New York City', entityType: 'bridge', dateRange: { start: '1883' } },
  { entityName: 'Union Station', location: 'Los Angeles California', entityType: 'landmark', dateRange: { start: '1939' } },
  { entityName: 'Central Library', location: 'Detroit Michigan', entityType: 'building', dateRange: { start: '1921' } },
  { entityName: 'Market Street Railway', location: 'San Francisco California', entityType: 'infrastructure', dateRange: { start: '1906' } },
  { entityName: 'Cast Iron District', location: 'SoHo New York', entityType: 'neighborhood', dateRange: { start: '1870' } },
  { entityName: 'Old Post Office', location: 'Washington DC', entityType: 'building', dateRange: { start: '1899' } }
];

export function evaluatePilotFixtures() {
  return pilotLocations.map((input, index) => {
    const source = normalizeGenericSource(libraryOfCongressProviderConfig, { id: `pilot-${index}`, title: `${input.entityName} historical photograph and map record`, description: `${input.entityName} appears in at least one archive/map/photo candidate for ${input.location}.`, date: input.dateRange?.start, location: input.location, rights: 'Check item rights statement', format: index % 3 === 0 ? 'map' : 'photograph' });
    const claim = buildClaimFromSource({ entityId: input.entityName ?? `pilot-${index}`, source, text: source.description });
    const evidence = extractEvidenceForClaim(claim, source);
    const eligibility = evaluateReconstructionEligibility({ claims: [claim], evidence: [evidence], sources: [source] });
    return { input, sourcesFound: 1, imagesAvailable: source.sourceType === 'PHOTOGRAPH', mapsAvailable: source.sourceType === 'MAP', eligibility };
  });
}
