import { dts } from 'rollup-plugin-dts';

const config = [
  //
  //  Plugins
  //

  {
    input: './dist/types/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },

  //
  //  Frontend
  //

  {
    input: './dist/types/src/frontend/index.d.ts',
    output: [{ file: 'frontend/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

export default config;
