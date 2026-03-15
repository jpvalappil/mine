import esbuild from 'esbuild';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import { readFileSync, writeFileSync, watch as fsWatch, copyFileSync } from 'fs';

const watching = process.argv.includes('--watch');

async function buildCSS() {
  const css = readFileSync('src/css/mine.css', 'utf8');
  const result = await postcss([postcssImport]).process(css, { from: 'src/css/mine.css' });
  writeFileSync('dist/mine.css', result.css);
  if (!watching) {
    const minified = await postcss([cssnano]).process(result.css, { from: undefined });
    writeFileSync('dist/mine.min.css', minified.css);
  }
  return result;
}

if (watching) {
  const [iifeCtx, esmCtx] = await Promise.all([
    esbuild.context({ entryPoints: ['src/js/mine.js'], bundle: true, outfile: 'dist/mine.js', format: 'iife', globalName: 'mine' }),
    esbuild.context({ entryPoints: ['src/js/mine.js'], bundle: true, outfile: 'dist/mine.esm.js', format: 'esm' }),
  ]);
  await Promise.all([iifeCtx.watch(), esmCtx.watch()]);
  await buildCSS();
  fsWatch('src/css', { recursive: true }, async (_, filename) => {
    if (filename && filename.endsWith('.css')) {
      try { await buildCSS(); console.log('CSS rebuilt'); }
      catch (err) { console.error('CSS build error:', err.message); }
    }
  });
  console.log('Watching for changes…');
} else {
  await Promise.all([
    esbuild.build({ entryPoints: ['src/js/mine.js'], bundle: true, minify: true, outfile: 'dist/mine.js', format: 'iife', globalName: 'mine' }),
    esbuild.build({ entryPoints: ['src/js/mine.js'], bundle: true, minify: true, outfile: 'dist/mine.esm.js', format: 'esm' }),
    buildCSS(),
  ]);
  copyFileSync('src/js/mine.d.ts', 'dist/mine.d.ts');
  console.log('Build complete');
}
