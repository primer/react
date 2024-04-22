import {announceFromElement} from '@primer/live-region-element'
import React from 'react'
import {useLiveRegion} from './useLiveRegion'

export function useAnnounceFromElement() {
  const liveRegion = useLiveRegion()
  const savedLiveRegion = React.useRef(liveRegion)

  React.useEffect(() => {
    savedLiveRegion.current = liveRegion
  }, [liveRegion])

  return React.useCallback(
    (...args: Parameters<typeof announceFromElement>): ReturnType<typeof announceFromElement> => {
      if (savedLiveRegion.current) {
        return savedLiveRegion.current.announceFromElement(...args)
      }
      return announceFromElement(...args)
    },
    [],
  )
}
