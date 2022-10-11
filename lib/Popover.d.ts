/// <reference types="hoist-non-react-statics" />
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare type CaretPosition = 'top' | 'bottom' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left-bottom' | 'left-top' | 'right-bottom' | 'right-top';
declare const Popover: import("styled-components").StyledComponent<"div", any, {
    caret?: CaretPosition | undefined;
    relative?: boolean | undefined;
    open?: boolean | undefined;
} & SxProp, never>;
declare const PopoverContent: import("styled-components").StyledComponent<"div", any, SxProp, never>;
export declare type PopoverProps = ComponentProps<typeof Popover>;
export declare type PopoverContentProps = ComponentProps<typeof PopoverContent>;
declare const _default: string & import("styled-components").StyledComponentBase<"div", any, {
    caret?: CaretPosition | undefined;
    relative?: boolean | undefined;
    open?: boolean | undefined;
} & SxProp, never> & import("hoist-non-react-statics").NonReactStatics<never, {}> & {
    Content: import("styled-components").StyledComponent<"div", any, SxProp, never>;
};
export default _default;
