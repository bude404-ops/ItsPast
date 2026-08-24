import { Link } from 'react-router-dom';
import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';

const prompts = ['Something used to be here.', 'A theater once stood here.', 'This street looked completely different.', 'Discover what existed here in 1924.'];

export function HomePage() {
  const { entities, loading } = useEntities();
  return <section className="space-y-6">
    <div className="overflow-hidden rounded-[2.2rem] border border-stone-800 bg-[radial-gradient(circle_at_top_left,rgba(199,154,69,0.28),transparent_38%),linear-gradient(145deg,#292524,#030712)] p-6 shadow-glow">
      <p className="text-xs font-bold uppercase tracking-[0.32em] text-sepia-400">ITS PAST</p>
      <h1 className="mt-3 text-5xl font-black leading-none md:text-7xl">Everything has a story.</h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-300">Point ItsPast at a building, street, bridge, or landmark. It finds what was here, what changed, and why we know.</p>
      <div className="mt-6 grid gap-3 md:flex">
        <Link to="/scan" className="rounded-3xl bg-sepia-400 px-6 py-4 text-center font-black tracking-[0.18em] text-stone-950">DISCOVER ITS PAST</Link>
        <Link to="/explore" className="rounded-3xl border border-stone-700 px-6 py-4 text-center font-black tracking-[0.12em] text-stone-100">EXPLORE NEARBY</Link>
      </div>
    </div>
    <section className="grid gap-3 md:grid-cols-4">{prompts.map((prompt) => <Link key={prompt} to="/scan" className="rounded-3xl border border-stone-800 bg-stone-900/80 p-4 transition hover:border-sepia-400"><span className="text-2xl">✦</span><strong className="mt-3 block text-lg">{prompt}</strong><p className="mt-2 text-sm text-stone-400">Open the time machine.</p></Link>)}</section>
    <section className="grid gap-3 md:grid-cols-3">
      <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><span className="text-xs uppercase tracking-[0.2em] text-stone-500">SEE</span><strong className="mt-2 block text-xl">Find a place</strong><p className="mt-2 text-sm text-stone-400">A storefront, empty lot, bridge, or corner with a hidden past.</p></div>
      <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><span className="text-xs uppercase tracking-[0.2em] text-stone-500">SCAN</span><strong className="mt-2 block text-xl">ItsPast researches</strong><p className="mt-2 text-sm text-stone-400">Sources, timelines, images, maps, and changes are checked before being shown.</p></div>
      <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><span className="text-xs uppercase tracking-[0.2em] text-stone-500">DISCOVER</span><strong className="mt-2 block text-xl">Then vs now</strong><p className="mt-2 text-sm text-stone-400">Compare supported historical years, reconstructions, and evidence.</p></div>
    </section>
    <section className="space-y-3"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-500">Personalized discoveries</p><h2 className="mt-1 text-2xl font-black">Stories near you</h2></div><Link to="/explore" className="text-sm font-bold text-sepia-400">Explore</Link></div>{loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Opening the time machine…</p> : entities.slice(0,3).map((entity) => <EntityCard key={entity.id} entity={entity} />)}</section>
  </section>;
}
