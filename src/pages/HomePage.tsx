import { Link } from 'react-router-dom';
import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';

export function HomePage() {
  const { entities, loading } = useEntities();
  return <section className="space-y-6">
    <div className="overflow-hidden rounded-[2rem] border border-stone-800 bg-[radial-gradient(circle_at_top,rgba(199,154,69,0.22),transparent_38%),linear-gradient(135deg,#1c1917,#030712)] p-6 shadow-glow">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-sepia-400">ItsPast</p><h1 className="mt-3 text-5xl font-black leading-none">Everything has a story.</h1><p className="mt-4 text-lg text-stone-300">Point your phone at the physical world and reveal the evidence-backed history beneath the surface.</p>
      <div className="mt-6 grid gap-3"><Link to="/scan" className="rounded-3xl bg-sepia-400 px-5 py-4 text-center font-black tracking-[0.18em] text-stone-950">SCAN ITS PAST</Link><div className="grid grid-cols-3 gap-2"><Link to="/map" className="rounded-2xl border border-stone-700 p-3 text-center text-sm">EXPLORE MAP</Link><Link to="/search" className="rounded-2xl border border-stone-700 p-3 text-center text-sm">SEARCH</Link><Link to="/discoveries" className="rounded-2xl border border-stone-700 p-3 text-center text-sm">MY DISCOVERIES</Link></div></div>
    </div>
    <section className="space-y-3"><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Places near you with a past</p>{loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Loading nearby records…</p> : entities.slice(0,3).map((entity) => <EntityCard key={entity.id} entity={entity} />)}</section>
  </section>;
}
