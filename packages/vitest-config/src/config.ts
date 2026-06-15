import {defineConfig as vitestDefineConfig, mergeConfig} from 'vitest/config'

type VitestUserConfig = NonNullable<Parameters<typeof mergeConfig>[1]>

const defaultConfig = {
  define: {
    __VITEST_FAIL_ON_CONSOLE__: JSON.stringify(process.env.VITEST_FAIL_ON_CONSOLE === 'true'),
  },
  test: {
    setupFiles: ['@primer/vitest-config/setup'],
  },
} satisfies VitestUserConfig

export function defineConfig(config: VitestUserConfig) {
  return vitestDefineConfig(mergeConfig(defaultConfig, config))
}
