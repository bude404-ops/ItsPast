import { useDeferredValue, useState } from 'react';
import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntityData';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const { entities, loading } = useEntities(deferredQuery);
  return <section className="space-y-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Search</p><h1 className="text-3xl font-black">Ask what was here</h1></div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="old theaters, bridge replaced, what used to be here" className="w-full rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-stone-50" />{loading ? <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">Searching verified records…</p> : entities.length ? entities.map((entity) => <EntityCard key={entity.id} entity={entity} />) : <p className="rounded-2xl border border-stone-800 bg-stone-900 p-4 text-stone-400">No verified record found. ItsPast should say it does not know.</p>}</section>;
}
