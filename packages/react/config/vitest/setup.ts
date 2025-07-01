import failOnConsole from 'vitest-fail-on-console'

const failConsoleMessages = process.env.CI === 'true'

failOnConsole({
  shouldFailOnAssert: failConsoleMessages,
  shouldFailOnDebug: failConsoleMessages,
  shouldFailOnError: failConsoleMessages,
  shouldFailOnInfo: failConsoleMessages,
  shouldFailOnLog: failConsoleMessages,
  shouldFailOnWarn: failConsoleMessages,
})
