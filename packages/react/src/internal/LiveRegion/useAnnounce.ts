import {announce} from '@primer/live-region-element'
import React from 'react'
import {useLiveRegion} from './useLiveRegion'

export function useAnnounce() {
  const liveRegion = useLiveRegion()
  const savedLiveRegion = React.useRef(liveRegion)

  React.useEffect(() => {
    savedLiveRegion.current = liveRegion
  }, [liveRegion])

  return React.useCallback((...args: Parameters<typeof announce>): ReturnType<typeof announce> => {
    if (savedLiveRegion.current) {
      return savedLiveRegion.current.announce(...args)
    }
    return announce(...args)
  }, [])
}
