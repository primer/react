import React, { ComponentPropsWithRef } from 'react';
import { AriaRole, Merge } from './utils/types';
import { TouchOrMouseEvent } from './hooks';
import { SxProp } from './sx';
import type { AnchorSide } from '@primer/behaviors';
import { ForwardRefComponent as PolymorphicForwardRefComponent } from './utils/polymorphic';
declare type StyledOverlayProps = {
    width?: keyof typeof widthMap;
    height?: keyof typeof heightMap;
    maxHeight?: keyof Omit<typeof heightMap, 'auto' | 'initial'>;
    visibility?: 'visible' | 'hidden';
    anchorSide?: AnchorSide;
} & SxProp;
declare const heightMap: {
    xsmall: string;
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    auto: string;
    initial: string;
};
declare const widthMap: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    xxlarge: string;
    auto: string;
};
declare type BaseOverlayProps = {
    ignoreClickRefs?: React.RefObject<HTMLElement>[];
    initialFocusRef?: React.RefObject<HTMLElement>;
    returnFocusRef: React.RefObject<HTMLElement>;
    onClickOutside: (e: TouchOrMouseEvent) => void;
    onEscape: (e: KeyboardEvent) => void;
    visibility?: 'visible' | 'hidden';
    'data-test-id'?: unknown;
    top?: number;
    left?: number;
    portalContainerName?: string;
    preventFocusOnOpen?: boolean;
    role?: AriaRole;
    children?: React.ReactNode;
};
declare type OwnOverlayProps = Merge<StyledOverlayProps, BaseOverlayProps>;
/**
 * An `Overlay` is a flexible floating surface, used to display transient content such as menus,
 * selection options, dialogs, and more. Overlays use shadows to express elevation. The `Overlay`
 * component handles all behaviors needed by overlay UIs as well as the common styles that all overlays * should have.
 * @param ignoreClickRefs Optional. An array of ref objects to ignore clicks on in the `onOutsideClick` behavior. This is often used to ignore clicking on the element that toggles the open/closed state for the `Overlay` to prevent the `Overlay` from being toggled twice.
 * @param initialFocusRef Optional. Ref for the element to focus when the `Overlay` is opened. If nothing is provided, the first focusable element in the `Overlay` body is focused.
 * @param returnFocusRef Required. Ref for the element to focus when the `Overlay` is closed.
 * @param onClickOutside  Required. Function to call when clicking outside of the `Overlay`. Typically this function removes the Overlay.
 * @param onEscape Required. Function to call when user presses `Escape`. Typically this function removes the Overlay.
 * @param width Sets the width of the `Overlay`, pick from our set list of widths, or pass `auto` to automatically set the width based on the content of the `Overlay`. `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `480px`, `xlarge` corresponds to `640px`, `xxlarge` corresponds to `960px`.
 * @param height Sets the height of the `Overlay`, pick from our set list of heights, or pass `auto` to automatically set the height based on the content of the `Overlay`, or pass `initial` to set the height based on the initial content of the `Overlay` (i.e. ignoring content changes). `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param maxHeight Sets the maximum height of the `Overlay`, pick from our set list of heights. `xsmall` corresponds to `192px`, `small` corresponds to `256px`, `medium` corresponds to `320px`, `large` corresponds to `432px`, `xlarge` corresponds to `600px`.
 * @param anchorSide If provided, the Overlay will slide into position from the side of the anchor with a brief animation
 * @param top Optional. Vertical position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param left Optional. Horizontal position of the overlay, relative to its closest positioned ancestor (often its `Portal`).
 * @param portalContainerName Optional. The name of the portal container to render the Overlay into.
 */
declare const Overlay: PolymorphicForwardRefComponent<"div", OwnOverlayProps>;
export declare type OverlayProps = ComponentPropsWithRef<typeof Overlay>;
export default Overlay;
