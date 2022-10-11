/// <reference types="react" />
import { Theme } from './ThemeProvider';
declare type Location = 'top' | 'top-left' | 'top-right' | 'right' | 'right-top' | 'right-bottom' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'left-top' | 'left-bottom';
export declare type CaretProps = {
    bg?: string;
    borderColor?: string;
    borderWidth?: string | number;
    size?: number;
    location?: Location;
    theme?: Theme;
};
declare function Caret(props: CaretProps): JSX.Element;
declare namespace Caret {
    var locations: string[];
    var defaultProps: {
        bg: string;
        borderColor: string;
        borderWidth: number;
    };
}
export default Caret;
