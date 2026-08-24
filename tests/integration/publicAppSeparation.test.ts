import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (relative: string) => readFileSync(join(root, relative), 'utf8');
const walk = (dir: string): string[] => readdirSync(join(root, dir)).flatMap((entry) => {
  const relative = join(dir, entry);
  const absolute = join(root, relative);
  return statSync(absolute).isDirectory() ? walk(relative) : [relative];
});

describe('public ItsPast/admin separation', () => {
  it('does not expose admin routes from the public router', () => {
    const app = read('src/App.tsx');
    expect(app).not.toContain('admin/');
    expect(app).not.toContain('AdminIngestPage');
    expect(app).not.toContain('EvidenceIngestPage');
    expect(app).not.toContain('ReconstructionJobsPage');
  });

  it('keeps public navigation limited to user app sections', () => {
    const layout = read('src/layouts/AppLayout.tsx');
    for (const label of ['Home', 'Explore', 'Scan', 'Discoveries', 'Profile']) expect(layout).toContain(label);
    for (const forbidden of ['Admin', 'Research Queue', 'Sources', 'API', 'Logs']) expect(layout).not.toContain(forbidden);
  });

  it('keeps admin UI files outside public pages', () => {
    const pageFiles = walk('src/pages').map((file) => file.replace(/\\\\/g, '/'));
    expect(pageFiles.some((file) => /Admin|Ingest|ReconstructionJobs/.test(file))).toBe(false);
  });

  it('keeps the public home focused on the time-machine experience', () => {
    const home = read('src/pages/HomePage.tsx');
    expect(home).toContain('Everything has a story');
    expect(home).toContain('DISCOVER ITS PAST');
    for (const forbidden of ['Research queue', 'Source ingestion', 'API controls', 'prompt controls', 'database controls', 'provider configuration']) expect(home).not.toContain(forbidden);
  });
});
