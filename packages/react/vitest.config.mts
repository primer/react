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
  test: {
    name: '@primer/react (node)',
    include: ['src/__tests__/exports.test.ts'],
    environment: 'node',
  },
})

