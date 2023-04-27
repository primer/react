import React from 'react'
import {VisuallyHidden} from './VisuallyHidden'

type LiveRegionContext = {
  announce: (message: string) => void
  message: string
}

const LiveRegionContext = React.createContext<LiveRegionContext | null>(null)

function useLiveRegion() {
  const context = React.useContext(LiveRegionContext)
  if (!context) {
    throw new Error('useLiveRegion() must be used within a <LiveRegion>')
  }
  return context
}

function LiveRegion({children}: React.PropsWithChildren) {
  const [message, setMessage] = React.useState('')
  const value = React.useMemo(() => {
    return {
      announce: setMessage,
      message,
    }
  }, [message])

  return <LiveRegionContext.Provider value={value}>{children}</LiveRegionContext.Provider>
}

function LiveRegionOutlet() {
  const liveRegion = useLiveRegion()
  return (
    <VisuallyHidden role="status" aria-live="polite" aria-atomic={true}>
      {liveRegion.message}
    </VisuallyHidden>
  )
}

function Message({value}: {value: string}) {
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
    const timeoutId = setTimeout(() => {
      savedLiveRegion.current.announce(value)
    }, 750)
    return () => {
      clearTimeout(timeoutId)
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

export {LiveRegion, LiveRegionOutlet, Message, useLiveRegion}
