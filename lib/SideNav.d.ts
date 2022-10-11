/// <reference types="hoist-non-react-statics" />
import { To } from 'history';
import { ComponentProps } from './utils/types';
import React from 'react';
import { SxProp } from './sx';
declare type SideNavBaseProps = {
    variant?: 'lightweight' | 'normal';
    bordered?: boolean;
    className?: string;
    children?: React.ReactNode;
    'aria-label'?: string;
};
declare function SideNavBase({ variant, className, bordered, children, 'aria-label': ariaLabel }: SideNavBaseProps): JSX.Element;
declare const SideNav: import("styled-components").StyledComponent<typeof SideNavBase, any, SxProp, never>;
declare type StyledSideNavLinkProps = {
    to?: To;
    selected?: boolean;
    variant?: 'full' | 'normal';
};
declare const SideNavLink: import("styled-components").StyledComponent<"a", any, {
    hoverColor?: string | undefined;
    muted?: boolean | undefined;
    underline?: boolean | undefined;
} & SxProp & StyledSideNavLinkProps, never>;
export declare type SideNavProps = ComponentProps<typeof SideNav>;
export declare type SideNavLinkProps = ComponentProps<typeof SideNavLink>;
declare const _default: string & import("styled-components").StyledComponentBase<typeof SideNavBase, any, SxProp, never> & import("hoist-non-react-statics").NonReactStatics<typeof SideNavBase, {}> & {
    Link: import("styled-components").StyledComponent<"a", any, {
        hoverColor?: string | undefined;
        muted?: boolean | undefined;
        underline?: boolean | undefined;
    } & SxProp & StyledSideNavLinkProps, never>;
};
/** @deprecated Use [NavList](https://primer.style/react/NavList) instead */
export default _default;
