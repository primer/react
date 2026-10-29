import {useCallback, useRef} from 'react'
import {registerPortalRoot, unregisterPortalRoot} from '../../Portal/portalRoot'

export function useRegisteredPortalRoot(name: string) {
  const root = useRef<HTMLDivElement | null>(null)
  return useCallback(
    (element: HTMLDivElement | null) => {
      if (root.current) unregisterPortalRoot(root.current, name)
      root.current = element
      if (element) registerPortalRoot(element, name)
    },
    [name],
  )
}
