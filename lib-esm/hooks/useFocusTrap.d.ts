import React from 'react';
export interface FocusTrapHookSettings {
    /**
     * Ref that will be used for the trapping container. If not provided, one will
     * be created by this hook and returned.
     */
    containerRef?: React.RefObject<HTMLElement>;
    /**
     * Ref for the element that should receive focus when the focus trap is first enabled. If
     * not provided, one will be created by this hook and returned. Its use is optional.
     */
    initialFocusRef?: React.RefObject<HTMLElement>;
    /**
     * Set to true to disable the focus trap and clean up listeners. Can be re-enabled at
     * any time.
     */
    disabled?: boolean;
    /**
     * If true, when this focus trap is cleaned up, restore focus to the element that had
     * focus immediately before the focus trap was enabled. (Default: false)
     */
    restoreFocusOnCleanUp?: boolean;
}
/**
 * Hook used to trap focus inside a container. Returns a ref that can be added to the container
 * that should trap focus.
 * @param settings {FocusTrapHookSettings}
 */
export declare function useFocusTrap(settings?: FocusTrapHookSettings, dependencies?: React.DependencyList): {
    containerRef: React.RefObject<HTMLElement>;
    initialFocusRef: React.RefObject<HTMLElement>;
};
