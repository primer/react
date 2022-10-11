import React from 'react';
import { OverlayProps } from '../Overlay';
import { FocusTrapHookSettings } from '../hooks/useFocusTrap';
import { FocusZoneHookSettings } from '../hooks/useFocusZone';
import type { PositionSettings } from '@primer/behaviors';
interface AnchoredOverlayPropsWithAnchor {
    /**
     * A custom function component used to render the anchor element.
     * Will receive the selected text as `children` prop when an item is activated.
     */
    renderAnchor: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element;
    /**
     * An override to the internal ref that will be spread on to the renderAnchor
     */
    anchorRef?: React.RefObject<HTMLElement>;
    /**
     * An override to the internal id that will be spread on to the renderAnchor
     */
    anchorId?: string;
}
interface AnchoredOverlayPropsWithoutAnchor {
    /**
     * A custom function component used to render the anchor element.
     * When renderAnchor is null, an anchorRef is required.
     */
    renderAnchor: null;
    /**
     * An override to the internal renderAnchor ref that will be used to position the overlay.
     * When renderAnchor is null this can be used to make an anchor that is detached from ActionMenu.
     */
    anchorRef: React.RefObject<HTMLElement>;
    /**
     * An override to the internal id that will be spread on to the renderAnchor
     */
    anchorId?: string;
}
export declare type AnchoredOverlayWrapperAnchorProps = Partial<AnchoredOverlayPropsWithAnchor> | AnchoredOverlayPropsWithoutAnchor;
interface AnchoredOverlayBaseProps extends Pick<OverlayProps, 'height' | 'width'> {
    /**
     * Determines whether the overlay portion of the component should be shown or not
     */
    open: boolean;
    /**
     * A callback which is called whenever the overlay is currently closed and an "open gesture" is detected.
     */
    onOpen?: (gesture: 'anchor-click' | 'anchor-key-press', event?: React.KeyboardEvent<HTMLElement>) => unknown;
    /**
     * A callback which is called whenever the overlay is currently open and a "close gesture" is detected.
     */
    onClose?: (gesture: 'anchor-click' | 'click-outside' | 'escape') => unknown;
    /**
     * Props to be spread on the internal `Overlay` component.
     */
    overlayProps?: Partial<OverlayProps>;
    /**
     * Settings to apply to the Focus Zone on the internal `Overlay` component.
     */
    focusTrapSettings?: Partial<FocusTrapHookSettings>;
    /**
     * Settings to apply to the Focus Zone on the internal `Overlay` component.
     */
    focusZoneSettings?: Partial<FocusZoneHookSettings>;
}
export declare type AnchoredOverlayProps = AnchoredOverlayBaseProps & (AnchoredOverlayPropsWithAnchor | AnchoredOverlayPropsWithoutAnchor) & Partial<Pick<PositionSettings, 'align' | 'side'>>;
/**
 * An `AnchoredOverlay` provides an anchor that will open a floating overlay positioned relative to the anchor.
 * The overlay can be opened and navigated using keyboard or mouse.
 */
export declare const AnchoredOverlay: React.FC<React.PropsWithChildren<AnchoredOverlayProps>>;
export {};
