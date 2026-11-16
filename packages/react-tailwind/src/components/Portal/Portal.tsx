'use client'

import React from 'react'
import {createPortal} from 'react-dom'
import {BasePortalProvider, type BasePortalProviderProps} from '../../base/BasePortalProvider'
import {cn} from '../../internal/cn'
import {usePortalContainer} from '../../internal/portalRoot'
import {mergeRefs} from '../../internal/refs'
import type {PortalContainer} from '../../utils/types/portal'

export interface PortalProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Where the children are rendered. Defaults to the shared portal root. */
  container?: PortalContainer
  /** Called once the children have been rendered into the container. */
  onMount?: () => void
}

export type PortalProviderProps = BasePortalProviderProps

function resolveContainer(container: PortalContainer | undefined): HTMLElement | ShadowRoot | null {
  if (container != null && 'current' in container) return container.current
  return container ?? null
}

const PortalRoot = React.forwardRef<HTMLDivElement, PortalProps>(function Portal(
  {children, container, onMount, ...rest},
  ref,
) {
  const [target, setTarget] = React.useState<HTMLElement | ShadowRoot | null>(null)
  const portalContainer = usePortalContainer(container)
  const onMountRef = React.useRef(onMount)

  React.useEffect(() => {
    onMountRef.current = onMount
  }, [onMount])

  React.useEffect(() => {
    // Ref containers attach during commit, and portals must render nothing during SSR and hydration.
    setTarget(resolveContainer(portalContainer))
  }, [portalContainer])

  const portalRef = React.useMemo(
    () =>
      mergeRefs(ref, node => {
        if (node !== null) onMountRef.current?.()
      }),
    [ref],
  )

  if (target === null) {
    return null
  }

  return createPortal(
    <div
      {...rest}
      ref={portalRef}
      className={cn('primer:relative primer:z-[1]', rest.className)}
      data-component="Portal"
    >
      {children}
    </div>,
    target,
  )
})

export const Portal = Object.assign(PortalRoot, {Provider: BasePortalProvider})
