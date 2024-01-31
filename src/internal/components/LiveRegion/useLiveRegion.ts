import './live-region-element/define'
import {useEffect, useContext, useState} from 'react'
import {LiveRegionContext} from './LiveRegionContext'
import {LiveRegionElement} from './live-region-element'

/**
 * The `useLiveRegion` hook provides access to a `live-region` element. This is
 * done through context when the calling component is a child of `LiveRegion` or
 * through finding or creating a `live-region` element when one is not available
 */
export function useLiveRegion(): LiveRegionElement | null {
  const context = useContext(LiveRegionContext)
  const [liveRegion, setLiveRegion] = useState<LiveRegionElement | null>(context)
  const [prevContext, setPrevContext] = useState(context)

  // Keep track of changes to context, when it changes we should check to see if
  // we should update our reference to the current `live-region` with the new
  // value
  if (context !== prevContext) {
    setPrevContext(context)
    if (context !== null) {
      setLiveRegion(context)
    }
  }

  useEffect(() => {
    if (liveRegion !== null) {
      return
    }

    const existingLiveRegion = document.querySelector('live-region')
    if (existingLiveRegion !== null) {
      setLiveRegion(existingLiveRegion as LiveRegionElement)
      return
    }

    const newLiveRegion = document.createElement('live-region') as LiveRegionElement
    document.documentElement.appendChild(newLiveRegion)
    setLiveRegion(newLiveRegion)
    return () => {
      newLiveRegion.parentElement?.removeChild(newLiveRegion)
    }
  }, [liveRegion])

  return liveRegion
}
