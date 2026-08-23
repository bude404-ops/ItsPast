import { Link } from 'react-router-dom';
import { HistoricalMapCanvas } from '../components/HistoricalMapCanvas';
import { useEntities } from '../hooks/useEntityData';
import { mapLibreAdapter } from '../services/map/mapProvider';

export function MapPage() {
  const { entities, loading } = useEntities();
  const markers = mapLibreAdapter.markersForEntities(entities);
  return <section className="space-y-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Map foundation</p><h1 className="text-3xl font-black">Current world, historical layers</h1><p className="mt-2 text-stone-400">Coordinates now render as an interactive historical map layer, ready to be swapped into full MapLibre tiles when map credentials are active.</p></div><HistoricalMapCanvas markers={markers} loading={loading} />{markers.map((marker) => <Link key={marker.id} to={`/entity/${marker.id}`} className="block rounded-2xl border border-stone-800 bg-stone-900 p-3"><strong>{marker.label}</strong><p className="text-sm text-stone-400">{marker.latitude}, {marker.longitude} · {marker.status}</p></Link>)}</section>;
}
