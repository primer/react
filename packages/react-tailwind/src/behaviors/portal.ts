'use client'

import {useFloatingPortalContainer} from '../internal/portalRoot'
import type {PortalContainer} from '../utils/types/portal'

/**
 * Resolves the `container` to pass to a Base UI `Portal` part so it routes like Primer's floating components: an
 * explicit `container` (including `null`), then the nearest `BasePortalProvider` container (including `null`), then
 * the default portal root. Returns `undefined` inside a Primer floating layer, so Base UI keeps nested content in
 * that layer, and before the default root is known during SSR and hydration. Refs are returned unresolved.
 */
export function usePortalContainer(container?: PortalContainer): PortalContainer | undefined {
  return useFloatingPortalContainer(container)
}

export {usePortalRoot} from '../internal/portalRoot'
