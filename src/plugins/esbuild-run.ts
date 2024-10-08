import * as esbuild from 'esbuild';
import { noopPlugin } from './noopPlugin';

//
//

export type EsbuildRunPluginOptions = {
  /**
   * Whether the plugin is active or not, if false, it will return a noop plugin
   */
  active: boolean;

  /**
   * The command to run, e.g. `node server.js`
   */
  cmd: string;

  /**
   * The environment variables to pass to the child
   * process
   */
  env?: Record<string, string>;

  /**
   * The function to call when the child process exits, can be async
   *
   * Example:
   *
   * ```ts
   * onexit: async () => {
   *  await fetch('http://localhost:3000/exit', { method: 'POST' });
   * }
   * ```
   */
  onexit?: () => any;
};

//
//

export function esbuildRunPlugin(
  options: EsbuildRunPluginOptions,
): esbuild.Plugin {
  //
  //

  const active = options.active;

  //

  if (!active) {
    return noopPlugin();
  }

  //
  //

  const noop = () => {};

  let unsubChildProcess: () => any = noop;
  let lastTimeout: any = null;

  //
  //

  const env = options.env || {};
  const onexit: () => any = options.onexit || noop;
  const cmd = options.cmd;
  let treekill: typeof import('tree-kill') | undefined;

  //
  //

  async function spawnServer() {
    console.log();

    const { spawn } = await import('node:child_process');

    const nodeProcess = spawn(cmd, {
      stdio: 'inherit' as any,
      env: { ...process.env, ...env },
      shell: true,
    }) as any;

    //
    //

    console.log('🚀 Running server...');

    //
    //

    return async () => {
      treekill = treekill || (await import('tree-kill')).default;

      await new Promise((resolve, reject) => {
        treekill!(nodeProcess.pid, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        });
      });
      
      await onexit();
    };
  }

  //
  //

  return {
    name: 'esbuild-run',
    setup(build) {
      //
      //

      build.onEnd(async (result) => {
        await unsubChildProcess();

        clearTimeout(lastTimeout);

        lastTimeout = setTimeout(async () => {
          unsubChildProcess = await spawnServer();
        }, 100);
      });
    },
  };
}
