import React from 'react'
import {useInView} from 'react-intersection-observer'
import {canUseDOM} from '../utils/environment'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {getScrollContainer} from '../utils/scroll'

/**
 * Calculates the height of the sticky pane such that it always
 * fits into the viewport even when the header or footer are visible.
 */
export function useStickyPaneHeight() {
  const rootRef = React.useRef<HTMLDivElement>(null)

  // Default the height to the viewport height
  const [height, setHeight] = React.useState(dvh(100))
  const [offsetHeader, setOffsetHeader] = React.useState<number | string>(0)

  // Create intersection observers to track the top and bottom of the content region
  const [contentTopRef, contentTopInView, contentTopEntry] = useInView()
  const [contentBottomRef, contentBottomInView] = useInView()

  // Calculate the height of the sticky pane based on the position of the
  // top and bottom of the content region
  const calculateHeight = React.useCallback(() => {
    // Uncomment to debug
    // console.log('Recalculating pane height...')

    let calculatedHeight = ''

    const scrollContainer = getScrollContainer(rootRef.current)

    const topRect = contentTopEntry?.target.getBoundingClientRect()

    // Custom sticky header's height with units
    const offsetHeaderWithUnits = typeof offsetHeader === 'number' ? `${offsetHeader}px` : offsetHeader

    if (scrollContainer) {
      const scrollRect = scrollContainer.getBoundingClientRect()
      const topOffset = topRect ? Math.max(topRect.top - scrollRect.top, 0) : 0
      calculatedHeight = `calc(${scrollRect.height}px - (max(${topOffset}px, ${offsetHeaderWithUnits})))`
    } else {
      const topOffset = topRect ? Math.max(topRect.top, 0) : 0
      calculatedHeight = `calc(${dvh(100)} - (max(${topOffset}px, ${offsetHeaderWithUnits})))`
    }

    setHeight(calculatedHeight)
  }, [contentTopEntry, offsetHeader])

  // We only want to add scroll and resize listeners if the pane is sticky.
  // Since hooks can't be called conditionally, we need to use state to track
  // if the pane is sticky.
  const [isEnabled, setIsEnabled] = React.useState(false)

  useLayoutEffect(() => {
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
    stickyPaneHeight: height,
  }
}

// TODO: there is currently an issue with dvh on Desktop Safari 15.6, 16.0. To
// work around it, we check to see if the device supports touch along with the
// dvh unit in order to target iPad. When the bug is addressed this check will
// no longer be needed
//
// @see https://bugs.webkit.org/show_bug.cgi?id=242758
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
const supportsTouchCallout = canUseDOM ? CSS.supports('-webkit-touch-callout', 'none') : false
// eslint-disable-next-line ssr-friendly/no-dom-globals-in-module-scope
const supportsDVH = canUseDOM ? CSS.supports('max-height', '100dvh') && supportsTouchCallout : false

/**
 * Convert the given value to a dvh value, if supported, otherwise it falls back
 * to vh
 */
function dvh(value: number): string {
  if (supportsDVH) {
    return `${value}dvh`
  }
  return `${value}vh`
}
