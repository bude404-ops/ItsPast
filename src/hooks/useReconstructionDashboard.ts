import { useEffect, useState } from 'react';
import { entityRepository } from '../services/entities/entityRepository';
import { buildQueueItem, buildReconstructionPrompt } from '../services/reconstruction/reconstructionQueue';
import { createReconstructionJob, summarizeJobs, type ReconstructionJob } from '../services/reconstruction/reconstructionJobs';

export function useReconstructionDashboard() {
  const [jobs, setJobs] = useState<ReconstructionJob[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    entityRepository.listEntities().then(async (entities) => {
      const nextJobs = await Promise.all(entities.map(async (entity) => {
        const [timeline, sources, reconstruction] = await Promise.all([
          entityRepository.getTimeline(entity.id),
          entityRepository.getSources(entity),
          entityRepository.getReconstruction(entity.id)
        ]);
        const item = buildQueueItem({ entity, timeline, sources, reconstruction });
        const prompt = reconstruction ? (reconstruction.prompt || buildReconstructionPrompt({ entity, reconstruction, sources })) : '';
        return createReconstructionJob({ item, reconstruction, prompt });
      }));
      if (active) setJobs(nextJobs);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { jobs, summary: summarizeJobs(jobs), loading };
}
