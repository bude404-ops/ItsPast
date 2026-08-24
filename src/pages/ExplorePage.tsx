import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';

const categories = ['NEAR ME', 'LOST PLACES', 'HISTORIC BUILDINGS', 'HIDDEN HISTORY', 'OLD BUSINESSES', 'HISTORICAL EVENTS', 'MOST INTERESTING'];

export function ExplorePage() {
  const { entities, loading } = useEntities();
  return <section className="space-y-5">
    <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Explore</p><h1 className="text-4xl font-black">Nearby history, hidden in plain sight.</h1><p className="mt-2 text-stone-400">Browse lost places, changed streets, old businesses, and stories worth standing in front of.</p></div>
    <div className="flex gap-2 overflow-x-auto pb-2">{categories.map((category) => <button key={category} className="shrink-0 rounded-full border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-black tracking-[0.14em] text-stone-300">{category}</button>)}</div>
    {loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Looking nearby…</p> : <div className="space-y-3">{entities.map((entity) => <EntityCard key={entity.id} entity={entity} />)}</div>}
  </section>;
}
