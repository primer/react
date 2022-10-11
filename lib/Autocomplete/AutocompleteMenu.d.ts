import React from 'react';
import { ItemProps } from '../deprecated/ActionList';
import { ComponentProps, MandateProps } from '../utils/types';
declare type OnSelectedChange<T> = (item: T | T[]) => void;
declare type AutocompleteMenuItem = MandateProps<ItemProps, 'id'>;
declare type AutocompleteItemProps<T = Record<string, any>> = AutocompleteMenuItem & {
    metadata?: T;
};
export declare type AutocompleteMenuInternalProps<T extends AutocompleteItemProps> = {
    /**
     * A menu item that is used to allow users make a selection that is not available in the array passed to the `items` prop.
     * This menu item gets appended to the end of the list of options.
     */
    addNewItem?: Omit<T, 'onAction' | 'leadingVisual' | 'id'> & {
        handleAddItem: (item: Omit<T, 'onAction' | 'leadingVisual'>) => void;
    };
    /**
     * The text that appears in the menu when there are no options in the array passed to the `items` prop.
     */
    emptyStateText?: React.ReactNode | false;
    /**
     * A custom function used to filter the options in the array passed to the `items` prop.
     * By default, we filter out items that don't match the value of the autocomplete text input. The default filter is not case-sensitive.
     */
    filterFn?: (item: T, i: number) => boolean;
    /**
     * The options for field values that are displayed in the dropdown menu.
     * One or more may be selected depending on the value of the `selectionVariant` prop.
     */
    items: T[];
    /**
     * Whether the data is loaded for the menu items
     */
    loading?: boolean;
    /**
     * The IDs of the selected items
     */
    selectedItemIds: Array<string | number>;
    /**
     * The sort function that is applied to the options in the array passed to the `items` prop after the user closes the menu.
     * By default, selected items are sorted to the top after the user closes the menu.
     */
    sortOnCloseFn?: (itemIdA: string | number, itemIdB: string | number) => number;
    /**
     * Whether there can be one item selected from the menu or multiple items selected from the menu
     */
    selectionVariant?: 'single' | 'multiple';
    /**
     * Function that gets called when the menu is opened or closed
     */
    onOpenChange?: (open: boolean) => void;
    /**
     * The function that is called when an item in the list is selected or deselected
     */
    onSelectedChange?: OnSelectedChange<T>;
    /**
     * If the menu is rendered in a scrolling element other than the `Autocomplete.Overlay` component,
     * pass the ref of that element to `customScrollContainerRef` to ensure the container automatically
     * scrolls when the user highlights an item in the menu that is outside the scroll container
     */
    customScrollContainerRef?: React.MutableRefObject<HTMLElement | null>;
} & Pick<React.AriaAttributes, 'aria-labelledby'>;
declare function AutocompleteMenu<T extends AutocompleteItemProps>(props: AutocompleteMenuInternalProps<T>): JSX.Element;
declare namespace AutocompleteMenu {
    var defaultProps: {
        emptyStateText: string;
        selectionVariant: string;
    };
    var displayName: string;
}
export declare type AutocompleteMenuProps = ComponentProps<typeof AutocompleteMenu>;
export default AutocompleteMenu;
