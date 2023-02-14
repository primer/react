const emptyFunction = function () {}

const warning = __DEV__
  ? function warning(condition: any, format: string, ...args: Array<any>) {
      if (!condition) {
        let index = 0
        const message = format.replace(/%s/g, () => {
          return args[index++]
        })

        // eslint-disable-next-line no-console
        console.warn('Warning: ' + message)
      }
    }
  : emptyFunction

export {warning}
