import {createContext, useContext} from 'react'
import {LiveRegionElement} from './live-region-element'

type OutletContext = React.Dispatch<React.SetStateAction<LiveRegionElement | null>>
export const OutletContext = createContext<OutletContext | null>(null)

/**
 * The `useOutlet` hook provides access to a function which is used to set a
 * reference to the current `live-region` element used as an outlet for
 * messages.
 */
export function useOutlet(): OutletContext {
  const context = useContext(OutletContext)
  if (context) {
    return context
  }
  throw new Error('useOutlet() must be used with <LiveRegion>')
}
