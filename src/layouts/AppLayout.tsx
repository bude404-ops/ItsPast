import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Scan', icon: '◎' }, { to: '/explore', label: 'Explore', icon: '⌖' }, { to: '/map', label: 'Map', icon: '▧' }, { to: '/discoveries', label: 'Saved', icon: '✦' }, { to: '/profile', label: 'Profile', icon: '●' }
];
export function AppLayout() {
  return <div className="min-h-screen bg-stone-950 text-stone-50">
    <header className="sticky top-0 z-20 border-b border-stone-800/80 bg-stone-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between"><NavLink to="/" className="font-black tracking-[0.18em] text-sepia-400">ITSPAST</NavLink><div className="flex items-center gap-2"><NavLink to="/admin/ingest" className="hidden rounded-full border border-stone-700 px-3 py-2 text-stone-300 md:inline-block">Ingest</NavLink><NavLink to="/admin/evidence" className="hidden rounded-full border border-stone-700 px-3 py-2 text-stone-300 md:inline-block">Evidence</NavLink><NavLink to="/search" className="rounded-full border border-stone-700 px-3 py-2 text-stone-300" aria-label="Search">Search</NavLink></div></div>
    </header>
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-5"><Outlet /></main>
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-800 bg-stone-950/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-5 gap-1">{nav.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex flex-col items-center rounded-2xl px-2 py-2 text-xs ${isActive ? 'bg-sepia-400 text-stone-950' : 'text-stone-400'}`}><span className="text-lg">{item.icon}</span><span>{item.label}</span></NavLink>)}</div>
    </nav>
  </div>;
}
