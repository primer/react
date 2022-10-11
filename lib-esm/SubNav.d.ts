import { To } from 'history';
import React from 'react';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const SubNavBase: import("styled-components").StyledComponent<"nav", any, SxProp, never>;
export declare type SubNavProps = {
    actions?: React.ReactNode;
    align?: 'right';
    full?: boolean;
    label?: string;
} & ComponentProps<typeof SubNavBase>;
declare function SubNav({ actions, className, children, label, ...rest }: SubNavProps): JSX.Element;
export declare type SubNavLinksProps = SxProp;
declare const SubNavLink: import("styled-components").StyledComponent<"a", any, {
    to?: To | undefined;
    selected?: boolean | undefined;
} & SxProp, never>;
export declare type SubNavLinkProps = ComponentProps<typeof SubNavLink>;
declare const _default: typeof SubNav & {
    Link: import("styled-components").StyledComponent<"a", any, {
        to?: To | undefined;
        selected?: boolean | undefined;
    } & SxProp, never>;
    Links: import("styled-components").StyledComponent<"div", any, SxProp, never>;
};
export default _default;
