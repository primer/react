import failOnConsole from 'vitest-fail-on-console'

if (process.env.CI === 'true') {
  failOnConsole({
    silenceMessage: message => {
      return /Warning: An update to AnchoredOverlay inside a test was not wrapped in act/.test(message)
    },
    shouldFailOnAssert: true,
    shouldFailOnDebug: true,
    shouldFailOnInfo: true,
    shouldFailOnLog: true,
  })
}
