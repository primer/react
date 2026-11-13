import type {RefObject} from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export interface UseScrollAnchorSettings {
  containerRef: RefObject<HTMLElement | null>
  anchorRef: RefObject<HTMLElement | null>
}

/**
 * Preserves the viewport position of an anchor when content in its container changes.
 * The anchor should be a visible element, and this hook only adjusts the window scroll position.
 *
 * @param containerRef A ref to the container whose DOM changes should be observed.
 * @param anchorRef A ref to the visible element whose viewport position should be preserved.
 */
export function useScrollAnchor({containerRef, anchorRef}: UseScrollAnchorSettings): void {
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current
    const initialAnchor = anchorRef.current

    if (!container || !initialAnchor || !container.contains(initialAnchor)) {
      return
    }

    let anchorTop = initialAnchor.getBoundingClientRect().top

    const updateAnchorTop = () => {
      const anchor = anchorRef.current
      if (anchor && container.contains(anchor)) {
        anchorTop = anchor.getBoundingClientRect().top
      }
    }

    const observer = new MutationObserver(() => {
      const anchor = anchorRef.current
      if (!anchor || !container.contains(anchor)) {
        return
      }

      const currentTop = anchor.getBoundingClientRect().top
      const offset = currentTop - anchorTop

      if (offset !== 0) {
        window.scrollBy(0, offset)
        anchorTop = currentTop - offset
      }
    })

    observer.observe(container, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
    // eslint-disable-next-line github/prefer-observers -- Track every scroll position to preserve the anchor's current viewport position.
    window.addEventListener('scroll', updateAnchorTop)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateAnchorTop)
    }
  }, [anchorRef, containerRef])
}
