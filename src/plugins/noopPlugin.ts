import type { Plugin } from 'esbuild';

//
//

let counter = 0;

//
//

export const noopPlugin: Plugin = {
  name: 'noop' + counter++,
  setup(build) {
    // noop
  },
};
