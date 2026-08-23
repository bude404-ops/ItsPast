import { Link } from 'react-router-dom';
import type { MapMarker } from '../services/map/mapProvider';

interface HistoricalMapCanvasProps { markers: MapMarker[]; loading: boolean; }

function bounds(markers: MapMarker[]) {
  const lats = markers.map((marker) => marker.latitude).filter(Number.isFinite);
  const lngs = markers.map((marker) => marker.longitude).filter(Number.isFinite);
  return {
    minLat: Math.min(...lats), maxLat: Math.max(...lats), minLng: Math.min(...lngs), maxLng: Math.max(...lngs)
  };
}

export function HistoricalMapCanvas({ markers, loading }: HistoricalMapCanvasProps) {
  const safeMarkers = markers.filter((marker) => Number.isFinite(marker.latitude) && Number.isFinite(marker.longitude));
  const box = safeMarkers.length ? bounds(safeMarkers) : { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 };
  const latSpan = box.maxLat - box.minLat || 1;
  const lngSpan = box.maxLng - box.minLng || 1;
  return <div className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900">
    <div className="relative min-h-[26rem] bg-[radial-gradient(circle_at_20%_20%,rgba(199,154,69,0.2),transparent_25%),linear-gradient(135deg,#0c0a09,#1c1917_45%,#030712)]">
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(250,250,249,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(250,250,249,.1) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />
      <div className="absolute left-4 top-4 rounded-2xl border border-stone-700 bg-stone-950/80 px-3 py-2 text-xs text-stone-300 backdrop-blur">{loading ? 'Loading historical coordinates…' : `${safeMarkers.length} mapped records`}</div>
      {safeMarkers.map((marker, index) => {
        const left = 10 + ((marker.longitude - box.minLng) / lngSpan) * 80;
        const top = 10 + ((box.maxLat - marker.latitude) / latSpan) * 80;
        return <Link key={marker.id} to={`/entity/${marker.id}`} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
          <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sepia-400/20 animate-pulse" />
          <span className="relative grid h-7 w-7 place-items-center rounded-full border border-sepia-300 bg-sepia-400 text-xs font-black text-stone-950 shadow-glow">{index + 1}</span>
          <span className="pointer-events-none absolute left-1/2 top-9 hidden w-48 -translate-x-1/2 rounded-2xl border border-stone-700 bg-stone-950 p-3 text-left text-xs text-stone-200 shadow-xl group-hover:block"><strong className="block text-sepia-400">{marker.label}</strong>{marker.status}<br />{marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}</span>
        </Link>;
      })}
      {!safeMarkers.length && !loading && <div className="absolute inset-0 grid place-items-center p-8 text-center text-stone-400">No coordinates found. The map waits until evidence has a place.</div>}
    </div>
  </div>;
}
