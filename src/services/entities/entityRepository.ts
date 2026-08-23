import { demoEntities, demoReconstructions, demoSources, demoTimeline } from '../../data/demoEntities';
import type { HistoricalSource, PhysicalEntity, ReconstructionRequest, TimelineEvent } from '../../types/entities';

export interface EntityRepository {
  listEntities(): Promise<PhysicalEntity[]>;
  getEntity(id: string): Promise<PhysicalEntity | undefined>;
  getTimeline(entityId: string): Promise<TimelineEvent[]>;
  getSources(entity: PhysicalEntity): Promise<HistoricalSource[]>;
  getReconstruction(entityId: string): Promise<ReconstructionRequest | undefined>;
  search(query: string): Promise<PhysicalEntity[]>;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

export const demoEntityRepository: EntityRepository = {
  async listEntities() { return demoEntities; },
  async getEntity(id) { return demoEntities.find((entity) => entity.id === id); },
  async getTimeline(entityId) { return demoTimeline.filter((event) => event.entityId === entityId); },
  async getSources(entity) { return demoSources.filter((source) => entity.sourceIds.includes(source.id)); },
  async getReconstruction(entityId) { return demoReconstructions.find((request) => request.entityId === entityId); },
  async search(query) {
    const q = normalize(query);
    if (!q) return demoEntities;
    return demoEntities.filter((entity) => normalize([entity.name, entity.entityType, entity.description, entity.location.address, ...entity.knownChanges].join(' ')).includes(q));
  }
};
