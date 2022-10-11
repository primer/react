import React from 'react';
/**
 * Register a container to serve as a portal root.
 * @param root The element that will be the root for portals created in this container
 * @param name The name of the container, to be used with the `containerName` prop on the Portal Component.
 * If name is not specified, registers the default portal root.
 */
export declare function registerPortalRoot(root: Element, name?: string): void;
export interface PortalProps {
    /**
     * Called when this portal is added to the DOM
     */
    onMount?: () => void;
    /**
     * Optional. Mount this portal at the container specified
     * by this name. The container must be previously registered
     * with `registerPortal`.
     */
    containerName?: string;
}
/**
 * Creates a React Portal, placing all children in a separate physical DOM root node.
 * @see https://reactjs.org/docs/portals.html
 */
export declare const Portal: React.FC<React.PropsWithChildren<PortalProps>>;
