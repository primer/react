import React, {useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

const PRIMER_PORTAL_ROOT_ID = '__primerPortalRoot__'
const DEFAULT_PORTAL_CONTAINER_NAME = '__default__'

const portalRootRegistry: Partial<Record<string, Element>> = {}

/**
 * Register a container to serve as a portal root.
 * @param root The element that will be the root for portals created in this container
 * @param name The name of the container, to be used with the `containerName` prop on the Portal Component.
 * If name is not specified, registers the default portal root.
 */
export function registerPortalRoot(root: Element, name = DEFAULT_PORTAL_CONTAINER_NAME): void {
  portalRootRegistry[name] = root
}

// Ensures that a default portal root exists and is registered. If a DOM element exists
// with id __primerPortalRoot__, allow that element to serve as the default portal root.
// Otherwise, create that element and attach it to the end of document.body.
function ensureDefaultPortal() {
  const existingDefaultPortalContainer = portalRootRegistry[DEFAULT_PORTAL_CONTAINER_NAME]
  if (!existingDefaultPortalContainer || !document.body.contains(existingDefaultPortalContainer)) {
    let defaultPortalContainer = document.getElementById(PRIMER_PORTAL_ROOT_ID)
    if (!(defaultPortalContainer instanceof Element)) {
      defaultPortalContainer = document.createElement('div')
      defaultPortalContainer.setAttribute('id', PRIMER_PORTAL_ROOT_ID)
      defaultPortalContainer.style.position = 'absolute'
      defaultPortalContainer.style.top = '0'
      defaultPortalContainer.style.left = '0'
      const suitablePortalRoot = document.querySelector('[data-portal-root]')
      if (suitablePortalRoot) {
        suitablePortalRoot.appendChild(defaultPortalContainer)
      } else {
        document.body.appendChild(defaultPortalContainer)
      }
    }

    registerPortalRoot(defaultPortalContainer)
  }
}

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
  const [element, setElement] = useState<HTMLDivElement | null>(() => {
    // If we're in SSR, return null so that nothing is rendered
    if (typeof document === 'undefined') return null
    return document.createElement('div')
  })

  // Set a new element if none exists yet
  useLayoutEffect(() => {
    setElement(prev => {
      return prev ?? document.createElement('div')
    })
  }, [])

  // track onMount in a ref so that we can access the latest value in the effect below without re-running the effect
  const onMountRef = useRef(onMount)
  useLayoutEffect(() => {
    onMountRef.current = onMount
  })

  useLayoutEffect(() => {
    if (!element) return
    // Portaled content should get their own stacking context so they don't interfere
    // with each other in unexpected ways. One should never find themselves tempted
    // to change the zIndex to a value other than "1".

    element.style.position = 'relative'
    element.style.zIndex = '1'
    let containerName = _containerName
    if (containerName === undefined) {
      containerName = DEFAULT_PORTAL_CONTAINER_NAME
      ensureDefaultPortal()
    }
    const parentElement = portalRootRegistry[containerName]

    if (!parentElement) {
      throw new Error(
        `Portal container '${_containerName}' is not yet registered. Container must be registered with registerPortal before use.`,
      )
    }
    parentElement.appendChild(element)
    onMountRef.current?.()

    return () => {
      parentElement.removeChild(element)
    }
  }, [element, _containerName])

  if (!element) return null
  return createPortal(children, element)
}
