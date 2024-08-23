let socket: WebSocket | null = null;

//
//

export function setupWSLiveReload(
  port = 35000,
  hostname = location.hostname,
  protocol: 'ws' | 'wss' = 'ws',
  maxTries = 10,
) {
  if (socket) {
    throw new Error('Já existe uma conexão WebSocket estabelecida.');
  }

  //
  //

  function log(message: string, ...args: any[]) {
    console.log(`[setupWSLiveReload] ${message}`, ...args);
  }

  //
  //

  const url = `${protocol}://${hostname}:${port}`;
  let tries = 0;

  socket = new WebSocket(url);

  //
  // Setup WebSocket events
  //

  socket.onopen = () => {
    log(`Conexão com ${url} WebSocket estabelecida para livereload.`);
    tries = 0;
  };

  socket.onmessage = (event) => {
    log('Recebido mensagem do servidor de livereload:', event.data);
    if (event.data === 'reload') {
      window.location.reload();
    }
  };

  socket.onclose = () => {
    log('Conexão WebSocket fechada. Tentando reconectar em 3 segundos...');

    tries++;

    if (tries >= maxTries) {
      log('Máximo de tentativas de reconexão excedido.');
      return;
    }

    setTimeout(() => setupWSLiveReload(port, hostname, protocol), 3000);
  };
}
