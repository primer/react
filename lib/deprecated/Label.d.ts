import { BorderColorProps } from 'styled-system';
import { SxProp } from '../sx';
import { ComponentProps } from '../utils/types';
/** @deprecated Use the new Label instead. See https://primer.style/react/Label for more details. */
declare const Label: import("styled-components").StyledComponent<"span", any, {
    variant?: "small" | "medium" | "large" | "xl" | undefined;
    dropshadow?: boolean | undefined;
    outline?: boolean | undefined;
} & BorderColorProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, string | number | symbol> & SxProp, never>;
export declare type LabelProps = ComponentProps<typeof Label>;
export default Label;
