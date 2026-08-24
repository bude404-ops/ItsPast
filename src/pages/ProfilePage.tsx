import { Link } from 'react-router-dom';

const stats = [{ label: 'Discoveries', value: '0' }, { label: 'Collections', value: '0' }, { label: 'Contributions', value: '0' }];

export function ProfilePage() {
  return <section className="space-y-5">
    <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Profile</p><h1 className="text-4xl font-black">Your history trail.</h1><p className="mt-2 text-stone-400">Manage discoveries, collections, contributions, premium, settings, and privacy.</p></div>
    <div className="grid grid-cols-3 gap-2">{stats.map((stat) => <div key={stat.label} className="rounded-3xl border border-stone-800 bg-stone-900 p-4 text-center"><strong className="block text-2xl text-sepia-400">{stat.value}</strong><span className="text-xs text-stone-400">{stat.label}</span></div>)}</div>
    <div className="space-y-2 rounded-3xl border border-stone-800 bg-stone-900 p-4">
      {['Collections', 'Contributions', 'Premium', 'Settings', 'Privacy'].map((item) => <button key={item} className="block w-full rounded-2xl bg-stone-950 p-4 text-left font-bold">{item}</button>)}
    </div>
    <Link to="/scan" className="block rounded-3xl bg-sepia-400 px-5 py-4 text-center font-black tracking-[0.16em] text-stone-950">DISCOVER ITS PAST</Link>
  </section>;
}
