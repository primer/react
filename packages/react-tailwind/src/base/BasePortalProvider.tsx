'use client'

import React from 'react'
import {FloatingPortalParentContext, PortalContainerContext} from '../internal/portalRoot'
import type {PortalContainer} from '../utils/types/portal'

export interface BasePortalProviderProps {
  children?: React.ReactNode
  /**
   * Default destination for `Portal` and every Primer floating part beneath it, including tooltips that controls
   * such as `IconButton` render internally. `undefined` inherits the outer default; `null` makes portals wait for a
   * container instead of falling back to the document. Explicit `container` props and `portal={false}` still win.
   */
  container?: PortalContainer
}

/**
 * Supplies a default portal container without rendering an element. The nearest provider or floating layer wins.
 * The same component as `Portal.Provider`, exported flat so server components can render it.
 */
export function BasePortalProvider({children, container}: BasePortalProviderProps) {
  const value = React.useMemo(() => (container === undefined ? undefined : {container}), [container])
  if (value === undefined) return <>{children}</>
  return (
    <PortalContainerContext.Provider value={value}>
      <FloatingPortalParentContext.Provider value={false}>{children}</FloatingPortalParentContext.Provider>
    </PortalContainerContext.Provider>
  )
}
