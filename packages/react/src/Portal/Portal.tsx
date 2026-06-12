import React, {useContext} from 'react'
import {createPortal} from 'react-dom'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {PortalContext} from './PortalContext'
import {DEFAULT_PORTAL_CONTAINER_NAME, ensureDefaultPortal, getPortalRoot} from './portalRoot'

export interface PortalProps {
  /**
   * Called when this portal is added to the DOM
   */
  onMount?: () => void

  /**
   * Optional. Mount this portal at the container specified
   * by this name. The container must be previously registered
   * with `registerPortal`.
   */
  containerName?: string
}

/**
 * Creates a React Portal, placing all children in a separate physical DOM root node.
 * @see https://reactjs.org/docs/portals.html
 */
export const Portal: React.FC<React.PropsWithChildren<PortalProps>> = ({
  children,
  onMount,
  containerName: _containerName,
}) => {
  const {portalContainerName} = useContext(PortalContext)
  const elementRef = React.useRef<HTMLDivElement | null>(null)
  // eslint-disable-next-line react-hooks/refs
  if (!elementRef.current) {
    const div = document.createElement('div')
    div.setAttribute('data-component', 'Portal')
    // Portaled content should get their own stacking context so they don't interfere
    // with each other in unexpected ways. One should never find themselves tempted
    // to change the zIndex to a value other than "1".
    div.style.position = 'relative'
    div.style.zIndex = '1'
    elementRef.current = div
  }

  // eslint-disable-next-line react-hooks/refs
  const element = elementRef.current

  useLayoutEffect(() => {
    let containerName = _containerName ?? portalContainerName
    if (containerName === undefined) {
      containerName = DEFAULT_PORTAL_CONTAINER_NAME
      ensureDefaultPortal()
    }
    const parentElement = getPortalRoot(containerName)

    if (!parentElement) {
      throw new Error(
        `Portal container '${containerName}' is not yet registered. Container must be registered with registerPortalRoot before use.`,
      )
    }
    parentElement.appendChild(element)
    onMount?.()

    return () => {
      parentElement.removeChild(element)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, _containerName, portalContainerName])

  return createPortal(children, element)
}
