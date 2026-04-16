import {useState, useEffect} from 'react'

/**
 * Hook that uses IntersectionObserver to track whether an anchor element
 * is visible in the viewport. This is used to hide positioned overlays
 * when their anchor scrolls out of view - working around the limitation
 * that CSS `position-visibility: anchors-visible` only considers clipping
 * by overflow containers, not viewport visibility.
 *
 * @param anchorRef - Ref to the anchor element to observe
 * @param enabled - Whether to enable the observer (default: true)
 * @param threshold - Intersection threshold (default: 0, meaning any part visible)
 * @returns Whether the anchor is currently visible in the viewport
 */
export function useAnchorVisibility(
  anchorRef: React.RefObject<HTMLElement | null>,
  enabled = true,
  threshold = 0,
): boolean {
  const [isAnchorVisible, setIsAnchorVisible] = useState(true)

  useEffect(() => {
    // When disabled or no anchor, don't set up the observer
    // The hook returns true by default, so the overlay stays visible
    if (!enabled || !anchorRef.current) {
      return
    }

    const anchor = anchorRef.current

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          // isIntersecting is true when any part of the element is visible
          // (based on threshold). When threshold is 0, this means any pixel.
          setIsAnchorVisible(entry.isIntersecting)
        }
      },
      {
        // Use null for root to observe against the viewport
        root: null,
        // No margin adjustments needed
        rootMargin: '0px',
        // threshold of 0 means callback fires as soon as even one pixel is visible/hidden
        threshold,
      },
    )

    observer.observe(anchor)

    return () => {
      observer.disconnect()
    }
  }, [anchorRef, enabled, threshold])

  // When disabled, always return true so overlay remains visible
  if (!enabled) {
    return true
  }

  return isAnchorVisible
}
