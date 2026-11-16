import React, {useContext, useSyncExternalStore} from 'react'
import {createPortal} from 'react-dom'
import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {PortalContext} from './PortalContext'
import {DEFAULT_PORTAL_CONTAINER_NAME, ensureDefaultPortal, getPortalRoot} from './portalRoot'

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * Returns `true` only when React is rendering on the client, and not as part of
 * hydrating server-rendered markup.
 *
 * `Portal` needs this because React's server renderer throws when it encounters a
 * portal, and portaled content is never part of the server-rendered markup.
 *
 * `useSyncExternalStore` is used rather than a `useEffect`/`useState` "is mounted"
 * flag because it only defers the portal for the renders that need it: it returns
 * `false` while server rendering and for the hydration pass (keeping hydration
 * consistent with the server markup), but `true` from the very first render of a
 * client-only render. That way client-rendered portals — the overwhelmingly common
 * case for overlays, dialogs and menus — still mount their children in the same
 * commit as the `Portal` itself, so refs into portaled content are populated by the
 * time the parent's layout effects run.
 */
function useIsClientRender() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
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
  const {portalContainerName} = useContext(PortalContext)
  const isClientRender = useIsClientRender()

  // `onMount` is read from a ref so that it is not part of the effect below's
  // dependencies. Depending on it directly would detach and re-attach the portal
  // — unmounting and remounting every portaled DOM node — whenever a consumer
  // passes an inline callback.
  const onMountRef = React.useRef(onMount)
  useLayoutEffect(() => {
    onMountRef.current = onMount
  })

  // The host element is created once per `Portal` instance. A lazy state initializer
  // is used instead of an effect so that the portal, and its children, mount in the
  // same commit as the `Portal` itself. `document` is not available while server
  // rendering, where the element is never needed because nothing is rendered.
  const [element] = React.useState<HTMLDivElement | null>(() => {
    if (typeof document === 'undefined') return null

    const div = document.createElement('div')
    div.setAttribute('data-component', 'Portal')
    // Portaled content should get their own stacking context so they don't interfere
    // with each other in unexpected ways. One should never find themselves tempted
    // to change the zIndex to a value other than "1".
    div.style.position = 'relative'
    div.style.zIndex = '1'
    return div
  })

  useLayoutEffect(() => {
    if (!element || !isClientRender) return

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
    onMountRef.current?.()

    return () => {
      parentElement.removeChild(element)
    }
  }, [element, isClientRender, _containerName, portalContainerName])

  return element && isClientRender ? createPortal(children, element) : null
}
