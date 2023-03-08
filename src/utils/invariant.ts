function emptyFunction() {}

// Inspired by invariant by fbjs
// @see https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/__forks__/invariant.js
const invariant = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function invariant(condition: any, format: string, ...args: Array<any>) {
      if (!condition) {
        let index = 0
        const message = format.replace(/%s/g, () => {
          return args[index++]
        })

        const error = new Error(message)
        error.name = 'Invariant Violation'

        throw error
      }
    }
  : emptyFunction

export {invariant}
