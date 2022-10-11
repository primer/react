import React from 'react';
import { OverlayProps } from '../Overlay';
import { ComponentProps } from '../utils/types';
declare type AutocompleteOverlayInternalProps = {
    /**
     * The ref of the element that the position of the menu is based on. By default, the menu is positioned based on the text input
     */
    menuAnchorRef?: React.RefObject<HTMLElement>;
    /**
     * Props to be spread on the internal `Overlay` component.
     */
    overlayProps?: Partial<OverlayProps>;
    children?: React.ReactNode;
} & Partial<OverlayProps> & Pick<React.AriaAttributes, 'aria-labelledby'>;
declare function AutocompleteOverlay({ menuAnchorRef, overlayProps: oldOverlayProps, children, ...newOverlayProps }: AutocompleteOverlayInternalProps): JSX.Element | null;
declare namespace AutocompleteOverlay {
    var displayName: string;
}
export declare type AutocompleteOverlayProps = ComponentProps<typeof AutocompleteOverlay>;
export default AutocompleteOverlay;
