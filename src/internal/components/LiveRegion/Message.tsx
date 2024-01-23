import {useEffect, useRef} from 'react'
import {useLiveRegion} from './useLiveRegion'

export function Message({value}: {value: string}) {
  const liveRegion = useLiveRegion()
  const savedLiveRegion = useRef(liveRegion)
  const committedRef = useRef(false)

  useEffect(() => {
    savedLiveRegion.current = liveRegion
  }, [liveRegion])

  useEffect(() => {
    if (committedRef.current !== true) {
      return
    }

    const cancel = savedLiveRegion.current.announce(value, {
      delayMs: 750,
    })

    return () => {
      cancel()
    }
  }, [value])

  useEffect(() => {
    committedRef.current = true
    return () => {
      committedRef.current = false
    }
  }, [])

  return null
}
