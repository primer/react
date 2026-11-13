import {createRequire} from 'node:module'
import {defineConfig} from '@primer/vitest-config/config'
import babel from '@rolldown/plugin-babel'
import react, {reactCompilerPreset} from '@vitejs/plugin-react'

const packageRequire = createRequire(import.meta.url)

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
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: /^use-sync-external-store\/shim$/,
        replacement: packageRequire.resolve('react'),
      },
      ...[
        '@testing-library/react',
        '@testing-library/user-event',
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
    name: '@primer/react-tailwind',
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        inline: [
          /@base-ui/,
          /@floating-ui/,
          /@primer\/behaviors/,
          /@primer\/octicons-react/,
          /use-sync-external-store/,
        ],
      },
    },
    setupFiles: ['./src/test-setup.ts'],
  },
})
