import { VariantType } from './types';
import { Theme } from '../ThemeProvider';
export declare const TEXT_ROW_HEIGHT = "20px";
export declare const getVariantStyles: (variant?: VariantType, theme?: Theme | undefined) => {
    color: string;
    backgroundColor: string;
    boxShadow: string;
    '&:hover:not([disabled])': {
        backgroundColor: string;
    };
    '&:active:not([disabled])': {
        backgroundColor: string;
        borderColor: string;
    };
    '&:disabled': {
        color: string;
        '[data-component=ButtonCounter]': {
            color: string;
        };
    };
    '&[aria-expanded=true]': {
        backgroundColor: string;
        borderColor: string;
    };
} | {
    color: string;
    backgroundColor: string;
    borderColor: string;
    boxShadow: string;
    '&:hover:not([disabled])': {
        color: string;
        backgroundColor: string;
    };
    '&:focus:not([disabled])': {
        boxShadow: string;
    };
    '&:focus-visible:not([disabled])': {
        boxShadow: string;
    };
    '&:active:not([disabled])': {
        backgroundColor: string;
        boxShadow: string;
    };
    '&:disabled': {
        color: string;
        backgroundColor: string;
        '[data-component=ButtonCounter]': {
            color: string;
        };
    };
    '[data-component=ButtonCounter]': {
        backgroundColor: string;
        color: string;
    };
    '&[aria-expanded=true]': {
        backgroundColor: string;
        boxShadow: string;
    };
} | {
    color: string;
    backgroundColor: string;
    boxShadow: string;
    '&:hover:not([disabled])': {
        color: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
        '[data-component=ButtonCounter]': {
            backgroundColor: string;
            color: string;
        };
    };
    '&:active:not([disabled])': {
        color: string;
        backgroundColor: string;
        boxShadow: string;
        borderColor: string;
    };
    '&:disabled': {
        color: string;
        backgroundColor: string;
        borderColor: string;
        '[data-component=ButtonCounter]': {
            color: string;
            backgroundColor: string;
        };
    };
    '[data-component=ButtonCounter]': {
        color: string;
        backgroundColor: string;
    };
    '&[aria-expanded=true]': {
        color: string;
        backgroundColor: string;
        boxShadow: string;
        borderColor: string;
    };
} | {
    color: string;
    backgroundColor: string;
    border: string;
    boxShadow: string;
    '&:hover:not([disabled])': {
        backgroundColor: string;
    };
    '&:active:not([disabled])': {
        backgroundColor: string;
    };
    '&:disabled': {
        color: string;
        '[data-component=ButtonCounter]': {
            color: string;
        };
    };
    '&[aria-expanded=true]': {
        backgroundColor: string;
    };
} | {
    color: string;
    boxShadow: string;
    borderColor: string;
    backgroundColor: string;
    '&:hover:not([disabled])': {
        color: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
        '[data-component=ButtonCounter]': {
            backgroundColor: string;
            color: string;
        };
    };
    '&:active:not([disabled])': {
        color: string;
        backgroundColor: string;
        boxShadow: string;
        borderColor: string;
    };
    '&:disabled': {
        color: string;
        backgroundColor: string;
        borderColor: string;
        '[data-component=ButtonCounter]': {
            backgroundColor: string;
            color: string;
        };
    };
    '[data-component=ButtonCounter]': {
        backgroundColor: string;
        color: string;
    };
    '&[aria-expanded=true]': {
        color: string;
        backgroundColor: string;
        boxShadow: string;
        borderColor: string;
    };
};
export declare const getSizeStyles: (size: string | undefined, variant: VariantType | undefined, iconOnly: boolean) => {
    paddingY: string;
    paddingX: string;
    fontSize: number;
    '[data-component=ButtonCounter]': {
        fontSize: number;
    };
};
export declare const getBaseStyles: (theme?: Theme | undefined) => {
    borderRadius: string;
    border: string;
    borderColor: any;
    fontFamily: string;
    fontWeight: string;
    lineHeight: string;
    whiteSpace: string;
    verticalAlign: string;
    cursor: string;
    appearance: string;
    userSelect: string;
    textDecoration: string;
    textAlign: string;
    '&:disabled': {
        cursor: string;
    };
    '&:disabled svg': {
        opacity: string;
    };
    '@media (forced-colors: active)': {
        '&:focus': {
            outline: string;
        };
    };
};
export declare const getButtonStyles: (theme?: Theme | undefined) => {
    display: string;
    gridTemplateAreas: string;
    '& > :not(:last-child)': {
        mr: string;
    };
    '[data-component="leadingIcon"]': {
        gridArea: string;
    };
    '[data-component="text"]': {
        gridArea: string;
    };
    '[data-component="trailingIcon"]': {
        gridArea: string;
    };
    borderRadius: string;
    border: string;
    borderColor: any;
    fontFamily: string;
    fontWeight: string;
    lineHeight: string;
    whiteSpace: string;
    verticalAlign: string;
    cursor: string;
    appearance: string;
    userSelect: string;
    textDecoration: string;
    textAlign: string;
    '&:disabled': {
        cursor: string;
    };
    '&:disabled svg': {
        opacity: string;
    };
    '@media (forced-colors: active)': {
        '&:focus': {
            outline: string;
        };
    };
};
