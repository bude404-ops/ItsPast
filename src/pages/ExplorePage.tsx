import { EntityCard } from '../components/EntityCard';
import { demoEntities } from '../data/demoEntities';
export function ExplorePage() { return <section className="space-y-4"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Explore</p><h1 className="text-3xl font-black">Lost places and historical layers</h1></div>{demoEntities.map((entity) => <EntityCard key={entity.id} entity={entity} />)}</section>; }
