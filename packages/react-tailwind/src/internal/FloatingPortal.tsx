'use client'

import type {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'

type PortalContainer = BasePopover.Portal.Props['container']

type PortalPartProps = {
  children?: React.ReactNode
  className?: string
  container?: PortalContainer
  keepMounted?: boolean
}

export interface FloatingPortalProps {
  children: React.ReactNode
  /** Explicit portal container; ignored when rendering in place. */
  container?: PortalContainer
  /** Keeps the portal mounted while closed. */
  keepMounted?: boolean
  /** The component's Base UI `Portal` part. */
  part: React.ComponentType<PortalPartProps>
  /** Renders into the default portal root when true, and in place when false. */
  portal: boolean
}

/**
 * Base UI positioners and popups throw without their `Portal` part, so rendering in place portals into a
 * `display: contents` element at the current position rather than omitting the part. The container is held in
 * state because Base UI resolves it in a layout effect, which runs before a parent's ref attaches when both mount
 * together (e.g. initially open); an explicit `null` container makes Base UI wait for it.
 */
export function FloatingPortal({children, container, keepMounted, part: Portal, portal}: FloatingPortalProps) {
  const [inlineContainer, setInlineContainer] = React.useState<HTMLDivElement | null>(null)
  if (portal)
    return (
      <Portal container={container} keepMounted={keepMounted}>
        {children}
      </Portal>
    )

  return (
    <div ref={setInlineContainer} className="contents">
      <Portal container={inlineContainer} className="contents" keepMounted={keepMounted}>
        {children}
      </Portal>
    </div>
  )
}
