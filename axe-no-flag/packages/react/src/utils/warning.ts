function emptyFunction() {}

const warn = __DEV__
  ? function warn(message: string) {
      // eslint-disable-next-line no-console
      console.warn('Warning:', message)
    }
  : emptyFunction

// Inspired by warning by fbjs
// @see https://github.com/facebook/fbjs/blob/main/packages/fbjs/src/__forks__/warning.js
const warning = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function warning(condition: any, format: string, ...args: Array<any>) {
      if (condition) {
        let index = 0
        const message = format.replace(/%s/g, () => {
          return args[index++]
        })
        warn(message)
      }
    }
  : emptyFunction

export {warn, warning}
