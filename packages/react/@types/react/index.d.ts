// eslint-disable-next-line no-restricted-imports
export * from 'react'

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
