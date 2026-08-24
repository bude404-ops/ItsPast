import { Link } from 'react-router-dom';
import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';
import { useSavedDiscoveries } from '../hooks/useSavedDiscoveries';

export function DiscoveriesPage() {
  const { saved } = useSavedDiscoveries();
  const { entities, loading } = useEntities();
  const savedEntities = entities.filter((entity) => saved.includes(entity.id));
  return <section className="space-y-5">
    <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">My Discoveries</p><h1 className="text-4xl font-black">Your personal time capsule.</h1><p className="mt-2 text-stone-400">Saved places, collections, reconstructions, and recently viewed stories.</p></div>
    <div className="grid gap-3 md:grid-cols-3"><button className="rounded-3xl border border-stone-800 bg-stone-900 p-4 text-left font-bold">CREATE COLLECTION</button><button className="rounded-3xl border border-stone-800 bg-stone-900 p-4 text-left font-bold">SHARE CARD</button><Link to="/scan" className="rounded-3xl bg-sepia-400 p-4 text-center font-black text-stone-950">SCAN MORE</Link></div>
    {loading ? <p className="rounded-3xl border border-stone-800 bg-stone-900 p-5 text-stone-400">Loading discoveries…</p> : savedEntities.length ? savedEntities.map((entity) => <EntityCard key={entity.id} entity={entity} />) : <div className="rounded-3xl border border-stone-800 bg-stone-900 p-5"><p className="text-stone-300">No discoveries saved yet.</p><Link to="/explore" className="mt-4 inline-block rounded-full bg-sepia-400 px-4 py-2 font-black text-stone-950">Find your first story</Link></div>}
  </section>;
}
