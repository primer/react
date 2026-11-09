import {defineConfig} from '@primer/vitest-config/config'

import react from '@vitejs/plugin-react'
import {files, isSupported} from './script/react-compiler.mjs'

export default defineConfig({
  plugins: [
    react({
      compiler: {
        sources: files.filter(isSupported),
        target: '18',
      },
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    __DEV__: true,
  },
  test: {
    name: '@primer/react (node)',
    include: ['src/__tests__/exports.test.ts', 'src/__tests__/ssr.test.tsx', 'src/__tests__/storybook.test.tsx'],
    environment: 'node',
    detectAsyncLeaks: true,
    server: {
      deps: {
        // Externalized octicons would resolve the root React copy instead of the one used by
        // this package when the two differ (React 19 CI job), breaking server-rendered icons.
        inline: [/@primer\/octicons-react/],
      },
    },
  },
})
