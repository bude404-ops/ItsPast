import { Link } from 'react-router-dom';
import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';

export function HomePage() {
  const { entities, loading } = useEntities();
  return <section className="space-y-6">
    <div className="overflow-hidden rounded-[2rem] border border-stone-800 bg-[radial-gradient(circle_at_top,rgba(199,154,69,0.22),transparent_38%),linear-gradient(135deg,#1c1917,#030712)] p-6 shadow-glow">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-sepia-400">ItsPast</p>
      <h1 className="mt-3 text-5xl font-black leading-none">See the past hiding in plain sight.</h1>
      <p className="mt-4 text-lg text-stone-300">Scan a place, search a landmark, or open the map to uncover evidence-backed stories from the physical world around you.</p>
      <div className="mt-6 grid gap-3">
        <Link to="/scan" className="rounded-3xl bg-sepia-400 px-5 py-4 text-center font-black tracking-[0.18em] text-stone-950">SCAN A PLACE</Link>
        <div className="grid grid-cols-3 gap-2">
          <Link to="/map" className="rounded-2xl border border-stone-700 p-3 text-center text-sm">OPEN MAP</Link>
          <Link to="/search" className="rounded-2xl border border-stone-700 p-3 text-center text-sm">SEARCH</Link>
          <Link to="/explore" className="rounded-2xl border border-stone-700 p-3 text-center text-sm">EXPLORE</Link>
        </div>
      </div>
    </div>
    <section className="grid gap-3 md:grid-cols-3">
      <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><span className="text-xs uppercase tracking-[0.2em] text-stone-500">1</span><strong className="mt-2 block text-xl">Point at the world</strong><p className="mt-2 text-sm text-stone-400">Start with a building, bridge, street, object, or memory of a place.</p></div>
      <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><span className="text-xs uppercase tracking-[0.2em] text-stone-500">2</span><strong className="mt-2 block text-xl">Reveal its story</strong><p className="mt-2 text-sm text-stone-400">Timelines and sources separate known history from rumor.</p></div>
      <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><span className="text-xs uppercase tracking-[0.2em] text-stone-500">3</span><strong className="mt-2 block text-xl">View reconstructions</strong><p className="mt-2 text-sm text-stone-400">When evidence is strong enough, see how the place may have looked before.</p></div>
    </section>
    <section className="space-y-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Start exploring</p><h2 className="mt-1 text-2xl font-black">Featured histories</h2></div><Link to="/explore" className="text-sm font-bold text-sepia-400">View all</Link></div>{loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Opening the archive…</p> : entities.slice(0,3).map((entity) => <EntityCard key={entity.id} entity={entity} />)}</section>
  </section>;
}
