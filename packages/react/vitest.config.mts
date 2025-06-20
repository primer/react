import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
  },
  test: {
    name: '@primer/react (node)',
    include: ['src/__tests__/exports.test.ts', 'src/__tests__/storybook.test.tsx'],
    environment: 'node',
  },
})

