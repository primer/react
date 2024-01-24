import {useCallback, useEffect, useRef} from 'react'
import {useLiveRegion} from './useLiveRegion'
import type {LiveRegionElement} from './live-region-element'

/**
 * The `useAnnounce` hook provides a constant reference to the `announce` method
 * from a `live-region` element. The identity of this reference should stay
 * constant and should be excluded from dependencies arrays when used in hooks.
 */
export function useAnnounce() {
  const liveRegion = useLiveRegion()
  const savedLiveRegion = useRef(liveRegion)

  useEffect(() => {
    savedLiveRegion.current = liveRegion
  }, [liveRegion])

  return useCallback((...args: Parameters<LiveRegionElement['announce']>) => {
    return savedLiveRegion.current.announce(...args)
  }, [])
}
