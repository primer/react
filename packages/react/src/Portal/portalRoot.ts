const PRIMER_PORTAL_ROOT_ID = '__primerPortalRoot__'
export const DEFAULT_PORTAL_CONTAINER_NAME = '__default__'

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

export function ensureDefaultPortal() {
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
}

export function getPortalRoot(name: string) {
  return portalRootRegistry[name]
}
