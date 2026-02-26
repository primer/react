import type React from 'react'
import {useEffect} from 'react'
/**
 * This hook will flash the scrollbars for a ref of a container that has scrollable overflow
 * @param scrollContainerRef The ref of the scrollable content
 */
export default function useScrollFlash(scrollContainerRef: React.RefObject<HTMLElement | null>) {
  // https://adxlv.computer/projects/flash-scrollers/
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) {
      return
    }

    // Defer to the next frame to avoid forcing a synchronous reflow
    // when the effect runs immediately after React commits DOM changes.
    const id = requestAnimationFrame(() => {
      const currentScroll = scrollContainer.scrollTop
      const altScroll = currentScroll < 1 ? currentScroll + 1 : currentScroll - 1

      scrollContainer.scrollTop = altScroll
      scrollContainer.scrollTop = currentScroll
    })

    return () => cancelAnimationFrame(id)
  }, [scrollContainerRef])
}
