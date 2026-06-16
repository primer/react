import {defineConfig as vitestDefineConfig, mergeConfig, type ViteUserConfig} from 'vitest/config'

export const defaultConfig: ViteUserConfig = {
  define: {
    __VITEST_FAIL_ON_CONSOLE__: JSON.stringify(process.env.VITEST_FAIL_ON_CONSOLE === 'true'),
  },
  test: {
    setupFiles: ['@primer/vitest-config/setup'],
  },
}

export function defineConfig(config: ViteUserConfig) {
  return vitestDefineConfig(mergeConfig(defaultConfig, config))
}
