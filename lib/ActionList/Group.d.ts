import React from 'react';
import { SxProp } from '../sx';
import { ActionListProps } from './List';
import { AriaRole } from '../utils/types';
export declare type ActionListGroupProps = {
    /**
     * Style variations. Usage is discretionary.
     *
     * - `"filled"` - Superimposed on a background, offset from nearby content
     * - `"subtle"` - Relatively less offset from nearby content
     */
    variant?: 'subtle' | 'filled';
    /**
     * Primary text which names a `Group`.
     */
    title?: string;
    /**
     * Secondary text which provides additional information about a `Group`.
     */
    auxiliaryText?: string;
    /**
     * The ARIA role describing the function of the list inside `Group` component. `listbox` or `menu` are a common values.
     */
    role?: AriaRole;
} & SxProp & {
    /**
     * Whether multiple Items or a single Item can be selected in the Group. Overrides value on ActionList root.
     */
    selectionVariant?: ActionListProps['selectionVariant'] | false;
};
declare type ContextProps = Pick<ActionListGroupProps, 'selectionVariant'>;
export declare const GroupContext: React.Context<ContextProps>;
export declare const Group: React.FC<React.PropsWithChildren<ActionListGroupProps>>;
export declare type HeaderProps = Pick<ActionListGroupProps, 'variant' | 'title' | 'auxiliaryText'> & {
    labelId: string;
};
export {};
