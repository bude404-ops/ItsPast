import { Link, useParams } from 'react-router-dom';
import { ConfidenceBadge } from '../components/ConfidenceBadge';
import { useEntityBundle } from '../hooks/useEntityData';

export function TimelinePage() {
  const { id } = useParams();
  const { entity, timeline, sources, loading } = useEntityBundle(id);
  if (loading) return <section className="rounded-3xl border border-stone-800 bg-stone-900 p-5 text-stone-300">Reading the timeline…</section>;
  if (!entity) return <section className="rounded-3xl border border-stone-800 bg-stone-900 p-5"><h1 className="text-3xl font-black">Timeline not found</h1><Link to="/explore" className="mt-4 inline-block rounded-full bg-sepia-400 px-4 py-2 font-bold text-stone-950">Back to explore</Link></section>;
  return <section className="space-y-4"><Link to={`/entity/${entity.id}`} className="text-sepia-400">← Back to entity</Link><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Historical timeline</p><h1 className="text-3xl font-black">{entity.name}</h1></div>{timeline.length ? timeline.map((event) => <article key={event.id} className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><div className="flex gap-4"><div className="w-16 shrink-0 text-xl font-black text-sepia-400">{event.date}</div><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">{event.title}</h2><ConfidenceBadge level={event.confidence} /></div><p className="mt-2 text-stone-300">{event.description}</p><p className="mt-3 text-xs uppercase tracking-[0.2em] text-stone-500">Sources</p>{event.sourceIds.length ? event.sourceIds.map((sourceId) => { const source = sources.find((item) => item.id === sourceId); return <p key={sourceId} className="text-sm text-stone-400">{source?.title ?? sourceId}</p>; }) : <p className="text-sm text-stone-500">No direct source links yet.</p>}</div></div></article>) : <p className="rounded-3xl border border-stone-800 bg-stone-900 p-5 text-stone-400">No timeline events linked yet.</p>}</section>;
}
