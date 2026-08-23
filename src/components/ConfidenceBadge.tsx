import type { ConfidenceLevel } from '../types/entities';

const styles: Record<ConfidenceLevel, string> = {
  CONFIRMED: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  HIGH: 'border-amber-300/40 bg-amber-300/10 text-amber-100',
  MEDIUM: 'border-sky-300/40 bg-sky-300/10 text-sky-100',
  LOW: 'border-stone-400/40 bg-stone-400/10 text-stone-200',
  SPECULATIVE: 'border-rose-400/40 bg-rose-400/10 text-rose-100'
};
export function ConfidenceBadge({ level }: { level: ConfidenceLevel }) { return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[level]}`}>{level}</span>; }
