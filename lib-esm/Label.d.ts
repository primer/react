import { SxProp, BetterSystemStyleObject } from './sx';
export declare type LabelProps = {
    /** The color of the label */
    variant?: LabelColorOptions;
    /** How large the label is rendered */
    size?: LabelSizeKeys;
} & SxProp;
export declare type LabelColorOptions = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'attention' | 'severe' | 'danger' | 'done' | 'sponsors';
declare type LabelSizeKeys = 'small' | 'large';
export declare const variants: Record<LabelColorOptions, BetterSystemStyleObject>;
declare const Label: import("styled-components").StyledComponent<"span", any, {
    /** The color of the label */
    variant?: LabelColorOptions | undefined;
    /** How large the label is rendered */
    size?: LabelSizeKeys | undefined;
} & SxProp, never>;
export default Label;
