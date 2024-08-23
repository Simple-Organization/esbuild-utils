# esbuild utils

Projeto com plugins e utilitários para usar com **esbuild**

## fixClassNamesPlugin

Plugin para corrigir as classes que o esbuild gera

Como o esbuild gera:

```ts
var SomeClass = class {
  // ...
};
```

Como o plugin deixa

```ts
class SomeClass {
  // ...
}
```

### @internal

Esse plugin também remove os comentários com `@internal` do código final

```ts
var SomeClass = class {
  /** @internal */
  myProp = false;
};
```

Se torna

```ts
class SomeClass {
  myProp = false;
}
```

### Notas

Ele é desativado caso `sourceMap` esteja presente, pois o **fixClassNamesPlugin** não gera `sourceMap`

E na versão atual ele usa `fs` para substituir o código final, talvez no futuro isso possa mudar para alguma versão melhor integrada com o **esbuild**

### Exemplo de uso

```ts
await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  format: 'esm',
  plugins: [fixClassNamesPlugin()],
});
```

## livereloadServerPlugin

Plugin para fazer `livereload` usando websockets

Exemplo de uso

```ts
import { livereloadServerPlugin } from 'esbuild-utils';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  format: 'esm',
  target: 'esnext',
  platform: 'browser',
  plugins: [
    livereloadServerPlugin(
      active === true, // If is active or not
      'ts files', // Optional name for the files
      35000, // Optional PORT for the server, default 35000
    ),
  ],
});
```

### Notas

Quando o `livereloadServerPlugin` está desativado, ele não importa o `ws`

Cada `livereloadServerPlugin` vai compartilhar o mesmo `ws` server caso a porta seja a mesma

### No frontend

```ts
import { setupWSLiveReload } from 'esbuild-utils/frontend';

// Lembre-se de não adicionar esse código na versão de produção
if (__DEV__) {
  setupWSLiveReload();
}

// vite version
if (import.meta.env.DEV) {
  setupWSLiveReload();
}
```

`setupWSLiveReload` pode receber alguns parametros

```ts
// Demonstração com variáveis padrão
setupWSLiveReload(
  (port = 35000),
  (hostname = location.hostname),
  (protocol = 'ws'),
  (maxTries = 10),
);
```

## esbuildRunPlugin

Plugin para fazer como `nodemon` faz para o `server`, porém pode chamar um `fetch` para fechar o processo

```ts
esbuildRunPlugin({
  active: true,
  cmd: 'node server.js',
  env: {
    PORT: '3000',
  },
  onexit: async () => {
    await fetch('http://localhost:3000/exit', { method: 'POST' });
  },
});
```

Propriedades do `options`

- `active`: Assim como no `livereload`, ele determina se o plugin está ativo ou não
- `cmd`: O comando chamado pelo `import('child_process').spawn()`
- `env`: Variáveis de `env` adicionadas ao `import('child_process').spawn()`
- `onexit`: Callback chamado toda vez antes que o `import('child_process').spawn()` é destruído, normalmente para garantir que o processo é fechado corretamente

## Utils

### logTime

Função normalmente usada para dar `console.log` do `build` do `esbuild`

Exemplo:

```ts
await logTime('build-scss', async () => {
  let ctxSCSS = await esbuild.context(buildSCSSOptions);
  await ctxSCSS.watch();
});
```
