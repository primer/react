import {createContext, useCallback, useContext, useRef, useSyncExternalStore, type RefObject} from 'react'

/** Subscribe a single observed element to the shared `IntersectionObserver`. Returns an unsubscribe function. */
export type ObserveFn = (element: Element, onOverflowChange: (isOverflowing: boolean) => void) => () => void

/** Provided by `OverflowObserverProvider`; `null` when no provider is present. Consumed via `useIsClipped`. */
export const OverflowObserverContext = createContext<ObserveFn | null>(null)

/**
 * Track whether `ref`'s element is currently clipped (overflowing) by the nearest `OverflowObserverProvider`'s
 * root-scoped `IntersectionObserver`.
 *
 * Returns `false` when there is no surrounding provider, during SSR, when `IntersectionObserver` is unavailable, or when
 * `disabled` is set.
 *
 * @param ref Ref to the element whose overflow state should be tracked.
 * @param options.disabled When true, skips observer subscription entirely and always reports `false`. Useful for items
 *   whose overflow is determined by an ancestor (e.g. ActionBar items inside an overflowing group).
 */
export function useIsClipped(ref: RefObject<HTMLElement | null>, options?: {disabled?: boolean}) {
  const disabled = options?.disabled ?? false
  const observe = useContext(OverflowObserverContext)
  const isOverflowingRef = useRef(false)

  const subscribe = useCallback(
    (onChange: () => void) => {
      if (disabled) return () => {}
      const element = ref.current
      // The hook only tracks overflow through a surrounding provider's shared observer. When no provider is present (or
      // the element isn't attached yet) the hook is inert and reports `false`.
      if (!element || observe === null) return () => {}

      const updateOverflowState = (isOverflowing: boolean) => {
        if (isOverflowing !== isOverflowingRef.current) {
          isOverflowingRef.current = isOverflowing
          onChange()
        }
      }

      return observe(element, updateOverflowState)
    },
    [ref, observe, disabled],
  )

  return useSyncExternalStore(subscribe, () => (disabled ? false : isOverflowingRef.current), getOverflowServerSnapshot)
}

/** Stable server snapshot for `useIsClipped`: overflow is never measured during SSR. */
const getOverflowServerSnapshot = () => false
