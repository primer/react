import fs from 'node:fs'
import path from 'node:path'
import {createRequire} from 'node:module'
import {playwright} from '@vitest/browser-playwright'
import {chromium} from 'playwright'
import {defineConfig} from '@primer/vitest-config/config'
import babel from '@rolldown/plugin-babel'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'

const packageRequire = createRequire(import.meta.url)

function resolveChromiumExecutablePath(): string | undefined {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  }
  const defaultPath = chromium.executablePath()
  if (fs.existsSync(defaultPath)) {
    return undefined
  }
  const match = /^(.*[/\\]ms-playwright)[/\\]chromium-\d+([/\\].*)$/.exec(defaultPath)
  if (!match) return undefined
  const [, cacheDir, suffix] = match
  if (!fs.existsSync(cacheDir)) return undefined
  const candidates = fs
    .readdirSync(cacheDir)
    .filter(entry => /^chromium-\d+$/.test(entry))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
  for (const dir of candidates) {
    const candidate = `${cacheDir}${path.sep}${dir}${suffix}`
    if (fs.existsSync(candidate)) return candidate
  }
  return undefined
}

const executablePath = resolveChromiumExecutablePath()

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    react(),
    babel({
      include: /\.(?:ts|tsx)$/,
      exclude: [/node_modules/, /\.test\.[jt]sx?$/],
      presets: [reactCompilerPreset({target: '19'})],
    }),
  ],
  optimizeDeps: {
    include: ['@testing-library/react', '@testing-library/jest-dom/vitest', '@primer/octicons-react'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: /^@primer\/react-tailwind$/,
        replacement: path.resolve(import.meta.dirname, './src/index.ts'),
      },
      {
        find: /^use-sync-external-store\/shim$/,
        replacement: packageRequire.resolve('react'),
      },
      ...[
        '@testing-library/react',
        'react/compiler-runtime',
        'react/jsx-dev-runtime',
        'react/jsx-runtime',
        'react-dom/client',
        'react-dom/server',
        'react-dom/test-utils',
        'react-dom',
        'react',
      ].map(id => ({find: id, replacement: packageRequire.resolve(id)})),
    ],
  },
  test: {
    name: '@primer/react-tailwind-behavior',
    include: ['src/**/*.behavior.test.{ts,tsx}'],
    setupFiles: ['./src/test-setup.ts', './dist/styles.css'],
    css: {
      include: [/.+/],
    },
    browser: {
      provider: playwright(executablePath ? {launchOptions: {executablePath}} : undefined),
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
