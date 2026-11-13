'use client'

import type {Popover as BasePopover} from '@base-ui/react/popover'
import React from 'react'
import {createPortal} from 'react-dom'

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
  /** Element that owns the portal's focus guards and accessibility relationship; `null` waits for it. */
  owner?: HTMLElement | null
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
export function FloatingPortal({children, container, keepMounted, owner, part: Portal, portal}: FloatingPortalProps) {
  const [inlineContainer, setInlineContainer] = React.useState<HTMLDivElement | null>(null)
  const withOwner = (content: React.ReactNode) =>
    owner === undefined ? content : owner === null ? null : createPortal(content, owner)

  if (portal)
    return withOwner(
      <Portal container={container} keepMounted={keepMounted}>
        {children}
      </Portal>,
    )

  if (owner !== undefined)
    return withOwner(
      <Portal container={owner} className="primer:contents" keepMounted={keepMounted}>
        {children}
      </Portal>,
    )

  return (
    <div ref={setInlineContainer} className="primer:contents">
      {withOwner(
        <Portal container={inlineContainer} className="primer:contents" keepMounted={keepMounted}>
          {children}
        </Portal>,
      )}
    </div>
  )
}
