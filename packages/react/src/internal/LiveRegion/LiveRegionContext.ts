import {createContext} from 'react'
import {LiveRegionElement} from '@primer/live-region-element'

export const LiveRegionContext = createContext<LiveRegionElement | null>(null)

export const SetLiveRegionContext = createContext<React.Dispatch<
  React.SetStateAction<LiveRegionElement | null>
> | null>(null)
