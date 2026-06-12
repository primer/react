const shouldFailOnConsole = typeof process !== 'undefined' && process.env.VITEST_FAIL_ON_CONSOLE === 'true'

if (shouldFailOnConsole) {
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
