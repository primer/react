function emptyFunction() {}

const warning = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function warning(condition: any, format: string, ...args: Array<any>) {
      if (!condition) {
        let index = 0
        const message = format.replace(/%s/g, () => {
          return args[index++]
        })
        // eslint-disable-next-line no-console
        console.warn(`Warning: ${message}`)
      }
    }
  : emptyFunction

export {warning}
