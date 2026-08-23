import { useEffect, useState } from 'react';
import { entityRepository } from '../services/entities/entityRepository';
import type { HistoricalSource, PhysicalEntity, ReconstructionRequest, TimelineEvent } from '../types/entities';

export function useEntities(query?: string) {
  const [entities, setEntities] = useState<PhysicalEntity[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    const request = query === undefined ? entityRepository.listEntities() : entityRepository.search(query);
    request.then((items) => { if (active) setEntities(items); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query]);
  return { entities, loading };
}

export function useEntityBundle(id?: string) {
  const [entity, setEntity] = useState<PhysicalEntity>();
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [sources, setSources] = useState<HistoricalSource[]>([]);
  const [reconstruction, setReconstruction] = useState<ReconstructionRequest>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    if (!id) { setLoading(false); return () => { active = false; }; }
    entityRepository.getEntity(id).then(async (record) => {
      if (!active) return;
      setEntity(record);
      if (!record) return;
      const [nextTimeline, nextSources, nextReconstruction] = await Promise.all([entityRepository.getTimeline(record.id), entityRepository.getSources(record), entityRepository.getReconstruction(record.id)]);
      if (!active) return;
      setTimeline(nextTimeline);
      setSources(nextSources);
      setReconstruction(nextReconstruction);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  return { entity, timeline, sources, reconstruction, loading };
}
