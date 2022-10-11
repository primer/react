import { MaxWidthProps, MinWidthProps, WidthProps } from 'styled-system';
import { SxProp } from './sx';
import { FormValidationStatus } from './utils/types/FormValidationStatus';
export declare type TextInputSizes = 'small' | 'medium' | 'large';
export declare type StyledBaseWrapperProps = {
    block?: boolean;
    contrast?: boolean;
    disabled?: boolean;
    hasTrailingAction?: boolean;
    isInputFocused?: boolean;
    monospace?: boolean;
    validationStatus?: FormValidationStatus;
} & WidthProps & MinWidthProps & MaxWidthProps & SxProp;
export declare type StyledWrapperProps = {
    hasLeadingVisual?: boolean;
    hasTrailingVisual?: boolean;
    /** @deprecated Use `size` prop instead */
    variant?: TextInputSizes;
    size?: TextInputSizes;
} & StyledBaseWrapperProps;
export declare const textInputHorizPadding = "12px";
export declare const TextInputBaseWrapper: import("styled-components").StyledComponent<"span", any, {
    block?: boolean | undefined;
    contrast?: boolean | undefined;
    disabled?: boolean | undefined;
    hasTrailingAction?: boolean | undefined;
    isInputFocused?: boolean | undefined;
    monospace?: boolean | undefined;
    validationStatus?: FormValidationStatus | undefined;
} & WidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.Width<import("styled-system").TLengthStyledSystem>> & MinWidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.MinWidth<import("styled-system").TLengthStyledSystem>> & MaxWidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.MaxWidth<import("styled-system").TLengthStyledSystem>> & SxProp, never>;
declare const TextInputWrapper: import("styled-components").StyledComponent<"span", any, {
    block?: boolean | undefined;
    contrast?: boolean | undefined;
    disabled?: boolean | undefined;
    hasTrailingAction?: boolean | undefined;
    isInputFocused?: boolean | undefined;
    monospace?: boolean | undefined;
    validationStatus?: FormValidationStatus | undefined;
} & WidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.Width<import("styled-system").TLengthStyledSystem>> & MinWidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.MinWidth<import("styled-system").TLengthStyledSystem>> & MaxWidthProps<Required<import("styled-system").Theme<import("styled-system").TLengthStyledSystem>>, import("csstype").Property.MaxWidth<import("styled-system").TLengthStyledSystem>> & SxProp & {
    hasLeadingVisual?: boolean | undefined;
    hasTrailingVisual?: boolean | undefined;
    /** @deprecated Use `size` prop instead */
    variant?: TextInputSizes | undefined;
    size?: TextInputSizes | undefined;
}, never>;
export default TextInputWrapper;
