import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'
import {isSupported} from './script/react-compiler.mjs'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              sources: (filepath: string) => isSupported(filepath),
              target: '18',
            },
          ],
        ],
      },
    }),
  ],
  define: {
    __DEV__: true,
    __VITEST_FAIL_ON_CONSOLE__: JSON.stringify(process.env.VITEST_FAIL_ON_CONSOLE !== 'false'),
  },
  test: {
    name: '@primer/react (node)',
    include: ['src/__tests__/exports.test.ts', 'src/__tests__/storybook.test.tsx'],
    environment: 'node',
    setupFiles: ['@primer/vitest-config/setup'],
    detectAsyncLeaks: true,
  },
})
