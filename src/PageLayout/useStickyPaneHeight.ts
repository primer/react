import React from 'react'
import {useInView} from 'react-intersection-observer'

// TODO: Respect sticky header
export function useStickyPaneHeight() {
  const [height, setHeight] = React.useState('100vh')
  const [contentTopRef, contentTopInView, contentTopEntry] = useInView()
  const [contentBottomRef, contentBottomInView, contentBottomEntry] = useInView()

  const calculateHeight = React.useCallback(() => {
    // Uncomment to debug
    // console.log('Recalculating...')

    const topRect = contentTopEntry?.target.getBoundingClientRect()
    const bottomRect = contentBottomEntry?.target.getBoundingClientRect()

    const topOffset = topRect ? Math.max(topRect.top, 0) : 0
    const bottomOffset = bottomRect ? Math.max(0, window.innerHeight - bottomRect.bottom) : 0

    setHeight(`calc(100vh - ${topOffset + bottomOffset}px)`)
  }, [contentTopEntry, contentBottomEntry])

  React.useLayoutEffect(() => {
    if (contentTopInView || contentBottomInView) {
      // Start listeners

      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('scroll', calculateHeight)
      // eslint-disable-next-line github/prefer-observers
      window.addEventListener('resize', calculateHeight)
    }

    return () => {
      // Stop listeners

      window.removeEventListener('scroll', calculateHeight)
      window.removeEventListener('resize', calculateHeight)
    }
  }, [contentTopInView, contentBottomInView, calculateHeight])

  return {contentTopRef, contentBottomRef, height}
}
