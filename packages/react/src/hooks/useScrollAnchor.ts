import {useRef} from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export interface UseScrollAnchorSettings {
  container: HTMLElement | null
  anchor: HTMLElement | null
  anchorKey?: string | number
}

/**
 * Preserves an anchor's viewport position when content in its container changes.
 * The anchor should be visible. Only window scrolling is adjusted.
 *
 * Pass reactive elements, for example from callback refs backed by state. Provide
 * the same anchorKey when the same logical anchor may be rendered as a new element.
 * Without a key, a different element starts a new baseline. Passing a null anchor
 * also resets the baseline.
 */
export function useScrollAnchor({container, anchor, anchorKey}: UseScrollAnchorSettings): void {
  const selection = useRef({anchor, anchorKey})
  const updateSelection = useRef<(() => void) | null>(null)

  useIsomorphicLayoutEffect(() => {
    selection.current = {anchor, anchorKey}
  })

  useIsomorphicLayoutEffect(() => {
    if (!container) {
      return
    }

    const root = container
    let trackedAnchor: HTMLElement | null = null
    let trackedKey: HTMLElement | string | number | null = null
    let anchorTop: number | null = null
    const observed = new Set<Element>()
    const resizeObserver = new ResizeObserver(() => correctPosition())

    function observeLayout() {
      const elements = new Set<Element>([root])
      let element: Element | null = trackedAnchor
      while (element && element !== root) {
        const parent: Element | null = element.parentElement
        if (!parent || !root.contains(parent)) break
        for (const child of parent.children) elements.add(child)
        element = parent
      }

      for (const element of observed) {
        if (!elements.has(element)) {
          resizeObserver.unobserve(element)
          observed.delete(element)
        }
      }
      for (const element of elements) {
        if (!observed.has(element)) {
          resizeObserver.observe(element)
          observed.add(element)
        }
      }
    }

    function synchronizeSelection() {
      const {anchor: nextAnchor, anchorKey: nextKey} = selection.current
      if (!nextAnchor) {
        const hadAnchor = trackedAnchor !== null
        trackedAnchor = null
        trackedKey = null
        anchorTop = null
        if (hadAnchor) observeLayout()
        return false
      }
      if (!root.contains(nextAnchor)) {
        return false
      }

      const key = nextKey ?? nextAnchor
      if (key !== trackedKey) {
        anchorTop = nextAnchor.getBoundingClientRect().top
      }
      if (nextAnchor !== trackedAnchor || key !== trackedKey) {
        trackedAnchor = nextAnchor
        trackedKey = key
        observeLayout()
      }
      return true
    }

    function correctPosition() {
      if (!synchronizeSelection() || !trackedAnchor || anchorTop === null) return

      const offset = trackedAnchor.getBoundingClientRect().top - anchorTop
      if (offset !== 0) {
        window.scrollBy({top: offset, behavior: 'instant'})
        anchorTop = trackedAnchor.getBoundingClientRect().top
      }
    }

    function capturePosition() {
      if (synchronizeSelection() && trackedAnchor) {
        anchorTop = trackedAnchor.getBoundingClientRect().top
      }
    }

    const mutationObserver = new MutationObserver(() => {
      observeLayout()
      correctPosition()
    })
    mutationObserver.observe(root, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    observeLayout()
    updateSelection.current = correctPosition
    correctPosition()
    // eslint-disable-next-line github/prefer-observers -- Track every scroll position to preserve the anchor's current viewport position.
    window.addEventListener('scroll', capturePosition)

    return () => {
      updateSelection.current = null
      mutationObserver.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('scroll', capturePosition)
    }
  }, [container])

  useIsomorphicLayoutEffect(() => {
    updateSelection.current?.()
  }, [container, anchor, anchorKey])
}
