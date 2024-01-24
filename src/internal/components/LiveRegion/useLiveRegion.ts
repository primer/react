import './live-region-element/define'
import {useEffect, useContext, useState} from 'react'
import {LiveRegionContext} from './LiveRegionContext'
import {LiveRegionElement} from './live-region-element'

/**
 * The `useLiveRegion` hook provides access to a `live-region` element. This is
 * done through context when the calling component is a child of `LiveRegion` or
 * through finding or creating a `live-region` element when one is not available
 */
export function useLiveRegion(): LiveRegionElement {
  const context = useContext(LiveRegionContext)
  const [liveRegion, setLiveRegion] = useState<LiveRegionElement>(() => {
    if (context !== null) {
      return context
    }
    return findOrCreateLiveRegion()
  })
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
    if (!liveRegion.isConnected) {
      document.documentElement.appendChild(liveRegion)
    }
  }, [liveRegion])

  return liveRegion
}

let liveRegion: LiveRegionElement | null = null

function findOrCreateLiveRegion(): LiveRegionElement {
  if (liveRegion !== null) {
    return liveRegion
  }

  liveRegion = document.querySelector('live-region')
  if (liveRegion !== null) {
    return liveRegion as LiveRegionElement
  }

  liveRegion = document.createElement('live-region') as LiveRegionElement

  return liveRegion
}
