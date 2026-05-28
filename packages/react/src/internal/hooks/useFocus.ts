import {type RefObject, useCallback, useEffect, useRef, useState} from 'react'

/**
 * Returns a function that focuses the given element on the next render commit.
 *
 * The target is stored in a ref (not state) and the effect is gated by a
 * version counter, so calling `focus()` produces exactly one render — never
 * the two-render cascade you'd get from `setState(target)` followed by
 * `setState(null)` inside the effect.
 */
export function useFocus() {
  const targetRef = useRef<HTMLElement | RefObject<HTMLElement> | null>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const target = targetRef.current
    if (target === null) return
    targetRef.current = null

    if (target instanceof HTMLElement) {
      target.focus()
    } else {
      target.current?.focus()
    }
  }, [version])

  return useCallback((target: HTMLElement | RefObject<HTMLElement>) => {
    targetRef.current = target
    setVersion(v => v + 1)
  }, [])
}
