import { useEffect, useState } from 'react';
import { reconstructionJobRepository } from '../services/reconstruction/reconstructionJobRepository';
import { summarizeJobs, type ReconstructionJob } from '../services/reconstruction/reconstructionJobs';

export function useReconstructionDashboard() {
  const [jobs, setJobs] = useState<ReconstructionJob[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    reconstructionJobRepository.listJobs().then((nextJobs) => {
      if (active) setJobs(nextJobs);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return { jobs, summary: summarizeJobs(jobs), loading };
}
