import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';

export function ExplorePage() {
  const { entities, loading } = useEntities();
  return <section className="space-y-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Explore</p><h1 className="text-3xl font-black">Lost places and historical layers</h1><p className="mt-2 text-stone-400">Public records load from Supabase when configured, with demo records as a safe fallback.</p></div>{loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Reading the historical layer…</p> : entities.map((entity) => <EntityCard key={entity.id} entity={entity} />)}</section>;
}
