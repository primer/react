import babel from '@rolldown/plugin-babel'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'
import {playwright} from '@vitest/browser-playwright'
import {defineConfig} from '@primer/vitest-config/config'
import postcssPresetPrimer from 'postcss-preset-primer'
import {isSupported} from './script/react-compiler.mjs'

export default defineConfig({
  css: {
    modules: {
      generateScopedName: 'prc-[folder]-[local]-[hash:base64:5]',
    },
    postcss: {
      plugins: [postcssPresetPrimer()],
    },
  },
  plugins: [
    react(),
    babel({
      presets: [
        reactCompilerPreset({
          target: '18',
          sources: isSupported,
        }),
      ],
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  define: {
    __DEV__: true,
    'process.env.CI': JSON.stringify(process.env.CI),
  },
  test: {
    name: '@primer/react',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/generated/**',
      '**/*.figma.tsx',
      '**/*.types.test.ts',
      '**/*.types.test.tsx',
      'src/__tests__/exports.test.ts',
      'src/__tests__/storybook.test.tsx',
    ],
    include: ['src/**/*.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['@primer/vitest-config/setup', 'config/vitest/browser/setup.ts'],
    css: {
      include: [/.+/],
    },
    browser: {
      provider: playwright(),
      enabled: true,
      headless: process.env.DEBUG_BROWSER_TESTS === 'true' ? false : true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
      screenshotFailures: false,
    },
  },
})
