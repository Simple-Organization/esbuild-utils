//
//

let socket: WebSocket | null = null;

let tries = 0;

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

  socket = new WebSocket(url);

  //
  // Setup WebSocket events
  //

  socket.onopen = () => {
    log(
      `Conexão com ${url} WebSocket estabelecida para livereload. Reloading in 2 seconds...`,
    );
    tries = 0;

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  socket.onmessage = (event) => {
    log('Recebido mensagem do servidor de livereload:', event.data);
    if (event.data === 'reload') {
      window.location.reload();
    }
  };

  socket.onclose = () => {
    tries++;
    log(
      'Conexão WebSocket fechada. Tentando reconectar em 3 segundos... Tentativa:',
      tries,
    );

    socket = null;

    if (tries >= maxTries) {
      log('Máximo de tentativas de reconexão excedido.');
      return;
    }

    setTimeout(
      () => setupWSLiveReload(port, hostname, protocol, maxTries),
      3000,
    );
  };
}
