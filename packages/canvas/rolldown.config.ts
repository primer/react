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
const sheet = typeof CSSStyleSheet !== 'undefined' ? new CSSStyleSheet() : null;
if (sheet) sheet.replaceSync(${JSON.stringify(css)});
if (sheet && typeof document !== 'undefined' && 'adoptedStyleSheets' in document) document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
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
    minify: true,
  },
  transform: {
    define: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
  },
})

export default config
