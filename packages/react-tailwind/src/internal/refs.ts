import type React from 'react'

export function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref !== null) {
    ref.current = value
  }
}
