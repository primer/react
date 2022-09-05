import React from 'react'
import {useInView} from 'react-intersection-observer'

/**
 * Calculates the height of the sticky pane such that it always
 * fits into the viewport even when the header or footer are visible.
 */
export function useStickyPaneHeight() {
  const rootRef = React.useRef<HTMLDivElement>(null)

  // Default the height to the viewport height
  const [height, setHeight] = React.useState('100vh')
  const [offsetHeader, setOffsetHeader] = React.useState<number | string>(0)

  // Create intersection observers to track the top and bottom of the content region
  const [contentTopRef, contentTopInView, contentTopEntry] = useInView()
  const [contentBottomRef, contentBottomInView, contentBottomEntry] = useInView()

  // Calculate the height of the sticky pane based on the position of the
  // top and bottom of the content region
  const calculateHeight = React.useCallback(() => {
    // Uncomment to debug
    // console.log('Recalculating pane height...')

    let calculatedHeight = ''

    const scrollContainer = getScrollContainer(rootRef.current)

    const topRect = contentTopEntry?.target.getBoundingClientRect()
    const bottomRect = contentBottomEntry?.target.getBoundingClientRect()

    // Custom sticky header's height with units
    const offsetHeaderWithUnits = typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader

    if (scrollContainer) {
      const scrollRect = scrollContainer.getBoundingClientRect()

      const topOffset = topRect ? Math.max(topRect.top - scrollRect.top, 0) : 0
      const bottomOffset = bottomRect ? Math.max(scrollRect.bottom - bottomRect.bottom, 0) : 0

      calculatedHeight = `calc(${scrollRect.height}px - (max(${topOffset}px, ${offsetHeaderWithUnits}) + ${bottomOffset}px))`
    } else {
      const topOffset = topRect ? Math.max(topRect.top, 0) : 0
      const bottomOffset = bottomRect ? Math.max(window.innerHeight - bottomRect.bottom, 0) : 0

      // Safari's elastic scroll feature allows you to scroll beyond the scroll height of the page.
      // We need to account for this when calculating the offset.
      const overflowScroll = Math.max(window.scrollY + window.innerHeight - document.body.scrollHeight, 0)

      calculatedHeight = `calc(100vh - (max(${topOffset}px, ${offsetHeaderWithUnits}) + ${bottomOffset}px - ${overflowScroll}px))`
    }

    setHeight(calculatedHeight)
  }, [contentTopEntry, contentBottomEntry, offsetHeader])

  // We only want to add scroll and resize listeners if the pane is sticky.
  // Since hooks can't be called conditionally, we need to use state to track
  // if the pane is sticky.
  const [isEnabled, setIsEnabled] = React.useState(false)

  React.useLayoutEffect(() => {
    const scrollContainer = getScrollContainer(rootRef.current)

    if (isEnabled && (contentTopInView || contentBottomInView)) {
      calculateHeight()

      // Start listeners if the top or the bottom edge of the content region is visible

      if (scrollContainer) {
        // eslint-disable-next-line github/prefer-observers
        scrollContainer.addEventListener('scroll', calculateHeight)
      } else {
        // eslint-disable-next-line github/prefer-observers
        window.addEventListener('scroll', calculateHeight)
      }

      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', calculateHeight)
    }

    return () => {
      // Stop listeners if neither the top nor the bottom edge of the content region is visible

      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', calculateHeight)
      } else {
        window.removeEventListener('scroll', calculateHeight)
      }

      window.removeEventListener('resize', calculateHeight)
    }
  }, [isEnabled, contentTopInView, contentBottomInView, calculateHeight])

  function enableStickyPane(top: string | number) {
    setIsEnabled(true)
    setOffsetHeader(top)
  }

  function disableStickyPane() {
    setIsEnabled(false)
  }

  return {
    rootRef,
    enableStickyPane,
    disableStickyPane,
    contentTopRef,
    contentBottomRef,
    stickyPaneHeight: height
  }
}

/**
 * Returns the nearest scrollable parent of the element or `null` if the element
 * is not contained in a scrollable element.
 */
function getScrollContainer(element: Element | null): Element | null {
  if (!element || element === document.body) {
    return null
  }

  return isScrollable(element) ? element : getScrollContainer(element.parentElement)
}

/** Returns `true` if the element is scrollable */
function isScrollable(element: Element) {
  const hasScrollableContent = element.scrollHeight > element.clientHeight

  const overflowYStyle = window.getComputedStyle(element).overflowY
  const isOverflowHidden = overflowYStyle.indexOf('hidden') !== -1

  return hasScrollableContent && !isOverflowHidden
}
