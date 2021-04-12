import type {ForwardedRef, RefObject} from 'react'

export function isRefObject<T extends HTMLElement>(x: ForwardedRef<T>): x is RefObject<T> {
  return !!(x && 'current' in x)
}
