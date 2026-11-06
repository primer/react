'use client'

import React from 'react'
import {createPortal} from 'react-dom'
import {cn} from '../../internal/cn'
import {usePortalContainer} from '../../internal/portalRoot'

type PortalContainer = HTMLElement | ShadowRoot
type PortalContainerRef = React.RefObject<PortalContainer | null>

export interface PortalProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Where the children are rendered. Defaults to the shared portal root. */
  container?: PortalContainer | PortalContainerRef | null
  /** Called once the children have been rendered into the container. */
  onMount?: () => void
}

function resolveContainer(container: PortalContainer | PortalContainerRef | null): PortalContainer | null {
  if (container !== null && 'current' in container) {
    return container.current
  }

  return container
}

export const Portal = React.forwardRef<HTMLDivElement, PortalProps>(function Portal(
  {children, container, onMount, ...rest},
  ref,
) {
  const [target, setTarget] = React.useState<PortalContainer | null>(null)
  const portalContainer = usePortalContainer(container)
  const onMountRef = React.useRef(onMount)

  React.useEffect(() => {
    onMountRef.current = onMount
  }, [onMount])

  React.useEffect(() => {
    setTarget(resolveContainer(portalContainer ?? null))
  }, [portalContainer])

  const portalRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref !== null) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      }

      if (node !== null) {
        onMountRef.current?.()
      }
    },
    [ref],
  )

  if (target === null) {
    return null
  }

  return createPortal(
    <div {...rest} ref={portalRef} className={cn('relative z-[1]', rest.className)} data-component="Portal">
      {children}
    </div>,
    target,
  )
})
