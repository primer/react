import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    name: '@primer/styled-react (node)',
    environment: 'node',
    exclude: ['src/**/*.browser.test.?(c|m)[jt]s?(x)', 'src/**/*.visual.test.?(c|m)[jt]s?(x)'],
  },
})
