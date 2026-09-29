import {isSupported, apply} from 'invokers-polyfill/fn'

declare module 'react' {
  interface ButtonHTMLAttributes<T> {
    command?:
      | 'show-modal'
      | 'close'
      | 'request-close'
      | 'show-popover'
      | 'hide-popover'
      | 'toggle-popover'
      | `--${string}`
      | undefined
    commandFor?: string | undefined
    commandfor?: string | undefined
  }
}

if (!isSupported()) {
  apply()
}
