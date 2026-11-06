'use client'

import React from 'react'
import {createOverflowRegistry, OverflowObserverContext} from './overflow'

export interface OverflowObserverProviderProps {
  children: React.ReactNode
  /** Single-row, `overflow: hidden` element whose clipping decides which descendants overflow. */
  root: Element | null
}

/**
 * Shares one root-scoped `IntersectionObserver` between every descendant that calls `useIsClipped`. Stays inert during
 * SSR, before `root` is attached, and where `IntersectionObserver` is unavailable.
 */
export function OverflowObserverProvider({children, root}: OverflowObserverProviderProps) {
  const [registry] = React.useState(createOverflowRegistry)

  // Subscribers registered before `root` attaches are queued and observed once it connects.
  React.useEffect(() => {
    if (root === null || typeof IntersectionObserver === 'undefined') return
    registry.connect(root)
    return () => registry.disconnect()
  }, [registry, root])

  return <OverflowObserverContext.Provider value={registry.observe}>{children}</OverflowObserverContext.Provider>
}
