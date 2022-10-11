/// <reference types="hoist-non-react-statics" />
import { Location } from 'history';
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const Header: import("styled-components").StyledComponent<"div", any, SxProp, never>;
declare const HeaderItem: import("styled-components").StyledComponent<"div", any, {
    full?: boolean | undefined;
} & SxProp, never>;
declare const HeaderLink: import("styled-components").StyledComponent<"a", any, {
    to?: string | Location<import("history").State> | undefined;
} & SxProp, never>;
export declare type HeaderProps = ComponentProps<typeof Header>;
export declare type HeaderLinkProps = ComponentProps<typeof HeaderLink>;
export declare type HeaderItemProps = ComponentProps<typeof HeaderItem>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, SxProp, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Link: import("styled-components").StyledComponent<"a", any, {
        to?: string | Location<import("history").State> | undefined;
    } & SxProp, never>;
    Item: import("styled-components").StyledComponent<"div", any, {
        full?: boolean | undefined;
    } & SxProp, never>;
};
export default _default;
