import { GroupedListProps, ListPropsBase } from './ActionList/List';
import { ItemProps } from './ActionList/Item';
import { Divider } from './ActionList/Divider';
import React from 'react';
import { OverlayProps } from '../Overlay';
import { AnchoredOverlayWrapperAnchorProps } from '../AnchoredOverlay/AnchoredOverlay';
interface ActionMenuBaseProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
    /**
     * Content that is passed into the renderAnchor component, which is a button by default.
     */
    anchorContent?: React.ReactNode;
    /**
     * A callback that triggers both on clicks and keyboard events. This callback will be overridden by item level `onAction` callbacks.
     */
    onAction?: (props: ItemProps, event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
    /**
     * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `setOpen`.
     */
    open?: boolean;
    /**
     * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `open`.
     */
    setOpen?: (s: boolean) => void;
    /**
     * Props to be spread on the internal `Overlay` component.
     */
    overlayProps?: Partial<OverlayProps>;
}
export declare type ActionMenuProps = ActionMenuBaseProps & AnchoredOverlayWrapperAnchorProps;
/**
 * @deprecated Use ActionMenu with composable API instead. See https://primer.style/react/ActionMenu for more details.
 */
export declare const ActionMenu: {
    ({ anchorContent, renderAnchor, anchorRef: externalAnchorRef, onAction, open, setOpen, overlayProps, items, ...listProps }: ActionMenuProps): JSX.Element;
    displayName: string;
} & {
    Divider: typeof Divider;
    Item: {
        (props: ItemProps): JSX.Element;
        displayName: string;
    };
};
export {};
