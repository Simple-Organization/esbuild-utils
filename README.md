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
