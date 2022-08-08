import React from 'react'
import {useInView} from 'react-intersection-observer'

/**
 * Calculates the height of the sticky pane such that it always
 * fits into the viewport even when the header or footer are visible.
 */
// TODO: Handle sticky header
export function useStickyPaneHeight() {
  // Default the height to the viewport height
  const [height, setHeight] = React.useState('100vh')

  // Create intersection observers to track the top and bottom of the content region
  const [contentTopRef, contentTopInView, contentTopEntry] = useInView()
  const [contentBottomRef, contentBottomInView, contentBottomEntry] = useInView()

  // Calculate the height of the sticky pane based on the position of the
  // top and bottom of the content region
  const calculateHeight = React.useCallback(() => {
    // Uncomment to debug
    // console.log('Recalculating pane height...')

    const topRect = contentTopEntry?.target.getBoundingClientRect()
    const bottomRect = contentBottomEntry?.target.getBoundingClientRect()

    const topOffset = topRect ? Math.max(topRect.top, 0) : 0
    const bottomOffset = bottomRect ? Math.max(0, window.innerHeight - bottomRect.bottom) : 0

    // TODO: Handle elastic scroll in Safari
    setHeight(`calc(100vh - ${topOffset + bottomOffset}px)`)
  }, [contentTopEntry, contentBottomEntry])

  // We only want to add scroll and resize listeners if the pane is sticky.
  // Since hooks can't be called conditionally, we need to use state to track
  // if the pane is sticky.
  const [isEnabled, setIsEnabled] = React.useState(false)

  React.useLayoutEffect(() => {
    if (isEnabled && (contentTopInView || contentBottomInView)) {
      // Start listeners if the top or the bottom edge of the content region is visible

      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('scroll', calculateHeight)
      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', calculateHeight)
    }

    return () => {
      // Stop listeners if neither the top nor the bottom edge of the content region is visible

      window.removeEventListener('scroll', calculateHeight)
      window.removeEventListener('resize', calculateHeight)
    }
  }, [isEnabled, contentTopInView, contentBottomInView, calculateHeight])

  return {
    enableStickyPane: () => setIsEnabled(true),
    disableStickyPane: () => setIsEnabled(false),
    contentTopRef,
    contentBottomRef,
    stickyPaneHeight: height
  }
}
