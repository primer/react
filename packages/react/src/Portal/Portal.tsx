import React, {useContext} from 'react'
import {createPortal} from 'react-dom'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {useFeatureFlag} from '../FeatureFlags'

const PRIMER_PORTAL_ROOT_ID = '__primerPortalRoot__'
const DEFAULT_PORTAL_CONTAINER_NAME = '__default__'

const portalRootRegistry: Partial<Record<string, Element>> = {}

// Track whether CSS containment has been applied to avoid repeated work
let cssContainmentApplied = false

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
function ensureDefaultPortal(enableCSSContainment = false) {
  const existingDefaultPortalContainer = portalRootRegistry[DEFAULT_PORTAL_CONTAINER_NAME]
  if (!existingDefaultPortalContainer || !document.body.contains(existingDefaultPortalContainer)) {
    let defaultPortalContainer = document.getElementById(PRIMER_PORTAL_ROOT_ID)
    if (!(defaultPortalContainer instanceof Element)) {
      defaultPortalContainer = document.createElement('div')
      defaultPortalContainer.setAttribute('id', PRIMER_PORTAL_ROOT_ID)
      defaultPortalContainer.style.position = 'absolute'
      defaultPortalContainer.style.top = '0'
      defaultPortalContainer.style.left = '0'
      defaultPortalContainer.style.width = '100%'
      const suitablePortalRoot = document.querySelector('[data-portal-root]')
      if (suitablePortalRoot) {
        suitablePortalRoot.appendChild(defaultPortalContainer)
      } else {
        document.body.appendChild(defaultPortalContainer)
      }
    }

    registerPortalRoot(defaultPortalContainer)
  }

  // Apply CSS containment to the portal root if enabled (only once)
  if (enableCSSContainment && !cssContainmentApplied) {
    const portalRoot = portalRootRegistry[DEFAULT_PORTAL_CONTAINER_NAME]
    if (portalRoot instanceof HTMLElement) {
      const existingContain = portalRoot.style.contain
      if (existingContain && existingContain !== 'layout style') {
        // eslint-disable-next-line no-console
        console.warn(
          `Portal root already has contain: "${existingContain}". Overriding with "layout style" due to primer_react_css_contain_portal flag.`,
        )
      }
      portalRoot.style.contain = 'layout style'
      cssContainmentApplied = true
    }
  }
}

/**
 * Provides the ability for component trees to override the portal root container for a sub-set of the experience.
 * The portal will prioritize the context value unless overridden by their own `containerName` prop, and fallback to the default root if neither are specified
 */
export const PortalContext = React.createContext<{
  portalContainerName?: string
}>({})

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
  const enableCSSContainment = useFeatureFlag('primer_react_css_contain_portal')
  const elementRef = React.useRef<HTMLDivElement | null>(null)
  if (!elementRef.current) {
    const div = document.createElement('div')
    // Portaled content should get their own stacking context so they don't interfere
    // with each other in unexpected ways. One should never find themselves tempted
    // to change the zIndex to a value other than "1".
    div.style.position = 'relative'
    div.style.zIndex = '1'
    elementRef.current = div
  }

  const element = elementRef.current

  useLayoutEffect(() => {
    let containerName = _containerName ?? portalContainerName
    if (containerName === undefined) {
      containerName = DEFAULT_PORTAL_CONTAINER_NAME
      ensureDefaultPortal(enableCSSContainment)
    }
    const parentElement = portalRootRegistry[containerName]

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
