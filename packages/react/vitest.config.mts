import {defineConfig} from 'vitest/config'

export default defineConfig({
  define: {
    __DEV__: true,
  },
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/lib-esm/**', '**/lib/**', '**/generated/**'],
    include: ['src/Banner/**/*.test.?(c|m)[jt]s?(x)', 'src/Stack/**/*.test.?(c|m)[jt]s?(x)'],
    setupFiles: ['config/vitest/setup.ts'],
    css: {
      include: [/.+/],
    },
    browser: {
      provider: 'playwright',
      enabled: true,
      headless: true,
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
})
