import {LiveRegionElement} from '@primer/live-region-element'
import React from 'react'
import {LiveRegionContext, SetLiveRegionContext} from './LiveRegionContext'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'live-region': React.DetailedHTMLProps<React.HTMLAttributes<LiveRegionElement>, LiveRegionElement>
    }
  }
}

export interface LiveRegionProps extends React.ComponentPropsWithoutRef<'live-region'> {}

export function LiveRegion(props: LiveRegionProps) {
  const setLiveRegion = React.useContext(SetLiveRegionContext)
  return <live-region ref={setLiveRegion} {...props} />
}

export interface LiveRegionProviderProps extends React.PropsWithChildren {}

export function LiveRegionProvider({children}: LiveRegionProps) {
  const [liveRegion, setLiveRegion] = React.useState<LiveRegionElement | null>(null)
  return (
    <LiveRegionContext.Provider value={liveRegion}>
      <SetLiveRegionContext.Provider value={setLiveRegion}>{children}</SetLiveRegionContext.Provider>
    </LiveRegionContext.Provider>
  )
}
