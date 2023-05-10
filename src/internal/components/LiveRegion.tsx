import React, {useSyncExternalStore} from 'react'
import {VisuallyHidden} from './VisuallyHidden'

type LiveRegionContext = {
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
  const parentLiveRegion = React.useContext(LiveRegionContext)
  const state = useSyncExternalStore(subscribe, getSnapshot)

  if (parentLiveRegion) {
    return <>{children}</>
  }

  return <LiveRegionContext.Provider value={state}>{children}</LiveRegionContext.Provider>
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
      announce(value)
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

type State = {
  message: string
}
type Subscriber = (state: State) => void
type Subscription = () => void

const subscribers = new Set<Subscriber>()
let state = {
  message: '',
}

function subscribe(subscriber: Subscriber): Subscription {
  subscribers.add(subscriber)
  return () => {
    subscribers.delete(subscriber)
  }
}

function getSnapshot() {
  return state
}

function announce(message: string) {
  state = {
    message,
  }
  for (const subscriber of subscribers) {
    subscriber(state)
  }
}

export {LiveRegion, LiveRegionOutlet, Message, useLiveRegion, announce}
