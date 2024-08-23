import { Plugin } from 'esbuild';
import { promises as fs } from 'node:fs';

//
//

export function fixClassNamesParseContent(content: string): string {
  return content
    .replace(/var\s+(\w+)\s+=\s+class\s+\{/g, 'class $1 ') // Remove os var SomeClass = class {
    .replace(/\/\*\*(\s|\*)*@internal\s*\*\/\s*/g, ''); // Remove os @internal
}

export function fixClassNamesParseContent2(content: string): string {
  return content
    .replace(/var\s+(\w+)\s+=\s+class /g, 'class $1 ') // Remove os var SomeClass = class {
    .replace(/\/\*\*(\s|\*)*@internal\s*\*\/\s*/g, ''); // Remove os @internal
}

//
//

export function fixClassNamesPlugin(log = false): Plugin {
  return {
    name: 'fix-class-names-plugin',
    setup(build) {
      build.onDispose(async () => {
        if (log) console.log('[fix-class-names-plugin] onDispose');

        const js = build.initialOptions.outfile;

        if (!js) {
          console.log('[fix-class-names-plugin] no js found');
          return;
        }

        if (build.initialOptions.sourcemap) {
          console.log('[fix-class-names-plugin] sourcemap found doing nothing');
          return;
        }

        let contents: Buffer | string = await fs.readFile(js);
        contents = fixClassNamesParseContent(contents.toString());

        await fs.writeFile(js, contents);
      });
    },
  };
}
