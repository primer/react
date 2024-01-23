import * as React from 'react'
import {useLiveRegion} from './useLiveRegion'
import type {LiveRegionElement} from './live-region-element'

/**
 * The `useAnnounce` hook provides a constant reference to the `announce` method
 * from a `live-region` element. The identity of this reference should stay
 * constant and should be excluded from dependencies arrays when used in hooks.
 */
export function useAnnounce() {
  const liveRegion = useLiveRegion()
  const savedLiveRegion = React.useRef(liveRegion)

  React.useEffect(() => {
    savedLiveRegion.current = liveRegion
  }, [liveRegion])

  return React.useCallback((...args: Parameters<LiveRegionElement['announce']>) => {
    if (savedLiveRegion.current !== null) {
      return savedLiveRegion.current.announce(...args)
    }
    return () => {}
  }, [])
}
