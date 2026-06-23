import {afterEach, vi} from 'vitest'

declare const __VITEST_FAIL_ON_CONSOLE__: boolean

const failOnConsoleEnabled =
  typeof __VITEST_FAIL_ON_CONSOLE__ === 'boolean'
    ? __VITEST_FAIL_ON_CONSOLE__
    : typeof process !== 'undefined' &&
      (process.env.VITEST_FAIL_ON_CONSOLE === 'true' ||
        (process.env.VITEST_FAIL_ON_CONSOLE !== 'false' && process.env.CI === 'true'))

if (failOnConsoleEnabled) {
  const {default: failOnConsole} = await import('vitest-fail-on-console')

  failOnConsole({
    shouldFailOnAssert: true,
    shouldFailOnDebug: true,
    shouldFailOnError: true,
    shouldFailOnInfo: true,
    shouldFailOnLog: true,
    shouldFailOnWarn: true,
    afterEachDelay: 1,
  })

  afterEach(() => {
    vi.useRealTimers()
  })
}
