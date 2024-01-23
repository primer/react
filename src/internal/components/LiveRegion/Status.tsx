import * as React from 'react'
import {useAnnounce} from './useAnnounce'
import type {AnnounceOptions, LiveRegionElement} from './live-region-element'

type StatusProps = AnnounceOptions & {
  message: string
}

export function Status({delayMs, message, politeness}: StatusProps) {
  const announce = useAnnounce()
  // Note: the goal of `Status` is not to announce the given string each time it
  // changes but instead to announce the _first_ message. As a result, we use a
  // ref to store the initial value which we then call in the useEffect() below.
  const messageToAnnounce = React.useRef<Parameters<LiveRegionElement['announce']> | null>(null)

  if (messageToAnnounce.current === null) {
    messageToAnnounce.current = [
      message,
      {
        delayMs,
        politeness,
      },
    ]
  }

  React.useEffect(() => {
    const {current: announcement} = messageToAnnounce
    if (announcement === null) {
      return
    }

    const cancel = announce(...announcement)
    return () => {
      cancel()
    }
  }, [])

  return null
}
