import { Link } from 'react-router-dom';
import { ConfidenceBadge } from './ConfidenceBadge';
import type { PhysicalEntity } from '../types/entities';

export function EntityCard({ entity }: { entity: PhysicalEntity }) {
  return <Link to={`/entity/${entity.id}`} className="layer-card block rounded-3xl border border-stone-800 p-4 shadow-glow transition hover:border-sepia-400/60">
    <div className="flex items-start justify-between gap-3">
      <div><p className="text-xs uppercase tracking-[0.24em] text-sepia-400">{entity.entityType}</p><h3 className="text-xl font-bold text-stone-50">{entity.name}</h3></div>
      <span className="rounded-full border border-stone-700 px-2 py-1 text-xs text-stone-300">DEMO DATA</span>
    </div>
    <p className="mt-2 text-sm text-stone-300">{entity.description}</p>
    <div className="mt-3 flex flex-wrap gap-2"><ConfidenceBadge level={entity.confidenceLevel} /><span className="rounded-full bg-stone-800 px-2.5 py-1 text-xs text-stone-300">Quality {entity.dataQuality}%</span><span className="rounded-full bg-stone-800 px-2.5 py-1 text-xs text-stone-300">{entity.currentStatus}</span></div>
  </Link>;
}
