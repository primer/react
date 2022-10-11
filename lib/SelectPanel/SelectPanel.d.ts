/// <reference types="react" />
import { FilteredActionListProps } from '../FilteredActionList';
import { OverlayProps } from '../Overlay';
import { ItemInput } from '../deprecated/ActionList/List';
import { AnchoredOverlayProps } from '../AnchoredOverlay';
import { AnchoredOverlayWrapperAnchorProps } from '../AnchoredOverlay/AnchoredOverlay';
interface SelectPanelSingleSelection {
    selected: ItemInput | undefined;
    onSelectedChange: (selected: ItemInput | undefined) => void;
}
interface SelectPanelMultiSelection {
    selected: ItemInput[];
    onSelectedChange: (selected: ItemInput[]) => void;
}
interface SelectPanelBaseProps {
    onOpenChange: (open: boolean, gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection') => void;
    placeholder?: string;
    overlayProps?: Partial<OverlayProps>;
}
export declare type SelectPanelProps = SelectPanelBaseProps & Omit<FilteredActionListProps, 'selectionVariant'> & Pick<AnchoredOverlayProps, 'open'> & AnchoredOverlayWrapperAnchorProps & (SelectPanelSingleSelection | SelectPanelMultiSelection);
export declare function SelectPanel({ open, onOpenChange, renderAnchor, anchorRef: externalAnchorRef, placeholder, selected, onSelectedChange, filterValue: externalFilterValue, onFilterChange: externalOnFilterChange, items, textInputProps, overlayProps, sx, ...listProps }: SelectPanelProps): JSX.Element;
export declare namespace SelectPanel {
    var displayName: string;
}
export {};
