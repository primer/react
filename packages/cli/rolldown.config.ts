import {fileURLToPath} from 'node:url'
import {defineConfig} from 'rolldown'

export default defineConfig({
  input: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
  platform: 'node',
  output: {
    dir: fileURLToPath(new URL('./dist', import.meta.url)),
    format: 'esm',
  },
})
