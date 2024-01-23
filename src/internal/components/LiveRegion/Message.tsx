import * as React from 'react'
import {useLiveRegion} from './useLiveRegion'

export function Message({value}: {value: string}) {
  const liveRegion = useLiveRegion()
  const savedLiveRegion = React.useRef(liveRegion)
  const committedRef = React.useRef(false)

  React.useEffect(() => {
    savedLiveRegion.current = liveRegion
  }, [liveRegion])

  React.useEffect(() => {
    if (committedRef.current !== true) {
      return
    }

    const cancel = savedLiveRegion.current?.announce(value, {
      delayMs: 750,
    })

    return () => {
      cancel?.()
    }
  }, [value])

  React.useEffect(() => {
    committedRef.current = true
    return () => {
      committedRef.current = false
    }
  }, [])

  return null
}
