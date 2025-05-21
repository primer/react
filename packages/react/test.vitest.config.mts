import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __DEV__: true,
  },
  test: {
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/lib-esm/**',
      '**/lib/**',
      '**/generated/**',
      '**/*.figma.tsx',
      '**/*.types.test.tsx',
    ],
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    setupFiles: ['packages/react/config/vitest/setup.ts'],
  },
})