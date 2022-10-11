/// <reference types="react" />
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const TooltipBase: import("styled-components").StyledComponent<"span", any, SxProp, never>;
export declare type TooltipProps = {
    direction?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';
    text?: string;
    noDelay?: boolean;
    align?: 'left' | 'right';
    wrap?: boolean;
} & ComponentProps<typeof TooltipBase>;
declare function Tooltip({ direction, children, className, text, noDelay, align, wrap, ...rest }: TooltipProps): JSX.Element;
declare namespace Tooltip {
    var alignments: string[];
    var directions: string[];
}
export default Tooltip;
