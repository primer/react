/// <reference types="react" />
import { To } from 'history';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const TabNavBase: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare type TabNavProps = ComponentProps<typeof TabNavBase>;
declare function TabNav({ children, 'aria-label': ariaLabel, ...rest }: TabNavProps): JSX.Element;
declare const TabNavLink: import("styled-components").StyledComponent<"a", any, {
    to?: To | undefined;
    selected?: boolean | undefined;
} & SxProp, never>;
export declare type TabNavLinkProps = ComponentProps<typeof TabNavLink>;
declare const _default: typeof TabNav & {
    Link: import("styled-components").StyledComponent<"a", any, {
        to?: To | undefined;
        selected?: boolean | undefined;
    } & SxProp, never>;
};
export default _default;
