export const PRIMER_PORTAL_ROOT_ID = '__primerPortalRoot__'
export const DEFAULT_PORTAL_CONTAINER_NAME = '__default__'

export const portalRootRegistry: Partial<Record<string, Element>> = {}

/**
 * Register a container to serve as a portal root.
 * @param root The element that will be the root for portals created in this container
 * @param name The name of the container, to be used with the `containerName` prop on the Portal Component.
 * If name is not specified, registers the default portal root.
 */
export function registerPortalRoot(root: Element, name = DEFAULT_PORTAL_CONTAINER_NAME): void {
  portalRootRegistry[name] = root
}
