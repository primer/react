import type React from 'react'
import {useCallback, useEffect} from 'react'

/**
 * Mirrors `:focus-within` onto the tree root as `data-focus-within`.
 *
 * WebKit clears and re-sets `:focus-within` up the ancestor chain on every focus move, so a
 * `:focus-within` rule on the root restyles every level line on each arrow key press. This
 * attribute only changes when focus enters or leaves the tree. It is written to the DOM
 * directly so the tree doesn't re-render.
 *
 * Removing the focused element from the DOM doesn't dispatch `focusout` in every engine, so the
 * returned `resync` lets an unmounting item re-read `:focus-within`.
 */
export function useFocusWithinAttribute(containerRef: React.RefObject<HTMLElement | null>) {
  const resync = useCallback(() => {
    const root = containerRef.current
    root?.toggleAttribute('data-focus-within', root.matches(':focus-within'))
  }, [containerRef])

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const sync = (event?: FocusEvent) => {
      const focused = event
        ? event.type === 'focusin' || root.contains(event.relatedTarget as Node | null)
        : root.matches(':focus-within')
      root.toggleAttribute('data-focus-within', focused)
    }

    sync()
    root.addEventListener('focusin', sync)
    root.addEventListener('focusout', sync)
    return () => {
      root.removeEventListener('focusin', sync)
      root.removeEventListener('focusout', sync)
      root.removeAttribute('data-focus-within')
    }
  }, [containerRef])

  return resync
}
