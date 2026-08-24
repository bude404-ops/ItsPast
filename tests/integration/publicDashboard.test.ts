import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('public GitHub index dashboard', () => {
  it('presents a visitor-facing loading shell without admin or data operations copy', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('ItsPast');
    expect(html).toContain('place histories');
    expect(html).not.toContain('source ingestion');
    expect(html).not.toContain('reconstruction jobs');
    expect(html).not.toContain('admin');
  });
});
