import {useCallback, useEffect, useRef, type ReactNode, type RefObject} from 'react'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {OverflowObserverContext, type ObserveFn} from '../hooks/useOverflowObserver'

/**
 * Owns a single `IntersectionObserver` shared by every descendant that calls `useIsClipped`, instead of each item
 * creating its own observer. Each observed element maps to a set of change callbacks; one observer notification fans
 * out to all of them.
 *
 * `rootRef` must point to the element that clips overflowing children (typically a single-row, `overflow: hidden`
 * container). The observer is root-scoped to that element so children that wrap onto a clipped row are reported as
 * overflowing. Until the root is attached the provider stays inert (it never falls back to the viewport, which would
 * not reflect the container's clipping) and re-checks on later renders.
 */
export function OverflowObserverProvider({
  children,
  rootRef,
}: {
  children: ReactNode
  /** Clipping container used as the `IntersectionObserver` root for overflow detection. */
  rootRef: RefObject<Element | null>
}) {
  // Map of observed element -> set of subscriber callbacks.
  const subscribersRef = useRef<Map<Element, Set<(isOverflowing: boolean) => void>>>(new Map())
  const observedElementsRef = useRef<Set<Element>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const observerRootRef = useRef<Element | null>(null)

  // Lazily create the observer once the root is available so SSR / zero-item renders allocate nothing.
  const getObserver = useCallback(() => {
    if (!supportsIntersectionObserver()) return null

    const root = rootRef.current
    // Root-scoped overflow detection requires the clipping container. Stay inert until it's attached rather than
    // falling back to a viewport-rooted observer, which wouldn't reflect the container's clipping.
    if (root === null) return null

    if (observerRef.current && observerRootRef.current === root) return observerRef.current

    observerRef.current?.disconnect()
    observedElementsRef.current.clear()

    observerRef.current = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const callbacks = subscribersRef.current.get(entry.target)
          if (!callbacks) continue
          const isOverflowing = getIsOverflowing(entry)
          for (const cb of callbacks) cb(isOverflowing)
        }
      },
      {root, threshold: [0, 1]},
    )
    observerRootRef.current = root
    return observerRef.current
  }, [rootRef])

  const observeSubscribedElements = useCallback(() => {
    const observer = getObserver()
    if (!observer) return

    // When the root ref becomes available or changes, re-check every subscribed element so they are all attached to the
    // latest shared observer instance.
    for (const element of subscribersRef.current.keys()) {
      if (!observedElementsRef.current.has(element)) {
        observer.observe(element)
        observedElementsRef.current.add(element)
      }
    }
  }, [getObserver])

  const observe = useCallback<ObserveFn>(
    (element, onOverflowChange) => {
      let callbacks = subscribersRef.current.get(element)
      if (!callbacks) {
        callbacks = new Set()
        subscribersRef.current.set(element, callbacks)
      }
      callbacks.add(onOverflowChange)
      observeSubscribedElements()

      return () => {
        const set = subscribersRef.current.get(element)
        if (!set) return
        set.delete(onOverflowChange)
        if (set.size === 0) {
          subscribersRef.current.delete(element)
          observedElementsRef.current.delete(element)
          observerRef.current?.unobserve(element)
        }
      }
    },
    [observeSubscribedElements],
  )

  useIsomorphicLayoutEffect(() => {
    observeSubscribedElements()
  })

  useEffect(() => {
    const subscribers = subscribersRef.current
    const observedElements = observedElementsRef.current
    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
      observedElements.clear()
      subscribers.clear()
    }
  }, [])

  return <OverflowObserverContext.Provider value={observe}>{children}</OverflowObserverContext.Provider>
}

/**
 * Treat any target that is not fully visible within the observer root as overflowing. Wrapped items should be fully
 * clipped (`isIntersecting: false`, `intersectionRatio: 0`), but partial ratios also count as overflowing to guard
 * against sub-pixel boundary cases.
 */
function getIsOverflowing(entry: Pick<IntersectionObserverEntry, 'intersectionRatio' | 'isIntersecting'>) {
  return !entry.isIntersecting || entry.intersectionRatio < 1
}

function supportsIntersectionObserver() {
  return typeof IntersectionObserver !== 'undefined'
}
