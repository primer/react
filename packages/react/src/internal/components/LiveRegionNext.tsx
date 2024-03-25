import '@primer/live-region-element'
import {announce as globalAnnounce, type LiveRegionElement} from '@primer/live-region-element'
import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'live-region': React.DetailedHTMLProps<React.HTMLAttributes<LiveRegionElement>, LiveRegionElement>
    }
  }
}

const LiveRegionContext = React.createContext<LiveRegionElement | null>(null)
const SetLiveRegionContext = React.createContext<React.Dispatch<React.SetStateAction<LiveRegionElement | null>> | null>(
  null,
)

export function LiveRegionProvider({children}: React.PropsWithChildren) {
  const [liveRegion, setLiveRegion] = React.useState<LiveRegionElement | null>(null)

  return (
    <LiveRegionContext.Provider value={liveRegion}>
      <SetLiveRegionContext.Provider value={setLiveRegion}>{children}</SetLiveRegionContext.Provider>
    </LiveRegionContext.Provider>
  )
}

export function LiveRegion() {
  const setLiveRegion = React.useContext(SetLiveRegionContext)
  return <live-region ref={setLiveRegion} />
}

export function useLiveRegion() {
  return React.useContext(LiveRegionContext)
}

export function useAnnounce(): [typeof globalAnnounce, () => void] {
  const liveRegion = useLiveRegion()
  const savedCancel = React.useRef<ReturnType<typeof globalAnnounce> | null>(null)
  const announce = React.useCallback(
    (...args: Parameters<typeof globalAnnounce>) => {
      if (liveRegion) {
        savedCancel.current = liveRegion.announce(...args)
      } else {
        savedCancel.current = globalAnnounce(...args)
      }
      return cancel
    },
    [liveRegion],
  )
  const cancel = React.useCallback(() => {
    if (savedCancel.current !== null) {
      savedCancel.current()
      savedCancel.current = null
    }
  }, [])

  React.useEffect(() => {
    return () => {
      cancel()
    }
  }, [])

  return [announce, cancel]
}
