import { expect, test } from '@playwright/test';
import {
  livereloadServerPlugin,
  wsServers,
  wsUsers,
} from '../src/plugins/livereloadServerPlugin';
import * as esbuild from 'esbuild';

//
//

test.describe('livereloadServerPlugin', () => {
  test('Should build normally', async () => {
    const PORT = 35002;
    const PORT_STR = PORT + '';

    const plugin = livereloadServerPlugin(true, 'some', PORT);

    //
    // Wait 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));

    //

    expect(wsServers[PORT_STR]).toBeDefined();
    expect(wsUsers[PORT_STR]).toBe(1);

    //

    const esbuildOptions = {
      entryPoints: ['tests/build-tests/a.ts'],
      outfile: 'tests/results/a.js',
      bundle: true,
      format: 'esm',
      target: 'esnext',
      platform: 'browser',
      plugins: [plugin],
    };

    //

    await esbuild.build(esbuildOptions as any);

    //
    // Wait 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));

    //

    expect(wsServers[PORT_STR]).toBeFalsy();
    expect(wsUsers[PORT_STR]).toBeFalsy();
  });

  //
  //

  test('Should share the same ws server', async () => {
    const PORT = 35003;
    const PORT_STR = PORT + '';

    const plugin1 = livereloadServerPlugin(true, 'some 1', PORT);
    const plugin2 = livereloadServerPlugin(true, 'some 2', PORT);

    //
    // Wait 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));

    //

    expect(wsServers[PORT_STR]).toBeDefined();
    expect(wsUsers[PORT_STR]).toBe(2);

    //

    const esbuildOptions1 = {
      entryPoints: ['tests/build-tests/a.ts'],
      outfile: 'tests/results/a.js',
      bundle: true,
      format: 'esm',
      target: 'esnext',
      platform: 'browser',
      plugins: [plugin1],
    };

    const esbuildOptions2 = {
      ...esbuildOptions1,
      plugins: [plugin2],
    };

    //

    await esbuild.build(esbuildOptions1 as any);
    await esbuild.build(esbuildOptions2 as any);

    //
    // Wait 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));

    //

    expect(wsServers[PORT_STR]).toBeFalsy();
    expect(wsUsers[PORT_STR]).toBeFalsy();
  });
});
