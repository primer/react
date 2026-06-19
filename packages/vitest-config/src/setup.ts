declare const __VITEST_FAIL_ON_CONSOLE__: boolean

const failOnConsoleEnabled =
  typeof __VITEST_FAIL_ON_CONSOLE__ === 'undefined'
    ? typeof process !== 'undefined' && process.env.VITEST_FAIL_ON_CONSOLE === 'true'
    : __VITEST_FAIL_ON_CONSOLE__

if (failOnConsoleEnabled) {
  const {default: failOnConsole} = await import('vitest-fail-on-console')

  failOnConsole({
    shouldFailOnAssert: true,
    shouldFailOnDebug: true,
    shouldFailOnError: true,
    shouldFailOnInfo: true,
    shouldFailOnLog: true,
    shouldFailOnWarn: true,
  })
}
