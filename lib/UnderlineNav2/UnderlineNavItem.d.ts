import React from 'react';
import { SxProp } from '../sx';
import { IconProps } from '@primer/octicons-react';
import { ForwardRefComponent as PolymorphicForwardRefComponent } from '../utils/polymorphic';
declare type LinkProps = {
    download?: string;
    href?: string;
    hrefLang?: string;
    media?: string;
    ping?: string;
    rel?: string;
    target?: string;
    type?: string;
    referrerPolicy?: React.AnchorHTMLAttributes<HTMLAnchorElement>['referrerPolicy'];
};
export declare type UnderlineNavItemProps = {
    /**
     * Primary content for an NavLink
     */
    children?: React.ReactNode;
    /**
     * Callback that will trigger both on click selection and keyboard selection.
     */
    onSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void;
    /**
     * Is the `Link` is currently selected?
     */
    selected?: boolean;
    /**
     *  Icon before the text
     */
    icon?: React.FunctionComponent<IconProps>;
    as?: React.ElementType;
    /**
     * Counter
     */
    counter?: number;
} & SxProp & LinkProps;
export declare const UnderlineNavItem: PolymorphicForwardRefComponent<"a", UnderlineNavItemProps>;
export {};
