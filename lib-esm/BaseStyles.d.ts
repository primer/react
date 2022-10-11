/// <reference types="react" />
import { SystemCommonProps, SystemTypographyProps } from './constants';
import { ComponentProps } from './utils/types';
import 'focus-visible';
declare const Base: import("styled-components").StyledComponent<"div", any, SystemTypographyProps & SystemCommonProps, never>;
export declare type BaseStylesProps = ComponentProps<typeof Base>;
declare function BaseStyles(props: BaseStylesProps): JSX.Element;
declare namespace BaseStyles {
    var defaultProps: {
        color: string;
        fontFamily: string;
        lineHeight: string;
    };
}
export default BaseStyles;
