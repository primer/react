import {LiveRegionElement} from '@primer/live-region-element'
import {useContext} from 'react'
import {LiveRegionContext} from './LiveRegionContext'

export function useLiveRegion(): LiveRegionElement | null {
  return useContext(LiveRegionContext)
}
