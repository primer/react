/// <reference types="react" />
import { GroupedListProps, ListPropsBase, ItemInput } from '../ActionList/List';
import { OverlayProps } from '../../Overlay';
import { AnchoredOverlayWrapperAnchorProps } from '../../AnchoredOverlay/AnchoredOverlay';
interface DropdownMenuBaseProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
    /**
     * A placeholder value to display on the trigger button when no selection has been made.
     */
    placeholder?: string;
    /**
     * An `ItemProps` item from the list of `items` which is currently selected.  This item will receive a checkmark next to it in the menu.
     */
    selectedItem?: ItemInput;
    /**
     * A callback which receives the selected item or `undefined` when an item is activated in the menu.  If the activated item is the same as the current
     * `selectedItem`, `undefined` will be passed.
     */
    onChange?: (item?: ItemInput) => unknown;
    /**
     * Props to be spread on the internal `Overlay` component.
     */
    overlayProps?: Partial<OverlayProps>;
    /**
     * If defined, will control the open/closed state of the overlay. If not defined, the overlay will manage its own state (in other words, an
     * uncontrolled component). Must be used in conjunction with `onOpenChange`.
     */
    open?: boolean;
    /**
     * If defined, will control the open/closed state of the overlay. Must be used in conjunction with `open`.
     */
    onOpenChange?: (open: boolean) => void;
}
export declare type DropdownMenuProps = DropdownMenuBaseProps & AnchoredOverlayWrapperAnchorProps;
/**
 * @deprecated Use ActionMenu with ActionList instead. See https://primer.style/react/ActionMenu#with-selection for more details.
 */
export declare function DropdownMenu({ renderAnchor, anchorRef: externalAnchorRef, placeholder, selectedItem, onChange, overlayProps, items, open, onOpenChange, ...listProps }: DropdownMenuProps): JSX.Element;
export declare namespace DropdownMenu {
    var displayName: string;
}
export {};
