import type { Plugin } from 'esbuild';
import { type WebSocket } from 'ws';
import { noopPlugin } from './noopPlugin';

//
//

export let wsServers: Record<string, import('ws').WebSocketServer> = {};
export let wsUsers: Record<string, number> = {};

//
//

export let WebSocketServer: typeof import('ws').WebSocketServer | null =
  null as any;

//
//

async function createWebSocketServer(port: number) {
  if (!WebSocketServer) {
    WebSocketServer = (await import('ws')).WebSocketServer;
  }

  const PORT_STR = port + '';

  if (!wsServers[PORT_STR]) {
    const newServer = new WebSocketServer!({ port });
    let wsClients: WebSocket[] = [];

    newServer.on('connection', (ws) => {
      wsClients.push(ws);

      ws.on('close', () => {
        wsClients = wsClients.filter((x) => x !== ws);
      });
    });

    wsServers[PORT_STR] = newServer;
  }

  if (!wsUsers[PORT_STR]) {
    wsUsers[PORT_STR] = 1;
  } else {
    wsUsers[PORT_STR]++;
  }

  return wsServers[PORT_STR];
}

//
//

export function livereloadServerPlugin(
  active: boolean,
  name = '',
  port = 35000,
): Plugin {
  if (!active) {
    return noopPlugin();
  }

  let lastTimeout: any = null;
  const PORT_STR = port + '';

  //
  //

  createWebSocketServer(port);

  //
  //

  const livereloadPlugin: Plugin = {
    name: 'livereload',
    setup(build) {
      if (active) {
        //
        // Notify all connected WebSocket clients when the build is done

        build.onEnd((result) => {
          clearTimeout(lastTimeout);

          lastTimeout = setTimeout(() => {
            if (!wsServers[port]) {
              return;
            }

            wsServers[port].clients.forEach((ws) => ws.send('reload'));

            const msg = name ? `livereloading ${name}...` : 'livereloading...';

            console.log('\x1b[32m%s\x1b[0m', msg);
          }, 100);
        });

        //
        // Destroy the WebSocket server when esbuild is disposed

        build.onDispose(() => {
          if (wsUsers[PORT_STR] > 0) {
            wsUsers[PORT_STR]--;
          }

          if (wsUsers[PORT_STR] === 0) {
            wsServers[PORT_STR].close();
            delete wsServers[PORT_STR];
            delete wsUsers[PORT_STR];
          }
        });
      }
    },
  };

  //
  //

  return livereloadPlugin;
}
