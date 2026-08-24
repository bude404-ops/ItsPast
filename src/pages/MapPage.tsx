import { Link } from 'react-router-dom';
import { HistoricalMapCanvas } from '../components/HistoricalMapCanvas';
import { useEntities } from '../hooks/useEntityData';
import { mapLibreAdapter } from '../services/map/mapProvider';

const modes = ['NOW', 'HISTORY', 'LOST PLACES', 'DISCOVERIES'];

export function MapPage() {
  const { entities, loading } = useEntities();
  const markers = mapLibreAdapter.markersForEntities(entities);
  return <section className="space-y-4">
    <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Map</p><h1 className="text-3xl font-black">Slide through the city.</h1><p className="mt-2 text-stone-400">Switch layers, tap a marker, and open a story without leaving the map.</p></div>
    <div className="flex gap-2 overflow-x-auto pb-1">{modes.map((mode) => <button key={mode} className="shrink-0 rounded-full border border-stone-700 bg-stone-900 px-4 py-2 text-xs font-black tracking-[0.14em] text-stone-300">{mode}</button>)}</div>
    <HistoricalMapCanvas markers={markers} loading={loading} />
    <div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Nearby discoveries</p><div className="mt-3 space-y-2">{markers.slice(0,4).map((marker) => <Link key={marker.id} to={`/entity/${marker.id}`} className="block rounded-2xl bg-stone-950 p-3"><strong>{marker.label}</strong><p className="text-sm text-stone-400">{marker.status}</p></Link>)}</div></div>
  </section>;
}
