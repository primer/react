/// <reference types="react" />
import { WidthProps } from 'styled-system';
import { SxProp } from './sx';
declare type ProgressProp = {
    progress?: string | number;
};
declare const sizeMap: {
    small: string;
    large: string;
    default: string;
};
declare type StyledProgressContainerProps = {
    inline?: boolean;
    barSize?: keyof typeof sizeMap;
} & WidthProps & SxProp;
export declare type ProgressBarProps = {
    bg: string;
} & StyledProgressContainerProps & ProgressProp;
declare function ProgressBar({ progress, bg, ...rest }: ProgressBarProps): JSX.Element;
declare namespace ProgressBar {
    var defaultProps: {
        bg: string;
        barSize: string;
    };
}
export default ProgressBar;
