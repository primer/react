declare const __VITEST_FAIL_ON_CONSOLE__: boolean

if (__VITEST_FAIL_ON_CONSOLE__) {
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
