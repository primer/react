import React from 'react';
import { ForwardRefComponent as PolymorphicForwardRefComponent } from '../utils/polymorphic';
import { ActionListItemProps } from './shared';
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
export declare type ActionListLinkItemProps = Pick<ActionListItemProps, 'active' | 'children' | 'sx'> & LinkProps;
export declare const LinkItem: PolymorphicForwardRefComponent<"a", ActionListLinkItemProps>;
export {};
