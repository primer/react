import {defineConfig} from '@primer/vitest-config/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    name: '@primer/styled-react (node)',
    environment: 'node',
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    detectAsyncLeaks: true,
  },
})
