import failOnConsole from 'vitest-fail-on-console'

declare const __PRIMER_TEST_FAIL_ON_CONSOLE__: boolean | undefined

const shouldFailOnConsole =
  typeof __PRIMER_TEST_FAIL_ON_CONSOLE__ === 'boolean'
    ? __PRIMER_TEST_FAIL_ON_CONSOLE__
    : typeof process !== 'undefined' &&
      (process.env.CI === 'true' || process.env.PRIMER_TEST_FAIL_ON_CONSOLE === 'true')

if (shouldFailOnConsole) {
  failOnConsole({
    silenceMessage: (message, methodName) => {
      return (
        methodName === 'error' &&
        /^Warning: Unexpected return value from a callback ref in .+\. A callback ref should not return a function\./.test(
          message,
        )
      )
    },
  })
}
