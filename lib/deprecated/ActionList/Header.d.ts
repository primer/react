import React from 'react';
import { SxProp } from '../../sx';
/**
 * Contract for props passed to the `Header` component.
 */
export interface HeaderProps extends React.ComponentPropsWithoutRef<'div'>, SxProp {
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
    title: string;
    /**
     * Secondary text which provides additional information about a `Group`.
     */
    auxiliaryText?: string;
}
export declare const StyledHeader: import("styled-components").StyledComponent<"div", any, {
    variant: HeaderProps['variant'];
} & SxProp, never>;
/**
 * Displays the name and description of a `Group`.
 */
export declare function Header({ variant, title, auxiliaryText, children: _children, ...props }: HeaderProps): JSX.Element;
