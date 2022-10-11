import React from 'react';
import { AnchoredOverlayProps } from './AnchoredOverlay';
import { OverlayProps } from './Overlay';
import { ButtonProps } from './Button';
import { SxProp } from './sx';
export declare type MenuContextProps = Pick<AnchoredOverlayProps, 'anchorRef' | 'renderAnchor' | 'open' | 'onOpen' | 'anchorId'> & {
    onClose?: (gesture: 'anchor-click' | 'click-outside' | 'escape' | 'tab') => void;
};
export declare type ActionMenuProps = {
    /**
     * Recommended: `ActionMenu.Button` or `ActionMenu.Anchor` with `ActionMenu.Overlay`
     */
    children: React.ReactElement[] | React.ReactElement;
    /**
     * If defined, will control the open/closed state of the overlay. Must be used in conjunction with `onOpenChange`.
     */
    open?: boolean;
    /**
     * If defined, will control the open/closed state of the overlay. Must be used in conjunction with `open`.
     */
    onOpenChange?: (s: boolean) => void;
} & Pick<AnchoredOverlayProps, 'anchorRef'>;
export declare type ActionMenuAnchorProps = {
    children: React.ReactElement;
};
/** this component is syntactical sugar 🍭 */
export declare type ActionMenuButtonProps = ButtonProps;
declare type MenuOverlayProps = Partial<OverlayProps> & Pick<AnchoredOverlayProps, 'align'> & {
    /**
     * Recommended: `ActionList`
     */
    children: React.ReactNode;
};
export declare const ActionMenu: React.FC<React.PropsWithChildren<ActionMenuProps>> & {
    Button: React.ForwardRefExoticComponent<Pick<ButtonProps, string | number | symbol> & React.RefAttributes<React.RefObject<HTMLElement> | undefined>>;
    Anchor: React.ForwardRefExoticComponent<ActionMenuAnchorProps & React.RefAttributes<React.RefObject<HTMLElement> | undefined>>;
    Overlay: React.FC<React.PropsWithChildren<MenuOverlayProps>>;
    Divider: React.FC<React.PropsWithChildren<SxProp>>;
};
export {};
