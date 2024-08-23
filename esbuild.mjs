import * as esbuild from 'esbuild';

//
//  Plugins
//

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  target: 'esnext',
  external: ['node:*', 'ws'],
});

//
//  Frontend
//

await esbuild.build({
  entryPoints: ['./src/frontend/index.ts'],
  bundle: true,
  outfile: 'frontend/index.js',
  target: 'esnext',
  format: 'esm',
});
