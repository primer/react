import {defineConfig} from '@primer/vitest-config/config'
import babel from '@rolldown/plugin-babel'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'
import {isSupported} from './script/react-compiler.mjs'

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [
        reactCompilerPreset({
          sources: (filepath: string) => isSupported(filepath),
          target: '18',
        }),
      ],
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
    include: ['src/__tests__/exports.test.ts', 'src/__tests__/storybook.test.tsx'],
    environment: 'node',
    detectAsyncLeaks: true,
  },
})
