import {fileURLToPath} from 'node:url'
import {defineConfig} from 'rolldown'

export default defineConfig({
  input: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
  platform: 'node',
  output: {
    file: fileURLToPath(new URL('./dist/index.js', import.meta.url)),
    format: 'esm',
  },
})
