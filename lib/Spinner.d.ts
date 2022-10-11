/// <reference types="react" />
import { SxProp } from './sx';
import { ComponentProps } from './utils/types';
declare const sizeMap: {
    small: string;
    medium: string;
    large: string;
};
export interface SpinnerInternalProps {
    /** Sets the width and height of the spinner. */
    size?: keyof typeof sizeMap;
}
declare function Spinner({ size: sizeKey, ...props }: SpinnerInternalProps): JSX.Element;
declare const StyledSpinner: import("styled-components").StyledComponent<typeof Spinner, any, SxProp, never>;
export declare type SpinnerProps = ComponentProps<typeof StyledSpinner>;
export default StyledSpinner;
