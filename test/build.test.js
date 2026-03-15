import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { gzipSync } from 'zlib';
import { describe, expect, it, beforeAll } from 'vitest';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '..');

beforeAll(() => { execSync('node build.js', { cwd: root, stdio: 'inherit' }); }, 30000);

describe('build output', () => {
  it('dist/mine.css exists', () => { expect(existsSync(resolve(root, 'dist/mine.css'))).toBe(true); });
  it('dist/mine.min.css exists', () => { expect(existsSync(resolve(root, 'dist/mine.min.css'))).toBe(true); });
  it('dist/mine.js exists', () => { expect(existsSync(resolve(root, 'dist/mine.js'))).toBe(true); });
  it('dist/mine.esm.js exists', () => { expect(existsSync(resolve(root, 'dist/mine.esm.js'))).toBe(true); });
  it('gzipped CSS is under 8192 bytes', () => {
    const css = readFileSync(resolve(root, 'dist/mine.min.css'));
    expect(gzipSync(css).length).toBeLessThan(8192);
  });
  it('gzipped JS is under 3072 bytes', () => {
    const js = readFileSync(resolve(root, 'dist/mine.js'));
    expect(gzipSync(js).length).toBeLessThan(3072);
  });
  it('dist/mine.css contains @layer reset', () => {
    expect(readFileSync(resolve(root, 'dist/mine.css'), 'utf8')).toContain('@layer reset');
  });
  it('dist/mine.css contains CSS custom properties', () => {
    expect(readFileSync(resolve(root, 'dist/mine.css'), 'utf8')).toContain('--mine-color-bg');
  });
});
