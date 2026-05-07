import failOnConsole from 'vitest-fail-on-console'

if (process.env.CI === 'true') {
  failOnConsole({
    shouldFailOnAssert: true,
    shouldFailOnDebug: true,
    shouldFailOnInfo: true,
    shouldFailOnLog: true,
  })
}
