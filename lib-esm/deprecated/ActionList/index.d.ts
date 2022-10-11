/// <reference types="react" />
import { Group } from './Group';
import { Divider } from './Divider';
export type { ListProps as ActionListProps } from './List';
export type { GroupProps } from './Group';
export type { ItemProps } from './Item';
/**
 * @deprecated Use ActionList with composable API instead. See https://primer.style/react/ActionList for more details.
 */
export declare const ActionList: import("react").ForwardRefExoticComponent<import("./List").ListProps & import("react").RefAttributes<HTMLDivElement>> & {
    /** Collects related `Items` in an `ActionList`. */
    Group: typeof Group;
    /** An actionable or selectable `Item` with an optional icon and description. */
    Item: import("../../utils/polymorphic").ForwardRefComponent<"div", import("./Item").ItemProps>;
    /** Visually separates `Item`s or `Group`s in an `ActionList`. */
    Divider: typeof Divider;
};
