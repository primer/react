import {readFile} from 'node:fs/promises'
import {defineConfig} from 'rolldown/config'
import type {Plugin, RolldownOptions} from 'rolldown'

const cssStylesheetPlugin = (): Plugin => {
  return {
    name: 'css-stylesheet',
    async load(id) {
      if (!id.endsWith('.css')) {
        return null
      }

      const css = await readFile(id, 'utf8')

      return {
        code: `
const sheet = new CSSStyleSheet();
sheet.replaceSync(${JSON.stringify(css)});
document.adoptedStyleeSheets.push(sheet);
export default sheet;
`,
        moduleSideEffects: true,
        moduleType: 'js',
      }
    },
  }
}

const config: RolldownOptions = defineConfig({
  input: ['./src/index.ts', './src/deprecated.ts', './src/experimental.ts', './src/next.ts'],
  plugins: [cssStylesheetPlugin()],
  external: ['react', 'react-dom', '@primer/octicons-react'],
  output: {
    dir: 'dist',
    format: 'esm',
  },
})

export default config
