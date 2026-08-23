import type { PhysicalEntity } from '../../types/entities';

export interface MapMarker { id: string; latitude: number; longitude: number; label: string; status: string; confidence: string; }
export interface MapProviderAdapter { name: string; markersForEntities(entities: PhysicalEntity[]): MapMarker[]; }
export const mapLibreAdapter: MapProviderAdapter = {
  name: 'maplibre',
  markersForEntities(entities) {
    return entities
      .filter((entity) => Number.isFinite(entity.location.latitude) && Number.isFinite(entity.location.longitude))
      .map((entity) => ({ id: entity.id, latitude: entity.location.latitude, longitude: entity.location.longitude, label: entity.name, status: entity.currentStatus, confidence: entity.confidenceLevel }));
  }
};
