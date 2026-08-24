import { Link } from 'react-router-dom';
import { useEntities } from '../hooks/useEntityData';

const researchStates = ['IDENTIFYING LOCATION', 'RESEARCHING HISTORY', 'SEARCHING ARCHIVES', 'BUILDING TIMELINE', 'CHECKING SOURCES', 'ITS PAST FOUND'];

export function ScanPage() {
  const { entities, loading } = useEntities();
  return <section className="space-y-5">
    <div className="rounded-[2rem] border border-stone-800 bg-stone-900 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Time machine</p>
      <h1 className="mt-2 text-4xl font-black">Scan its past.</h1>
      <p className="mt-3 text-stone-300">Camera scanning is prepared as the core flow. Until live recognition is active, choose a nearby candidate and ItsPast will show only evidence-backed history.</p>
      <div className="mt-5 rounded-[2rem] border border-dashed border-sepia-400/50 bg-stone-950 p-6 text-center">
        <div className="mx-auto flex aspect-square max-w-xs items-center justify-center rounded-[2rem] border-2 border-sepia-400/80 bg-[radial-gradient(circle,rgba(199,154,69,0.18),transparent_58%)]">
          <div className="h-36 w-36 rounded-3xl border border-sepia-400/70" aria-label="scan targeting frame" />
        </div>
        <button className="mt-5 rounded-full bg-sepia-400 px-6 py-3 font-black tracking-[0.16em] text-stone-950">SCAN ITS PAST</button>
        <p className="mt-3 text-sm text-stone-500">If research is still running, this will show Research in progress and let you return later.</p>
      </div>
    </div>
    <div className="grid gap-2 md:grid-cols-3">{researchStates.map((state) => <div key={state} className="rounded-2xl border border-stone-800 bg-stone-900/70 p-3 text-sm font-bold text-stone-300">{state}</div>)}</div>
    <div className="space-y-3"><h2 className="text-xl font-bold">Try a place now</h2>{loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Finding candidates…</p> : entities.map((entity) => <Link key={entity.id} to={`/entity/${entity.id}`} className="block rounded-2xl border border-stone-800 bg-stone-900 p-4"><div className="flex justify-between gap-3"><strong>{entity.name}</strong><span className="text-sepia-400">{entity.confidenceLevel}</span></div><p className="text-sm text-stone-400">{entity.location.address}</p></Link>)}</div>
  </section>;
}
