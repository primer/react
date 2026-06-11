import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    name: '@primer/styled-react (node)',
    environment: 'node',
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)'],
    detectAsyncLeaks: true,
  },
})
