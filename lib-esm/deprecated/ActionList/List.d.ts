import React, { Key } from 'react';
import type { AriaRole } from '../../utils/types';
import { Group, GroupProps } from './Group';
import { ItemProps } from './Item';
import { Merge } from '../../utils/types/Merge';
declare type RenderItemFn = (props: ItemProps) => React.ReactElement;
export declare type ItemInput = Merge<React.ComponentPropsWithoutRef<'div'>, ItemProps> | ((Partial<ItemProps> & {
    renderItem: RenderItemFn;
}) & {
    key?: Key;
});
/**
 * Contract for props passed to the `List` component.
 */
export interface ListPropsBase {
    /**
     * A collection of `Item` props and `Item`-level custom `Item` renderers.
     */
    items: ItemInput[];
    /**
     * The ARIA role describing the function of `List` component. `listbox` is a common value.
     */
    role?: AriaRole;
    /**
     * id to attach to the base DOM node of the list
     */
    id?: string;
    /**
     * A `List`-level custom `Item` renderer. Every `Item` within this `List`
     * without a `Group`-level or `Item`-level custom `Item` renderer will be
     * rendered using this function component.
     */
    renderItem?: RenderItemFn;
    /**
     * A `List`-level custom `Group` renderer. Every `Group` within this `List`
     * without a `Group`-level custom `Item` renderer will be rendered using
     * this function component.
     */
    renderGroup?: typeof Group;
    /**
     * Style variations. Usage is discretionary.
     *
     * - `"inset"` - `List` children are offset (vertically and horizontally) from `List`’s edges
     * - `"full"` - `List` children are flush (vertically and horizontally) with `List` edges
     */
    variant?: 'inset' | 'full';
    /**
     *  For `Item`s which can be selected, whether `multiple` `Item`s or a `single` `Item` can be selected
     */
    selectionVariant?: 'single' | 'multiple';
    /**
     * Whether to display a divider above each `Item` in this `List` when it does not follow a `Header` or `Divider`.
     */
    showItemDividers?: boolean;
}
/**
 * Contract for props passed to the `List` component, when its `Item`s are collected in `Group`s.
 */
export interface GroupedListProps extends ListPropsBase {
    /**
     * A collection of `Group` props (except `items`), plus a unique group identifier
     * and `Group`-level custom `Item` or `Group` renderers.
     */
    groupMetadata: ((Omit<GroupProps, 'items'> | Omit<Partial<GroupProps> & {
        renderItem?: RenderItemFn;
        renderGroup?: typeof Group;
    }, 'items'>) & {
        groupId: string;
    })[];
    /**
     * A collection of `Item` props, plus associated group identifiers
     * and `Item`-level custom `Item` renderers.
     */
    items: ((ItemProps | (Partial<ItemProps> & {
        renderItem: RenderItemFn;
    })) & {
        groupId: string;
    })[];
}
/**
 * Contract for props passed to the `List` component.
 */
export declare type ListProps = ListPropsBase | GroupedListProps;
/**
 * Lists `Item`s, either grouped or ungrouped, with a `Divider` between each `Group`.
 */
export declare const List: React.ForwardRefExoticComponent<ListProps & React.RefAttributes<HTMLDivElement>>;
export {};
