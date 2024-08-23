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
