import { To } from 'history';
import React from 'react';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const UnderlineNavBase: import("styled-components").StyledComponent<"nav", any, SxProp, never>;
export declare type UnderlineNavProps = {
    actions?: React.ReactNode;
    align?: 'right';
    full?: boolean;
    label?: string;
} & ComponentProps<typeof UnderlineNavBase>;
declare function UnderlineNav({ actions, className, align, children, full, label, theme, ...rest }: UnderlineNavProps): JSX.Element;
declare const UnderlineNavLink: import("styled-components").StyledComponent<"a", any, {
    to?: To | undefined;
    selected?: boolean | undefined;
} & SxProp, never>;
export declare type UnderlineNavLinkProps = ComponentProps<typeof UnderlineNavLink>;
declare const _default: typeof UnderlineNav & {
    Link: import("styled-components").StyledComponent<"a", any, {
        to?: To | undefined;
        selected?: boolean | undefined;
    } & SxProp, never>;
};
export default _default;
