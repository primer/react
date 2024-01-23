import {createContext} from 'react'
import {LiveRegionElement} from './live-region-element'

type LiveRegionContext = LiveRegionElement
export const LiveRegionContext = createContext<LiveRegionContext | null>(null)
