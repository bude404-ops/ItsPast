import { useMemo, useState } from 'react';
import { draftToSeedSql, submitEntityDraft, validateEntityDraft } from '../services/entityIngestion';

const sampleDraft = JSON.stringify({
  name: 'Old City Waterworks',
  entityType: 'infrastructure',
  description: 'A verified municipal waterworks site awaiting source-linked timeline events.',
  latitude: 40.7128,
  longitude: -74.006,
  address: 'Example civic parcel',
  createdDate: '1898',
  currentStatus: 'changed',
  confidenceLevel: 'MEDIUM'
}, null, 2);

export function AdminIngestPage() {
  const [raw, setRaw] = useState(sampleDraft);
  const [message, setMessage] = useState('');
  const parsed = useMemo(() => {
    try { return validateEntityDraft(JSON.parse(raw)); } catch { return { valid: false, errors: ['JSON is malformed.'] }; }
  }, [raw]);
  const sql = parsed.valid && parsed.draft ? draftToSeedSql(parsed.draft) : '';
  async function submit() {
    setMessage('');
    if (!parsed.valid || !parsed.draft) { setMessage('Fix validation errors before submitting.'); return; }
    const result = await submitEntityDraft(parsed.draft);
    setMessage(result.message);
  }
  return <section className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Admin ingestion</p><h1 className="text-3xl font-black">Create evidence-ready entity records</h1><p className="mt-2 text-stone-400">Validate a physical entity draft, submit through Supabase when admin policies are active, or copy the generated seed SQL.</p></div><div className="grid gap-4 lg:grid-cols-2"><textarea value={raw} onChange={(event) => setRaw(event.target.value)} className="min-h-96 rounded-3xl border border-stone-700 bg-stone-950 p-4 font-mono text-sm text-stone-100" spellCheck={false} /><div className="space-y-4"><div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><h2 className="text-xl font-bold">Validation</h2>{parsed.valid ? <p className="mt-2 text-emerald-400">Draft is structurally valid.</p> : <ul className="mt-2 list-disc space-y-1 pl-5 text-orange-300">{parsed.errors.map((error) => <li key={error}>{error}</li>)}</ul>}</div><div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Seed SQL</h2><button onClick={() => void navigator.clipboard?.writeText(sql)} disabled={!sql} className="rounded-full bg-sepia-400 px-3 py-1 text-sm font-bold text-stone-950 disabled:opacity-40">Copy</button></div><pre className="mt-3 overflow-auto rounded-2xl bg-stone-950 p-3 text-xs text-stone-300">{sql || 'Valid SQL appears here.'}</pre></div><button onClick={() => void submit()} className="w-full rounded-3xl bg-sepia-400 px-5 py-4 font-black tracking-[0.18em] text-stone-950">SUBMIT TO SUPABASE</button>{message && <p className="rounded-2xl border border-stone-800 bg-stone-900 p-3 text-sm text-stone-300">{message}</p>}</div></div></section>;
}
