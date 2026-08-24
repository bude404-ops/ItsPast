import { useMemo, useState } from 'react';
import { evidencePackageToSeedSql, submitEvidencePackage, validateEvidencePackage } from '../services/evidenceIngestion';

const samplePackage = JSON.stringify({
  entityId: '00000000-0000-0000-0000-000000000000',
  sources: [
    { sourceType: 'NEWSPAPER', title: 'Waterworks Opening Notice', publisher: 'City Gazette', publicationDate: '1898-06-04', url: 'https://example.org/archive/waterworks', description: 'Public notice describing the opening of the waterworks facility.', confidence: 'HIGH' },
    { sourceType: 'MAP', title: '1902 Sanborn Sheet', publisher: 'Sanborn Map Company', publicationDate: '1902', archiveReference: 'Sheet 14', description: 'Fire insurance map showing the parcel footprint.', confidence: 'CONFIRMED' }
  ],
  timeline: [
    { date: '1898', datePrecision: 'YEAR', title: 'Waterworks opened', description: 'The municipal facility began operation according to a public notice.', eventType: 'opened', confidence: 'HIGH', sourceTitles: ['Waterworks Opening Notice'] }
  ],
  reconstruction: {
    targetYear: '1902', status: 'READY', confidence: 'HIGH', prompt: 'Reconstruct the waterworks exterior using only source-backed details.',
    evidence: [
      { label: 'DOCUMENTED', description: 'Parcel footprint documented by the Sanborn sheet.', sourceTitles: ['1902 Sanborn Sheet'] },
      { label: 'STRONGLY_INFERRED', description: 'Operational context inferred from opening notice and map placement.', sourceTitles: ['Waterworks Opening Notice'] }
    ]
  }
}, null, 2);

export function EvidenceIngestPage() {
  const [raw, setRaw] = useState(samplePackage);
  const [message, setMessage] = useState('');
  const parsed = useMemo(() => {
    try { return validateEvidencePackage(JSON.parse(raw)); } catch { return { valid: false, errors: ['JSON is malformed.'] }; }
  }, [raw]);
  const sql = parsed.valid && parsed.draft ? evidencePackageToSeedSql(parsed.draft) : '';
  async function submit() {
    setMessage('');
    if (!parsed.valid || !parsed.draft) { setMessage('Fix validation errors before submitting.'); return; }
    const result = await submitEvidencePackage(parsed.draft);
    setMessage(result.message);
  }
  return <section className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-sepia-400">Evidence ingestion</p><h1 className="text-3xl font-black">Bind sources to timelines and reconstructions</h1><p className="mt-2 text-stone-400">Every claim must name its source. This screen validates source packages and generates reviewed SQL for source, timeline, and reconstruction evidence records.</p></div><div className="grid gap-4 lg:grid-cols-2"><textarea value={raw} onChange={(event) => setRaw(event.target.value)} className="min-h-[36rem] rounded-3xl border border-stone-700 bg-stone-950 p-4 font-mono text-sm text-stone-100" spellCheck={false} /><div className="space-y-4"><div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><h2 className="text-xl font-bold">Evidence validation</h2>{parsed.valid ? <p className="mt-2 text-emerald-400">Package is source-linked and reconstruction-ready.</p> : <ul className="mt-2 list-disc space-y-1 pl-5 text-orange-300">{parsed.errors.map((error) => <li key={error}>{error}</li>)}</ul>}</div><div className="rounded-3xl border border-stone-800 bg-stone-900 p-4"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Reviewed SQL</h2><button onClick={() => void navigator.clipboard?.writeText(sql)} disabled={!sql} className="rounded-full bg-sepia-400 px-3 py-1 text-sm font-bold text-stone-950 disabled:opacity-40">Copy</button></div><pre className="mt-3 max-h-[24rem] overflow-auto rounded-2xl bg-stone-950 p-3 text-xs text-stone-300">{sql || 'Valid source-linked SQL appears here.'}</pre></div><button onClick={() => void submit()} className="w-full rounded-3xl bg-sepia-400 px-5 py-4 font-black tracking-[0.18em] text-stone-950">STAGE EVIDENCE PACKAGE</button>{message && <p className="rounded-2xl border border-stone-800 bg-stone-900 p-3 text-sm text-stone-300">{message}</p>}</div></div></section>;
}
