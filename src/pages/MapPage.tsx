import { Link } from 'react-router-dom';
import { useEntities } from '../hooks/useEntityData';
import { mapLibreAdapter } from '../services/map/mapProvider';

export function MapPage() {
  const { entities, loading } = useEntities();
  const markers = mapLibreAdapter.markersForEntities(entities);
  return <section className="space-y-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Map foundation</p><h1 className="text-3xl font-black">Current world, historical layers</h1><p className="mt-2 text-stone-400">Map-ready records now come from the entity repository, so Supabase locations become markers without changing the UI.</p></div><div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><div className="grid min-h-80 place-items-center rounded-2xl border border-dashed border-stone-700 bg-stone-950 text-center text-stone-400">MapLibre viewport placeholder<br />{loading ? 'Loading markers' : `${markers.length} entity markers prepared`}</div></div>{markers.map((marker) => <Link key={marker.id} to={`/entity/${marker.id}`} className="block rounded-2xl border border-stone-800 bg-stone-900 p-3"><strong>{marker.label}</strong><p className="text-sm text-stone-400">{marker.latitude}, {marker.longitude} · {marker.status}</p></Link>)}</section>;
}
