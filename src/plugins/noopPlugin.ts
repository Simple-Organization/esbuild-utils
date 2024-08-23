import type { Plugin } from 'esbuild';

//
//

let counter = 0;

//
//

export function noopPlugin(): Plugin {
  return {
    name: 'noop' + counter++,
    setup() {},
  };
}
