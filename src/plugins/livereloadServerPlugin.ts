import type { Plugin } from 'esbuild';
import { type WebSocket } from 'ws';
import { noopPlugin } from './noopPlugin';

//
//

export let wsServers: Record<number, import('ws').WebSocketServer> = {};
export let wsUsers: Record<number, number> = {};

//
//

export let WebSocketServer: typeof import('ws').WebSocketServer | null = null as any;

//
//

async function createWebSocketServer(port: number) {
  if (!WebSocketServer) {
    WebSocketServer = (await import('ws')).WebSocketServer;
  }

  if (!wsServers[port]) {
    const newServer = new WebSocketServer!({ port });
    let wsClients: WebSocket[] = [];

    newServer.on('connection', (ws) => {
      wsClients.push(ws);

      ws.on('close', () => {
        wsClients = wsClients.filter((x) => x !== ws);
      });
    });

    wsServers[port] = newServer;
  }

  if (!wsUsers[port]) {
    wsUsers[port] = 0;
  } else {
    wsUsers[port]++;
  }

  return wsServers[port];
}

//
//

export function livereloadServerPlugin(active: boolean, port = 35000): Plugin {
  if (!active) {
    return noopPlugin;
  }

  let lastTimeout: any = null;

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
            console.log('\x1b[32m%s\x1b[0m', 'livereloading...');
          }, 100);
        });

        //
        // Destroy the WebSocket server when esbuild is disposed

        build.onDispose(() => {
          if (wsUsers[port] > 0) {
            wsUsers[port]--;
          }

          if (wsUsers[port] === 0) {
            wsServers[port].close();
            delete wsServers[port];
            delete wsUsers[port];
          }
        });
      }
    },
  };

  //
  //

  return livereloadPlugin;
}
