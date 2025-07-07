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
  },
  test: {
    name: '@primer/react (node)',
    include: [
      'src/__tests__/exports.test.ts',
      'src/__tests__/storybook.test.tsx',
      'src/deprecated/UnderlineNav/UnderlineNavLink.test.tsx',
      'src/__tests__/deprecated/FilteredSearch.test.tsx',
      'src/__tests__/deprecated/ActionList.test.tsx',
      'src/experimental/SelectPanel2/__tests__/SelectPanelLoading.test.tsx',
    ],
    environment: 'jsdom',
    setupFiles: ['./config/vitest/setup.ts', './config/vitest/browser/setup.ts'],
  },
})
